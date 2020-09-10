import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import {merge, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ProductoService} from '../detalleproductos/productos/productos.service';
import {VentaDataSource} from './ventas-listar.dataservice';
import {VentanaConfirmarComponent} from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import {VentasServicio} from './ventas-listar.service'
import { ClienteService } from '../clientes/clientes.service';
import { VentaService } from '../ventas/ventas.service';
import { CobranzaJudicialService } from '../cobranza-judicial/cobranza-judicial.service';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { Rol } from 'src/app/compartido/modelos/login.modelos';


@Component({
  selector: 'app-ventas-listar',
  templateUrl: './ventas-listar.component.html',
  styleUrls: ['./ventas-listar.component.css'],
  providers:[VentasServicio,ProductoService, ClienteService, VentaService]
})
export class VentasListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public ListadoProcesos : Array<any> ;
  public permiso : Rol ;

  ListadoVentas: VentaDataSource;
  Columnas: string[] = ['numero', 'fecha', 'contrato', 'cliente_nombre', 'tipo_venta', 'monto_total', 'cuotas_pagadas' , 'ultima_fecha_pago', 'opciones'];

  @ViewChild('InputDocumentos', { static: true }) FiltroDocumentos: MatSelect;
  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputDNI', { static: true }) FiltroDNI: ElementRef;
  @ViewChild('InputTipo', { static: true }) FiltroTipo: MatSelect;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _store : Store<EstadoSesion> ,
    public Dialogo: MatDialog,
    private Servicio:VentasServicio,
    private VServicio: VentaService,
    private _judiciales : CobranzaJudicialService ,
  ) {}

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.fecha_inicio = null ;
    this.fecha_fin = null ;

    this.ListadoVentas = new VentaDataSource(this.Servicio);
    this.ListadoVentas.CargarVentas("","",0,0,this.fecha_inicio,this.fecha_fin,1,1,10,"fecha desc");
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

  CargarData() {
    this.ListadoVentas.CargarVentas(
      this.FiltroCliente.nativeElement.value,
      this.FiltroDNI.nativeElement.value,
      this.FiltroTipo.value,
      this.FiltroDocumentos.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction
    );
  }

  AnularVenta(venta){
    
    let transacciones: Array<any> = [];
    
    // Se listan las transacciones que pertenecen a esa venta
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
}
