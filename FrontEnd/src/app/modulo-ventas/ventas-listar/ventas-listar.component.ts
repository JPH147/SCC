import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import {merge, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {VentaDataSource} from './ventas-listar.dataservice';
import {VentanaConfirmarComponent} from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import {VentasServicio} from './ventas-listar.service'
import { VentaService } from '../ventas/ventas.service';
import { CobranzaJudicialService } from '../../modulo-cobranzas/cobranza-judicial/cobranza-judicial.service';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-ventas-listar',
  templateUrl: './ventas-listar.component.html',
  styleUrls: ['./ventas-listar.component.css'],
})
export class VentasListarComponent implements OnInit, AfterViewInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public ListadoProcesos : Array<any> ;
  public permiso : Rol ;

  public VentasForm : FormGroup ;

  ListadoVentas: VentaDataSource;
  Columnas: string[] = ['stars', 'numero', 'fecha', 'contrato', 'cliente_nombre', 'tipo_venta', 'monto_total', 'cuotas_pagadas' , 'ultima_fecha_pago', 'opciones'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _store : Store<EstadoSesion> ,
    public Dialogo: MatDialog,
    private _route : ActivatedRoute ,
    private _router : Router ,
    private _builder : FormBuilder ,
    private Servicio:VentasServicio,
    private VServicio: VentaService,
    private _judiciales : CobranzaJudicialService ,
  ) {}

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListadoVentas = new VentaDataSource(this.Servicio);

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this._route.queryParams.subscribe(params => {
      params.cliente ? this.VentasForm.get('cliente').setValue(params.cliente) : null ;
      params.dni ? this.VentasForm.get('dni').setValue(params.dni) : null ;
      params.tipo_venta ? this.VentasForm.get('tipo_venta').setValue(params.tipo_venta) : null ;
      params.estado_pagos ? this.VentasForm.get('estado_pagos').setValue(params.estado_pagos) : null ;
      params.fecha_inicio ? this.VentasForm.get('fecha_inicio').setValue(params.fecha_inicio) : null ;
      params.fecha_fin ? this.VentasForm.get('fecha_fin').setValue(params.fecha_fin) : null ;
      params.estado_venta ? this.VentasForm.get('estado_venta').setValue(params.estado_venta) : null ;
      params.pagina_inicio ? this.paginator.pageIndex = params.pagina_inicio : null ;
      params.tamano_pagina ? this.paginator.pageSize = params.tamano_pagina : null ;
      params.sort_active ? this.sort.active = params.sort_active : null ;
      params.sort_direction ? this.sort.direction = params.sort_direction : null ;
      
      this.CargarData() ;
    });
    // this.ListadoVentas.CargarVentas("","",0,0,this.fecha_inicio,this.fecha_fin,1,1,10,"fecha desc");
 }

  ngAfterViewInit () {
    merge(
      this.paginator.page,
      ).pipe(
        tap(() => this.CargarData())
      ).subscribe();

    merge(
      this.VentasForm.valueChanges ,
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
    this.VentasForm = this._builder.group({
      cliente : '' ,
      dni : '' ,
      tipo_venta : 0 ,
      estado_pagos : 0 ,
      fecha_inicio : null ,
      fecha_fin : null ,
      estado_venta : 0
    })
  }

  CargarData() {
    this.ListadoVentas.CargarVentas(
      this.VentasForm.get('cliente').value ,
      this.VentasForm.get('dni').value ,
      this.VentasForm.get('tipo_venta').value ,
      this.VentasForm.get('estado_pagos').value ,
      this.VentasForm.get('fecha_inicio').value ,
      this.VentasForm.get('fecha_fin').value ,
      this.VentasForm.get('estado_venta').value ,
      this.paginator?.pageIndex ? this.paginator.pageIndex + 1 : 1 ,
      this.paginator?.pageSize ? this.paginator.pageSize : 10 ,
      this.sort ? this.sort.active +" " + this.sort.direction : "fecha desc" ,
    );
  }

  AnularVenta(venta){
    let transacciones: Array<any> = [];
    
    let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
      data: {objeto: "la venta", valor: venta.contrato, venta:true}
    })

    Dialogo.afterClosed().subscribe(res=>{
      this.ListadoVentas.CargandoInformacion.next(true) ;
      if (res) {
        if (res.respuesta) {
          this.VServicio.ListarVentaTransacciones(venta.id).subscribe(res2=>{
            transacciones=res2.transaccion ;
            this.VServicio.EliminarVenta(venta.id, res.comentarios, res.monto).subscribe(respuesta=>{
              this.ListadoVentas.CargandoInformacion.next(false) ;
              transacciones.forEach((item)=>{
                this.VServicio.CrearCanjeTransaccion(item.id,new Date(),"AJUSTE POR ANULACION").subscribe()
              })
  
              if (res.monto>0) {
                this.VServicio.CrearVentaCronograma(venta.id,2,res.monto,new Date(), 1).subscribe()
              }
  
              this.CargarData()
            });
          });
        }
      }
    })
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  ListarProcesos( id_venta : number ) {
    this.ListadoProcesos = [] ;
    this._judiciales.ListarProcesosxTransaccion(2, id_venta).subscribe(res=>{
      this.ListadoProcesos = res ;
    })
  }

  VerVenta(tipo, id_venta) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.VentasForm.get('cliente').value ,
        dni : this.VentasForm.get('dni').value ,
        tipo_venta : this.VentasForm.get('tipo_venta').value ,
        estado_pagos : this.VentasForm.get('estado_pagos').value ,
        fecha_inicio : this.VentasForm.get('fecha_inicio').value ,
        fecha_fin : this.VentasForm.get('fecha_fin').value ,
        estado_venta : this.VentasForm.get('estado_venta').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      if ( tipo === 1 ) {
        this._router.navigate([id_venta], {
          relativeTo: this._route
        }) ;
      }
      if ( tipo === 2 ) {
        this._router.navigate(['./salida', id_venta], {
          relativeTo: this._route
        }) ;
      }
    });
  }

  VerProcesoJudicial(id_proceso) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.VentasForm.get('cliente').value ,
        dni : this.VentasForm.get('dni').value ,
        tipo_venta : this.VentasForm.get('tipo_venta').value ,
        estado_pagos : this.VentasForm.get('estado_pagos').value ,
        fecha_inicio : this.VentasForm.get('fecha_inicio').value ,
        fecha_fin : this.VentasForm.get('fecha_fin').value ,
        estado_venta : this.VentasForm.get('estado_venta').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      this._router.navigate(['/cobranzas','cobranza-judicial','ver',id_proceso]) ;      
    })
  }

  NuevoProcesoJudicial(tipo, id_venta) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.VentasForm.get('cliente').value ,
        dni : this.VentasForm.get('dni').value ,
        tipo_venta : this.VentasForm.get('tipo_venta').value ,
        estado_pagos : this.VentasForm.get('estado_pagos').value ,
        fecha_inicio : this.VentasForm.get('fecha_inicio').value ,
        fecha_fin : this.VentasForm.get('fecha_fin').value ,
        estado_venta : this.VentasForm.get('estado_venta').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      if ( tipo === 1 ) {
        this._router.navigate(['/cobranzas','cobranza-judicial','nueva-venta','venta',id_venta]) ;
      }
      if ( tipo === 2 ) {
        this._router.navigate(['/cobranzas','cobranza-judicial','nueva-venta','salida',id_venta]) ;
      }
    })
  }
}
