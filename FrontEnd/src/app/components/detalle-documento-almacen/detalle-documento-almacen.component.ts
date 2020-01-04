import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { DetalleDocumentoAlmacenService } from './detalle-documento-almacen.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { VentanaEditarSerieComponent } from './ventana-editar-serie/ventana-editar-serie.component'
import { ServiciosProductoSerie } from '../global/productoserie';
import * as moment from 'moment';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { IngresoProductoService } from '../ingreso-productos/ingreso-productos.service';
import { VentanaEditarDocumentoComponent } from './ventana-editar-documento/ventana-editar-documento.component';

@Component({
  selector: 'app-detalle-documento-almacen',
  templateUrl: './detalle-documento-almacen.component.html',
  styleUrls: ['./detalle-documento-almacen.component.scss'],
  providers: [DetalleDocumentoAlmacenService, ServiciosProductoSerie, IngresoProductoService, ServiciosProductoSerie]
})
export class DetalleDocumentoAlmacenComponent implements OnInit {

	public Cargando = new BehaviorSubject<boolean>(false);
  public id_ver : number ;
  public id_editar : number ;
	public almacen : string;
	public tipo : string;
  public referencia : number;
  public id_tipo : number;
	public id_referente : string;
	public referente : string;
	public documento : string;
	public fecha : Date;
	public observacion : string;
  public detalle : Array<any>;
  public Columnas : Array<string>;
  public ListadoInformacion : DetalleMovimientoDataSource ;

  constructor(
    @Optional() @Inject (MAT_DIALOG_DATA) public data,
  	private Servicio:DetalleDocumentoAlmacenService,
    private SServicio: ServiciosProductoSerie,
  	private route: ActivatedRoute,
  	private Constructor:FormBuilder,
    private Dialogo:MatDialog,
    public snackBar: MatSnackBar,
    private SSeries: ServiciosProductoSerie,
    private IngresoProductoservicios: IngresoProductoService
  ) { }

  ngOnInit() {
    this.ListadoInformacion = new DetalleMovimientoDataSource();
    this.route.params.subscribe(params => {
      if(Object.keys(params).length>0){
        if(params['id']){
          this.id_ver = params['id'];
          // this.id_ver = 304;
          this.Columnas = [ "numero" , "producto" , "serie" , "color" , "almacenamiento" , "precio" ]
          this.CargarInformacion(this.id_ver);
        }
        if(params['ideditar']){
          this.id_editar = params['ideditar'];
          // this.id_editar = 304 ;
          this.Columnas = [ "numero" , "producto" , "serie" , "color" , "almacenamiento" , "precio"  , "opciones" ]
          this.CargarInformacion(this.id_editar);
        }
      }
    })
  }

  CargarInformacion(id){
    this.Cargando.next(true);
    this.Servicio.SeleccionarCabecera(id).subscribe(res=>{
      this.Cargando.next(false);
      this.AsignarValores(res)
    })
  }

  AsignarValores(objeto){
    this.almacen= objeto['data'].almacen;
    this.tipo= objeto['data'].tipo;
    this.referencia= objeto['data'].referencia;
    this.id_tipo= objeto['data'].id_tipo;
    this.documento= objeto['data'].documento;
    this.fecha= moment(objeto['data'].fecha).toDate();
    this.observacion=objeto['data'].observaciones;
    switch (objeto['data'].referencia) {
      case 1:{
        this.id_referente= objeto['data'].id_proveedor
        this.referente= objeto['data'].proveedor
        break;
      }
      case 2:{
        this.referente= objeto['data'].cliente
        break;
      }
      case 3:{
        this.referente= objeto['data'].salida_venta
        break;
      }
      case 4:{
        this.referente= objeto['data'].sucursal
        break;
      }
      case 5:{
        this.referente= objeto['data'].vendedor
        break;
      }
    }
    this.ListadoInformacion.AsignarInformacion(objeto['data'].detalle) ;
  }

  AgregarSerie(){
    let VentanaEditar = this.Dialogo.open(VentanaEditarSerieComponent,{
      width: '1200px',
    })

    VentanaEditar.afterClosed().subscribe(res=>{
      if (res) {
        this.SSeries.CrearProductoSerie(res.id_producto,res.serie, res.color, res.almacenamiento, res.precio).subscribe(response => {
          this.IngresoProductoservicios.CrearTransaccionDetalle(this.id_editar, response['data'], 1, res.precio, "").subscribe(resp=>{
            this.Notificacion("Se creó la serie satisfactoriamente","");
            this.CargarInformacion(this.id_editar);
          });
        });
      }
    })
  }

  Editar(detalle){
    let VentanaEditar = this.Dialogo.open(VentanaEditarSerieComponent,{
      width: '1200px',
      data: detalle
    })

    VentanaEditar.afterClosed().subscribe(res=>{
      if (res) {
        this.SServicio.ValidarSerie(res.serie,res.id).subscribe(rest=>{
          if (rest==0) {
            this.SServicio.Actualizar(res.id, res.id_producto, res.serie, res.color, res.almacenamiento, res.precio).subscribe(res=>{
              this.CargarInformacion(this.id_ver || this.id_editar);
              this.Notificacion("Se editó el producto con éxito","")
            })
          }else{
            this.Notificacion("El producto tiene la serie duplicada","")
          }
        })

      }
    })
  }

  EditarDocumento(){
    let datos = {
      id_referente : this.id_referente ,
      referente : this.referente ,
      documento : this.documento ,
      fecha : this.fecha ,
    }

    let VentanaEditar = this.Dialogo.open(VentanaEditarDocumentoComponent,{
      width: '1200px',
      data: datos
    })

    VentanaEditar.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.ActualizarCabecera(
          this.id_editar,
          res.id_proveedor,
          res.fecha,
          res.documento
        ).subscribe(res=>{
          this.CargarInformacion(this.id_editar);
        })
      }
    })
  }

  Eliminar(detalle){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el equipo", valor: detalle.serie }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarDetalle(detalle.id, detalle.id_serie).subscribe(res=>{
          this.CargarInformacion(this.id_ver || this.id_editar);
        });
      }
    })
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

export class DetalleMovimientoDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
  }

  AsignarInformacion( informacion ){
    this.Informacion.next(informacion) ;
  }

}
