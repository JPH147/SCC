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
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-creditos-listar',
  templateUrl: './creditos-listar.component.html',
  styleUrls: ['./creditos-listar.component.css'],
  providers: [CreditosService]
})
export class CreditosListarComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public ListadoCreditos: CreditosDataSource;
  public Columnas: string[] = ['stars', 'numero', 'fecha', 'codigo', 'cliente_nombre', 'documentos_adjuntos', 'monto_total', 'cuotas_pagadas' , 'ultima_fecha_pago', 'opciones'];
  
  public Tipos : Array<any>;
  public ListadoProcesos : Array<any> = [] ;

  public permiso : Rol ;
  public CreditosForm : FormGroup ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private _route : ActivatedRoute ,
    private _router : Router ,
    private _builder : FormBuilder ,
    private Servicio: CreditosService,
    private Dialogo : MatDialog,
    private _judiciales : CobranzaJudicialService ,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListadoCreditos = new CreditosDataSource(this.Servicio);

    this.ListarTiposCredito();

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this._route.queryParams.subscribe(params => {
      params.cliente ? this.CreditosForm.get('cliente').setValue(params.cliente) : null ;
      params.dni ? this.CreditosForm.get('dni').setValue(params.dni) : null ;
      params.tipo_credito ? this.CreditosForm.get('tipo_credito').setValue(params.tipo_credito) : null ;
      params.estado_pagos ? this.CreditosForm.get('estado_pagos').setValue(params.estado_pagos) : null ;
      params.fecha_inicio ? this.CreditosForm.get('fecha_inicio').setValue(params.fecha_inicio) : null ;
      params.fecha_fin ? this.CreditosForm.get('fecha_fin').setValue(params.fecha_fin) : null ;
      params.estado_credito ? this.CreditosForm.get('estado_credito').setValue(params.estado_credito) : null ;
      params.pagina_inicio ? this.paginator.pageIndex = params.pagina_inicio : null ;
      params.tamano_pagina ? this.paginator.pageSize = params.tamano_pagina : null ;
      params.sort_active ? this.sort.active = params.sort_active : null ;
      params.sort_direction ? this.sort.direction = params.sort_direction : null ;
      
      this.CargarData() ;
    });
  }

  ngAfterViewInit () {
    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });

    merge(
      this.CreditosForm.valueChanges ,
      this.paginator.page,
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.CargarData();
       })
    ).subscribe();
  }

  CrearFormulario() {
    this.CreditosForm = this._builder.group({
      cliente : '' ,
      dni : '' ,
      tipo_credito : 99 ,
      estado_pagos : 0 ,
      fecha_inicio : null ,
      fecha_fin : null ,
      estado_credito : 0
    })
  }

  ListarTiposCredito(){
    this.Servicio.ListarTipos().subscribe(res=>{
      this.Tipos=res;
    })
  }

  CargarData() {
    this.ListadoCreditos.CargarCreditos(
      this.CreditosForm.get('cliente').value ,
      this.CreditosForm.get('dni').value ,
      this.CreditosForm.get('tipo_credito').value ,
      this.CreditosForm.get('estado_pagos').value ,
      this.CreditosForm.get('fecha_inicio').value ,
      this.CreditosForm.get('fecha_fin').value ,
      this.CreditosForm.get('estado_credito').value ,
      this.paginator?.pageIndex ? this.paginator.pageIndex + 1 : 1 ,
      this.paginator?.pageSize ? this.paginator.pageSize : 10 ,
      this.sort ? this.sort.active +" " + this.sort.direction : "fecha desc" ,
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
        this.Servicio.EliminarCredito(credito.id,2,true).subscribe(res=>{
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

  VerCredito(id_credito) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.CreditosForm.get('cliente').value ,
        dni : this.CreditosForm.get('dni').value ,
        tipo_credito : this.CreditosForm.get('tipo_credito').value ,
        estado_pagos : this.CreditosForm.get('estado_pagos').value ,
        fecha_inicio : this.CreditosForm.get('fecha_inicio').value ,
        fecha_fin : this.CreditosForm.get('fecha_fin').value ,
        estado_credito : this.CreditosForm.get('estado_credito').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      this._router.navigate(['./ver', id_credito], {
        relativeTo: this._route
      }) ;
    });

  }

  VerProcesoJudicial(id_proceso) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.CreditosForm.get('cliente').value ,
        dni : this.CreditosForm.get('dni').value ,
        tipo_credito : this.CreditosForm.get('tipo_credito').value ,
        estado_pagos : this.CreditosForm.get('estado_pagos').value ,
        fecha_inicio : this.CreditosForm.get('fecha_inicio').value ,
        fecha_fin : this.CreditosForm.get('fecha_fin').value ,
        estado_credito : this.CreditosForm.get('estado_credito').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      this._router.navigate(['/cobranzas','cobranza-judicial','ver',id_proceso]) ;
    });

  }

  NuevoProcesoJudicial(id_credito) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.CreditosForm.get('cliente').value ,
        dni : this.CreditosForm.get('dni').value ,
        tipo_credito : this.CreditosForm.get('tipo_credito').value ,
        estado_pagos : this.CreditosForm.get('estado_pagos').value ,
        fecha_inicio : this.CreditosForm.get('fecha_inicio').value ,
        fecha_fin : this.CreditosForm.get('fecha_fin').value ,
        estado_credito : this.CreditosForm.get('estado_credito').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      this._router.navigate(['/cobranzas','cobranza-judicial','nueva-credito',id_credito]) ;
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
      if ( res ) {
        if ( res['tiempo'] == this.tiempo_consulta.value ) {
          this.TotalResultados.next(res['mensaje']);
          this.InformacionCreditos.next(res['data'].creditos);
        }
      } else {
        this.TotalResultados.next(0) ;
        this.InformacionCreditos.next([]) ;
      }
    });
  }

}
