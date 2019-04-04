import { Component, OnInit } from '@angular/core';
import {MatDialog } from '@angular/material';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {SalidaVendedoresService} from '../salida-vendedores/salida-vendedores.service';
import {AgregarVentaComponent} from './agregar-venta/agregar-venta.component';
import { BehaviorSubject } from 'rxjs';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

@Component({
  selector: 'app-retorno-vendedores',
  templateUrl: './retorno-vendedores.component.html',
  styleUrls: ['./retorno-vendedores.component.scss'],
  providers: [SalidaVendedoresService]
})

export class RetornoVendedoresComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(true);

  public ListadoTalonarios: TalonariosDataSource;
  public ListadoProductos: ProductosDataSource;

  public ColumnasTalonarios:string[]=['numero', 'contrato', 'estado', 'opciones']
  public ColumnasProductos:string[]=['numero', 'producto', 'serie', 'precio_venta', 'contrato_venta', 'estado_producto']

  public id_salida:number;
  public pecosa:string;
  public guia:string;
  public fecha_salida:Date;
  public fecha_retorno:Date;
  public destino:string;
  public observacion:string;
  public Vendedores: Array<any>;
  public Talonarios: Array<any>;
  public Productos: Array<any>;
  public ver_vendedores: boolean;
  public ver_productos: boolean;
  public ver_talonarios: boolean;

  constructor(
    private location: Location,
    private DialogoAgregar: MatDialog,
    private route: ActivatedRoute,
    private Servicio: SalidaVendedoresService
  ) { }

  ngOnInit() {

    this.ver_vendedores=true
    this.ver_productos=true;
    this.ver_talonarios=true;

    this.ListadoTalonarios= new TalonariosDataSource(this.Servicio);
    this.ListadoProductos= new ProductosDataSource(this.Servicio);

    this.route.params.subscribe(params => {
      if(params['idsalida']){
        this.id_salida=params['idsalida'];
        this.SeleccionarSalida();
        // this.ListarProductos();
        // this.ListarTalonarios();
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
      this.Vendedores=res['data'].vendedores.vendedores;
    })

    this.ListadoTalonarios.CargarInformacion(this.id_salida);
    this.ListadoProductos.CargarInformacion(this.id_salida);

  }

  // ListarProductos(){
  //   this.Servicio.ListarSalidaProductos(this.id_salida,0).subscribe(res=>{
  //     this.Productos=res['data'].productos;
  //   })
  // }

  // ListarTalonarios(){
  //   this.Servicio.ListarSalidaTalonarios(this.id_salida).subscribe(res=>{
  //     this.Talonarios=res['data'].talonarios;
  //   })
  // }

  RegistrarVenta(talonario){
    const serieventana = this.DialogoAgregar.open(AgregarVentaComponent, {
      width: '1200px',
      data: {salida: this.id_salida, talonario: talonario, productos: this.Productos}
    });
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

  CargarInformacion(id_salida){
    this.Servicio.ListarSalidaProductos(id_salida,0).subscribe(res=>{
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

  CargarInformacion(id_salida){
    this.Servicio.ListarSalidaTalonarios(id_salida).subscribe(res=>{
      this.Informacion.next(res['data'].talonarios);
    })
  }

}