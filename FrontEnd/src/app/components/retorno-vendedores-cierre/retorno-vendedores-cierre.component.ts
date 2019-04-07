import { Component, OnInit } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {MatDialog } from '@angular/material';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {SalidaVendedoresService} from '../salida-vendedores/salida-vendedores.service';
import { BehaviorSubject } from 'rxjs';
import {ProductosDataSource, TalonariosDataSource, VentasDataSource} from '../retorno-vendedores/retorno-vendedores.component';

@Component({
  selector: 'app-retorno-vendedores-cierre',
  templateUrl: './retorno-vendedores-cierre.component.html',
  styleUrls: ['./retorno-vendedores-cierre.component.scss'],
  providers: [SalidaVendedoresService]
})
export class RetornoVendedoresCierreComponent implements OnInit {

  public ListadoTalonarios: TalonariosDataSource;
  public ListadoProductos: ProductosDataSource;
  public ListadoVentas: VentasDataSource;
  public ListadoVendedores: VendedorDataSource;

  public ColumnasTalonarios:string[]=['numero', 'contrato']
  public ColumnasProductos:string[]=['numero', 'producto', 'serie']
  public ColumnasVentas:string[]=['numero', 'contrato', 'total', 'comision']
  public ColumnasVendedores:string[]=['numero', 'nombre', 'comision_total', 'comision_efectiva', 'comision_retenida']

  public id_salida: number;
  public Cargando = new BehaviorSubject<any>(true);
  public pecosa:string;
  public guia:string;
  public fecha_salida:Date;
  public fecha_retorno:Date;
  public destino:string;
  public observacion:string;
  public Vendedores: any = {};

  constructor(
    private location: Location,
    private Dialogo: MatDialog,
    private route: ActivatedRoute,
    private Servicio: SalidaVendedoresService
  ) { }

  ngOnInit() {
    this.ListadoTalonarios = new TalonariosDataSource(this.Servicio);
    this.ListadoProductos = new ProductosDataSource(this.Servicio);
    this.ListadoVentas = new VentasDataSource(this.Servicio);
    this.ListadoVendedores = new VendedorDataSource(this.Servicio);

    this.route.params.subscribe(params => {
      if(params['idsalida']){
        this.id_salida=params['idsalida'];
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
      this.Vendedores=res['data'].vendedores.vendedores;

      this.CalcularComisiones()

    })

    this.ListadoTalonarios.CargarInformacion(this.id_salida,1)
    this.ListadoProductos.CargarInformacion(this.id_salida,1)
    this.ListadoVentas.CargarInformacion(this.id_salida)
    this.ListadoVendedores.CargarInformacion([]);
  }

  CalcularComisiones(){
    let total_vendedores=+this.Vendedores.length;
    let total_comisiones=+this.ListadoVentas.Comision.value;
    
    // console.log(total_vendedores,total_comisiones);
    let monto_base=total_comisiones/total_vendedores;
    let i=0;

    this.Vendedores.forEach((item)=>{
      item.comision_total=monto_base*(item.comision_efectiva/100);
      item.comision_total_retenida=item.comision_total*(item.comision_retenida/100);
      item.comision_total_efectiva=item.comision_total-item.comision_total_retenida
      i++;
      if(i==this.Vendedores.length){
        this.ListadoVendedores.CargarInformacion(this.Vendedores);
      }
    })
  }

  Atras(){
    this.location.back()
  }

}

export class VendedorDataSource implements DataSource<any>{

  private Informacion = new BehaviorSubject<any>([])

  constructor(
    private Servicio: SalidaVendedoresService
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(array){
    console.log(array)
    this.Informacion.next(array);
  }

}