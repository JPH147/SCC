import { Component, OnInit } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { MatSnackBar } from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {SalidaVendedoresService} from '../salida-vendedores/salida-vendedores.service';
import { BehaviorSubject } from 'rxjs';
import {ProductosDataSource, TalonariosDataSource, VentasDataSource} from '../retorno-vendedores/retorno-vendedores.component';
import {ServiciosVentas} from '../global/ventas';
import {ServiciosProductoSerie} from '../global/productoserie';

@Component({
  selector: 'app-retorno-vendedores-cierre',
  templateUrl: './retorno-vendedores-cierre.component.html',
  styleUrls: ['./retorno-vendedores-cierre.component.scss'],
  providers: [SalidaVendedoresService, ServiciosVentas,ServiciosProductoSerie]
})
export class RetornoVendedoresCierreComponent implements OnInit {

  public ListadoTalonarios: TalonariosDataSource;
  public ListadoProductos: ProductosDataSource;
  public ListadoVentas: VentasDataSource;
  public ListadoVendedores: VendedorDataSource;
  public ListadoViaticos: ViaticosDataSource;

  public ColumnasTalonarios:string[]=['numero', 'contrato'];
  public ColumnasProductos:string[]=['numero', 'producto', 'serie'];;
  public ColumnasVentas:string[]=['numero', 'contrato', 'total', 'comision'];
  public ColumnasVendedores:string[]=['numero', 'nombre', 'comision_total', 'viaticos_totales', 'total_pagar', 'comision_retenida','comision_efectiva'];
  public ColumnasViaticos:string[]=['numero', 'vendedor', 'monto_grupal', 'monto_individual'];

  public id_salida: number;
  public Cargando = new BehaviorSubject<any>(true);
  public pecosa:string;
  public guia:string;
  public fecha_salida:Date;
  public fecha_retorno:Date;
  public destino:string;
  public observacion:string;
  public observacion_llegada:string;
  public Vendedores: any = {};
  public Almacenes : Array<any>;
  public Productos: Array<any> = [];
  public Talonarios: Array<any> = [];
  public almacen_retorno:number;
  public hay_productos: boolean;
  public hay_talonarios: boolean;

  constructor(
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private router : Router,
    private Servicio: SalidaVendedoresService,
    private VServicios: ServiciosVentas,
    private PServicio: ServiciosProductoSerie
  ) { }

  ngOnInit() {
    this.observacion_llegada = "";

    this.ListadoTalonarios = new TalonariosDataSource(this.Servicio);
    this.ListadoProductos = new ProductosDataSource(this.Servicio);
    this.ListadoVentas = new VentasDataSource(this.Servicio);
    this.ListadoVendedores = new VendedorDataSource();
    this.ListadoViaticos = new ViaticosDataSource(this.Servicio);

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

      this.ListarAlmacenesxSucursal(res['data'].id_sucursal);
      this.CalcularComisiones();

      this.ListarProductos(this.id_salida);
      this.ListarTalonarios(this.id_salida);

    })

    this.ListadoTalonarios.CargarInformacion(this.id_salida,1);
    this.ListadoProductos.CargarInformacion(this.id_salida,1);
    this.ListadoVentas.CargarInformacion(this.id_salida);
    this.ListadoVendedores.CargarInformacion([]);
    this.ListadoViaticos.CargarInformacion(this.id_salida);

    this.ListadoVentas.Comision.subscribe(res=>{
      this.CalcularComisiones()
    })

  }

  ListarAlmacenesxSucursal(id_sucursal:number){
    this.PServicio.ListarAlmacenSucursal(id_sucursal).subscribe(res=>{
      this.Almacenes=res;
    })
  }

  ListarProductos(id_salida:number){
    this.Servicio.ListarSalidaProductos(id_salida,0).subscribe(res=>{
      this.Productos=res['data'].productos;
      if ( this.Productos.some(e=>e.id_estado==1) ){
        this.hay_productos = true;
      } else {
        this.hay_productos = false;
      }
    })
  }
  
  ListarTalonarios(id_salida:number){
    this.Servicio.ListarSalidaTalonarios(id_salida, 1).subscribe(res=>{
      this.Talonarios=res['data'].talonarios
      if(res['data'].talonarios.length>0){
        this.hay_talonarios=true;
      } else{
        this.hay_talonarios=false;
      }
    })
  }

  CalcularComisiones(){
    let total_vendedores=+this.Vendedores.length;
    let total_comisiones=+this.ListadoVentas.Comision.value;
    
    let monto_base=total_comisiones/total_vendedores;
    let i=0;

    this.Vendedores.forEach((item)=>{
      item.comision_total=monto_base*(item.comision_efectiva/100);
      item.viaticos_totales=item.viatico_personal+(item.viatico_grupal/total_vendedores);
      item.total_pagar=item.comision_total-item.viaticos_totales;

      item.total_pagar>0 ? item.comision_total_retenida=item.total_pagar*(item.comision_retenida/100) : item.comision_total_retenida=0;
      item.total_pagar>0 ? item.comision_total_efectiva=item.total_pagar-item.comision_total_retenida : item.comision_total_efectiva=0;
      i++;
      
      if(i==this.Vendedores.length){
        this.ListadoVendedores.CargarInformacion(this.Vendedores);
      }
    })
  }

  Atras(){
    this.location.back()
  }

  CerrarSalida(){

    this.Servicio.CrearLlegada(
      this.id_salida,
      this.fecha_retorno,
      this.observacion_llegada
    ).subscribe(res=>{
      
      // Se crean las comisiones para el vendedor
      this.Vendedores.forEach((item)=>{
        console.log(item)
        if(item.total_pagar>0){
          this.VServicios.CrearComisionVendedor(
            this.id_salida,
            item.id_vendedor,
            item.comision_efectiva,
            item.comision_total_efectiva,
            item.comision_retenida,
            item.comision_total_retenida
          ).subscribe()
        }
      })

      // Los productos regresan al almacén
      this.Productos.forEach((item)=>{
      // Los productos que no se vendieron, regresan
        if(item.id_estado==1){
          this.Servicio.CrearLlegadaProducto(
            item.id_serie,
            this.id_salida,
            this.almacen_retorno,
            item.precio_minimo,
            this.fecha_retorno,
            this.pecosa
          ).subscribe()
        }
      })

      // Los talonarios estarán disponibles nuevamente
      this.Talonarios.forEach((item)=>{
        this.Servicio.CrearLlegadaTalonarios(
          item.id_talonario,
          item.id_estado==3 ? 0 : item.id_estado
        ).subscribe()
      })

      if(res['codigo']==0){
        this.snackBar.open("La salida se creó satisfactoriamente", '', {
          duration: 2000,
        });
      }else{
        this.snackBar.open("Ocurrió un error al crear la salida", '', {
          duration: 2000,
        });
      }

      setTimeout(()=>{
        this.router.navigate(['/salidavendedores']);
      },1000)

    })
  }

}

export class VendedorDataSource implements DataSource<any>{

  private Informacion = new BehaviorSubject<any>([])

  constructor(
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(array){
    // console.log(array)
    this.Informacion.next(array);
  }
}

export class ViaticosDataSource implements DataSource<any>{

  private Informacion = new BehaviorSubject<any>([])
  public hay_viaticos : boolean;

  constructor(
    private Servicio: SalidaVendedoresService
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(
    id_salida: number
  ){
    this.Servicio.ListarSalidaViaticos(id_salida).subscribe(res=>{
      if (res['data'].viaticos.length==0) {
        this.hay_viaticos=false;
      } else{
        this.hay_viaticos=true;
      }
      // console.log(this.hay_viaticos)
      this.Informacion.next(res['data'].viaticos)
    })
  }

  // Esto se utiliza cuando se agrega los valores en la vista
  AgregarInformacion(array){
    this.Informacion.next(array)
  }
}