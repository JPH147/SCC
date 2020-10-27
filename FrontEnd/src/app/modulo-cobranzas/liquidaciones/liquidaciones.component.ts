import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { VentanaConfirmarComponent } from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { CooperativaConfiguracionService } from 'src/app/modulo-maestro/cooperativa-configuracion/cooperativa-configuracion.service';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.css']
})
export class LiquidacionesComponent implements OnInit, AfterViewInit {

  public ListadoLiquidaciones: LiquidacionDataSource;
  public Columnas: string[] = ['numero', 'fecha', 'tipo', 'cliente_dni', 'monto', 'usuario'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public permiso : Rol ;
  public LiquidacionesForm : FormGroup ;  

  constructor(
    private _store : Store<EstadoSesion> ,
    private _cobranzas: CobranzasService,
    private Dialogo : MatDialog ,
    private _configuracion : CooperativaConfiguracionService ,
    private _notificaciones : Notificaciones ,
    private _builder : FormBuilder
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.ListadoLiquidaciones = new LiquidacionDataSource(this._cobranzas) ;
    this.CargarData() ;
    // this.ListadoLiquidaciones.CargarInformacion(0,"","","","",this.fecha_inicio,this.fecha_fin,1,10,"fecha desc");
  }

  ngAfterViewInit () {
    merge(
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      this.LiquidacionesForm.get('tipo_transaccion').valueChanges ,
      this.LiquidacionesForm.get('codigo').valueChanges ,
      this.LiquidacionesForm.get('cliente_dni').valueChanges ,
      this.LiquidacionesForm.get('cliente').valueChanges ,
      this.LiquidacionesForm.get('usuario').valueChanges ,
      this.LiquidacionesForm.get('fecha_inicio').valueChanges ,
      this.LiquidacionesForm.get('fecha_fin').valueChanges ,
      this.sort.sortChange
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

  CrearFormulario() {
    this.LiquidacionesForm = this._builder.group({
      tipo_transaccion : [0] ,
      codigo : [""] ,
      cliente_dni : [""] ,
      cliente : [""] ,
      usuario : [""] ,
      fecha_inicio : [ new Date((new Date()).valueOf() - 1000*60*60*24*60) ] ,
      fecha_fin : [ new Date() ] ,
    })
  }

  CargarData() {
    this.ListadoLiquidaciones.CargarInformacion(
      this.LiquidacionesForm.get('tipo_transaccion').value ,
      this.LiquidacionesForm.get('codigo').value ,
      this.LiquidacionesForm.get('cliente_dni').value ,
      this.LiquidacionesForm.get('cliente').value ,
      this.LiquidacionesForm.get('usuario').value ,
      this.LiquidacionesForm.get('fecha_inicio').value ,
      this.LiquidacionesForm.get('fecha_fin').value ,
      this.paginator.pageIndex+1 || 1 ,
      this.paginator.pageSize || 10 ,
      this.sort.active +" " + this.sort.direction || "fecha desc"
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  // EliminarLiquidacion(Liquidacion){
  //   let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
  //     data: { objeto: "la Liquidacion", valor: Liquidacion.numero_operacion+" en el banco "+Liquidacion.banco }
  //   })

  //   Ventana.afterClosed().subscribe(res=>{
  //     if (res) {
  //       this.Servicio.EliminarLiquidacionDirecta(Liquidacion.id).subscribe(res=>{
  //         this.CargarData();
  //       });
  //     }
  //   })
  // }
}

export class LiquidacionDataSource implements DataSource<any> {

  private InformacionLiquidaciones = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private _cobranzas: CobranzasService,
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionLiquidaciones.asObservable();
  }

  disconnect() {
    this.InformacionLiquidaciones.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    tipo_transaccion : number ,
    codigo : string ,
    cliente_dni : string ,
    cliente : string ,
    usuario : string ,
    fecha_inicio : Date ,
    fecha_fin : Date ,
    numero_pagina : number ,
    total_pagina : number ,
    orden : string
  ) {
    this.CargandoInformacion.next(true);

    this._cobranzas.ListarLiquidacionTransaccion(
      tipo_transaccion ,
      codigo ,
      cliente_dni ,
      cliente ,
      usuario ,
      fecha_inicio ,
      fecha_fin ,
      numero_pagina ,
      total_pagina ,
      orden ,
    )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if (res) {
        this.TotalResultados.next(res['mensaje']);
        this.InformacionLiquidaciones.next(res['data'].Liquidaciones); 
      } else {
        this.TotalResultados.next(0);
        this.InformacionLiquidaciones.next([]); 
      }
    });
  }

}