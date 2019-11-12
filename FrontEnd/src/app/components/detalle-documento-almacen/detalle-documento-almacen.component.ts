import { Component, OnInit, Inject, Optional } from '@angular/core';
import {DetalleDocumentoAlmacenService} from './detalle-documento-almacen.service';
import {ActivatedRoute, Params} from '@angular/router';
import {FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog, MatSnackBar, MAT_DIALOG_DATA} from '@angular/material';
import {VentanaEditarSerieComponent} from './ventana-editar-serie/ventana-editar-serie.component'
import {ServiciosProductoSerie} from '../global/productoserie';
import * as moment from 'moment';

@Component({
  selector: 'app-detalle-documento-almacen',
  templateUrl: './detalle-documento-almacen.component.html',
  styleUrls: ['./detalle-documento-almacen.component.css'],
  providers: [DetalleDocumentoAlmacenService, ServiciosProductoSerie]
})
export class DetalleDocumentoAlmacenComponent implements OnInit {

	public almacen:string;
	public tipo:string;
  public referencia:number;
  public id_tipo:number;
	public referente:string;
	public documento:string;
	public fecha:string;
	public observacion:string;
	public detalle:Array<any>;
	public cargando:boolean;

  constructor(
    @Optional() @Inject (MAT_DIALOG_DATA) public data,
  	private Servicio:DetalleDocumentoAlmacenService,
    private SServicio: ServiciosProductoSerie,
  	private ruta: ActivatedRoute,
  	private Constructor:FormBuilder,
    private Dialogo:MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.CargarInformacion();
  }

  CargarInformacion(){
    
    this.cargando=true;
    if (this.data) {
      this.Servicio.SeleccionarCabecera(this.data.id).subscribe(res=>{
        this.AsignarValores(res)
      })
    }else{
      this.Servicio.SeleccionarCabecera(+this.ruta.snapshot.paramMap.get("id"))
      .subscribe(res=>{
        this.AsignarValores(res)
      })
    }
  }

  AsignarValores(objeto){
    console.log(objeto);
    this.almacen= objeto['data'].almacen;
    this.tipo= objeto['data'].tipo;
    this.referencia= objeto['data'].referencia;
    this.id_tipo= objeto['data'].id_tipo;
    this.documento= objeto['data'].documento;
    this.fecha= objeto['data'].fecha;
    this.detalle=objeto['data'].detalle;
    this.observacion=objeto['data'].observaciones;
    switch (objeto['data'].referencia) {
      case 1:{
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
    this.cargando=false
  }

  Editar(detalle){
    let VentanaEditar = this.Dialogo.open(VentanaEditarSerieComponent,{
      width: '1200px',
      data: detalle
    })

    VentanaEditar.afterClosed().subscribe(res=>{
      if (res) {
        this.SServicio.ValidarSerie(res.serie).subscribe(rest=>{
          if (rest==0) {
            this.SServicio.Actualizar(res.id, res.id_producto, res.serie, res.color, res.almacenamiento, res.precio).subscribe(res=>{
              console.log(res)
              this.CargarInformacion();
              this.Notificacion("Se editó el producto con éxito","")
            })
          }else{
            this.Notificacion("El producto tiene la serie duplicada","")
          }
        })

      }
      
    })

  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


}
