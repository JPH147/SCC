import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CreditosService } from '../creditos/creditos.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {VentanaConfirmarComponent} from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { CobranzaJudicialService } from '../../modulo-cobranzas/cobranza-judicial/cobranza-judicial.service';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { Store } from '@ngrx/store';
import { Rol } from 'src/app/compartido/modelos/login.modelos';

@Component({
  selector: 'app-creditos-listar',
  templateUrl: './creditos-listar.component.html',
  styleUrls: ['./creditos-listar.component.css'],
  providers: [CreditosService]
})
export class CreditosListarComponent implements OnInit {

  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputDNI', { static: true }) FiltroDNI: ElementRef;
  @ViewChild('InputTipo', { static: true }) FiltroTipo: MatSelect;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: MatSelect;
  @ViewChild('InputDocumentos', { static: true }) FiltroDocumentos: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public ListadoCreditos: CreditosDataSource;
  public Columnas: string[] = ['stars', 'numero', 'fecha', 'codigo', 'cliente_nombre', 'documentos_adjuntos', 'monto_total', 'cuotas_pagadas' , 'ultima_fecha_pago', 'opciones'];
  
  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Tipos : Array<any>;
  public ListadoProcesos : Array<any> = [] ;

  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Servicio: CreditosService,
    private Dialogo : MatDialog,
    private _judiciales : CobranzaJudicialService
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.ListarTiposCredito();

    this.fecha_inicio = null
    this.fecha_fin = null

    this.ListadoCreditos = new CreditosDataSource(this.Servicio);
    this.ListadoCreditos.CargarCreditos("","",99 ,0,this.fecha_inicio,this.fecha_fin,1,1,10,"fecha desc",new Date().getTime());
  }

  ngAfterViewInit () {

    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });

    merge(
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup') ,
      fromEvent(this.FiltroDNI.nativeElement, 'keyup') ,
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.paginator.pageIndex = 0;
         this.CargarData();
       })
    ).subscribe();
  }

  ListarTiposCredito(){
    this.Servicio.ListarTipos().subscribe(res=>{
      this.Tipos=res;
      // console.log(res)
    })
  }

  CargarData() {
    this.ListadoCreditos.CargarCreditos(
      this.FiltroCliente.nativeElement.value,
      this.FiltroDNI.nativeElement.value,
      this.FiltroTipo.value,
      this.FiltroDocumentos.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction ,
      new Date().getTime()
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  AnularCredito(credito){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el crédito", valor: credito.codigo+"-"+credito.numero_credito }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarCredito(credito.id).subscribe(res=>{
          this.CargarData()
        });
      }
    })
  }

  ListarProcesos( id_credito : number ) {
    this.ListadoProcesos = [] ;

    this._judiciales.ListarProcesosxTransaccion(1, id_credito).subscribe(res=>{
      this.ListadoProcesos = res ;
    })
  }

}

export class CreditosDataSource implements DataSource<any> {

  private InformacionCreditos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);
  private tiempo_consulta = new BehaviorSubject<number>(0) ;

  constructor(
    private Servicio: CreditosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCreditos.asObservable();
  }

  disconnect() {
    this.InformacionCreditos.complete();
    this.CargandoInformacion.complete();
  }

  CargarCreditos(
    cliente:string,
    documento:string,
    tipo_credito:number,
    estado_documentos:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
    orden:string ,
    tiempo_consulta : number 
  ) {
    this.CargandoInformacion.next(true);
    this.tiempo_consulta.next(tiempo_consulta) ;

    this.Servicio.Listar( cliente, documento, tipo_credito, estado_documentos, fecha_inicio, fecha_fin, estado, pagina_inicio, pagina_final, orden, tiempo_consulta )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if ( res['tiempo'] == this.tiempo_consulta.value ) {
        this.TotalResultados.next(res['mensaje']);
        this.InformacionCreditos.next(res['data'].creditos);
      }
    });
  }

}
