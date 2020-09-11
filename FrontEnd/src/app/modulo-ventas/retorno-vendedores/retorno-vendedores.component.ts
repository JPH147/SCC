import { Component, OnInit } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { MatDialog } from '@angular/material/dialog';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {SalidaVendedoresService} from '../salida-vendedores/salida-vendedores.service';
import {AgregarVentaComponent} from './agregar-venta/agregar-venta.component';
import { BehaviorSubject } from 'rxjs';
import { VentanaEmergenteGastos} from '../listado-salida-vendedores/ventana-emergente-gastos/ventanaemergente-gastos';

@Component({
  selector: 'app-retorno-vendedores',
  templateUrl: './retorno-vendedores.component.html',
  styleUrls: ['./retorno-vendedores.component.scss'],
})

export class RetornoVendedoresComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(true);

  public ListadoTalonarios: TalonariosDataSource;
  public ListadoProductos: ProductosDataSource;

  public ColumnasTalonarios:string[]=['numero', 'contrato', 'estado', 'observaciones','opciones']
  public ColumnasProductos:string[]=['numero', 'producto', 'serie', 'precio_venta', 'contrato_venta', 'estado_producto','opciones_producto']

  public id_salida:number;
  public pecosa:string;
  public guia:string;
  public fecha_salida:Date;
  public fecha_retorno:Date;
  public destino:string;
  public observacion:string;
  public Talonarios: Array<any>;
  public Productos: Array<any>;
  public ver_vendedores: boolean;
  public ver_productos: boolean;
  public ver_talonarios: boolean;
  public estado_ventas:number;

  constructor(
    private location: Location,
    private Dialogo: MatDialog,
    private route: ActivatedRoute,
    private Servicio: SalidaVendedoresService
  ) { }

  ngOnInit() {

    this.ver_vendedores=true
    this.ver_productos=true;
    this.ver_talonarios=true;
    this.estado_ventas=0;

    this.ListadoTalonarios= new TalonariosDataSource(this.Servicio);
    this.ListadoProductos= new ProductosDataSource(this.Servicio);

    this.route.params.subscribe(params => {
      if(params['idsalida']){
        this.id_salida=params['idsalida'];
        // this.id_salida=70;
        this.SeleccionarSalida();
      }
    })
  }

  SeleccionarSalida(){
    this.Servicio.SeleccionarSalida(this.id_salida).subscribe(res=>{
      this.Cargando.next(false);
      this.pecosa=res['data'].pecosa;
      this.guia=res['data'].guia;
      this.fecha_salida=res['data'].fecha;
      this.fecha_retorno=new Date();
      this.destino=res['data'].destino;
      this.observacion=res['data'].observacion=="" ? "No hay observaciones" : res['data'].observacion;
    })

    this.ListadoTalonarios.CargarInformacion(this.id_salida,0);
    this.ListadoProductos.CargarInformacion(this.id_salida,0);

    this.VerificarEstadoVentas();

  }

  RegistrarVenta(talonario){
    const Ventana = this.Dialogo.open(AgregarVentaComponent, {
      width: '1200px',
      data: {salida: this.id_salida, talonario: talonario, productos: this.Productos}
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.ListadoTalonarios.CargarInformacion(this.id_salida,0);
        this.ListadoProductos.CargarInformacion(this.id_salida,0);
        this.VerificarEstadoVentas()
      }
    })
  }
  
  AnularTalonario(id,estado){
    this.Servicio.AnularSalidaTalonario(id,estado).subscribe(res=>{
      this.ListadoTalonarios.CargarInformacion(this.id_salida,0);
    })
  }

  AnularProducto(producto){
    let ventana = this.Dialogo.open(VentanaEmergenteGastos,{
      width: '1200px',
      data: {id: this.id_salida, pecosa: this.pecosa, monto: producto.precio_minimo, serie:producto.serie}
    })

    ventana.afterClosed().subscribe(res=>{
      if(res){
        this.Servicio.AnularSalidaProducto(producto.id,3).subscribe(res=>{
          // console.log(res)
          this.ListadoProductos.CargarInformacion(this.id_salida,0);
        })
      }
    })
  }

  NoAnularProducto(producto){
    this.Servicio.AnularSalidaProducto(producto.id,1).subscribe(res=>{
      // console.log(res)
      this.ListadoProductos.CargarInformacion(this.id_salida,0);
    })
  }

  VerVendedores(){
    this.ver_vendedores=true;
  }

  NoVerVendedores(){
    this.ver_vendedores=false;
  }

  VerProductos(){
    this.ver_productos=true;
  }

  NoVerProductos(){
    this.ver_productos=false;
  }

  VerTalonarios(){
    this.ver_talonarios=true;
  }

  NoVerTalonarios(){
    this.ver_talonarios=false;
  }

  VerificarEstadoVentas(){
    this.Servicio.ListarSalidaTalonarios(this.id_salida,2).subscribe(res=>{
      res['data'].talonarios.forEach((item)=>{
        if(item.documentos_adjuntos < item.documentos_totales){
          this.estado_ventas++;
        }
      })
    })
  }

  Atras(){
    this.location.back()
  }

}

export class ProductosDataSource implements DataSource<any>{

  public Informacion = new BehaviorSubject<any>([])

  constructor(
    private Servicio: SalidaVendedoresService
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(id_salida,estado){
    this.Servicio.ListarSalidaProductos(id_salida,estado).subscribe(res=>{
      this.Informacion.next(res['data'].productos);
    })
  }
}

export class TalonariosDataSource implements DataSource<any>{

  public Informacion = new BehaviorSubject<any>([])

  constructor(
    private Servicio: SalidaVendedoresService
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(id_salida,estado){
    this.Servicio.ListarSalidaTalonarios(id_salida,estado).subscribe(res=>{
      // console.log(res)
      this.Informacion.next(res['data'].talonarios);
    })
  }

}

export class VentasDataSource implements DataSource<any>{

  public Informacion = new BehaviorSubject<any>([])
  public Total=new BehaviorSubject<any>(0)
  public Comision=new BehaviorSubject<any>(0)

  constructor(
    private Servicio: SalidaVendedoresService
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(id_salida){
    this.Servicio.ListarVentas(id_salida).subscribe(res=>{
      this.Informacion.next(res.array);
      this.Total.next(res.total)
      this.Comision.next(res.comision)
    })
  }

}