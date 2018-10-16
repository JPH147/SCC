import { Component, OnInit } from '@angular/core';
import {DetalleDocumentoAlmacenService} from './detalle-documento-almacen.service';
import {ActivatedRoute, Params} from '@angular/router';
import {FormGroup, FormBuilder} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {VentanaEditarSerieComponent} from './ventana-editar-serie/ventana-editar-serie.component'
import {ServiciosProductoSerie} from '../global/productoserie';

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
	public detalle:Array<any>;
	public cargando:boolean;

  constructor(
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

    this.Servicio.SeleccionarCabecera(+this.ruta.snapshot.paramMap.get("id"))
    .subscribe(res=>{
      console.log(res)
      this.almacen= res['data'].almacen;
      this.tipo= res['data'].tipo;
      this.referencia= res['data'].referencia;
      this.id_tipo= res['data'].id_tipo;
      // this.referente= res['data'].proveedor+res['data'].cliente+res['data'].sucursal+res['data'].vendedor+res['data'].salida_venta;
      this.documento= res['data'].documento;
      this.fecha= res['data'].fecha;
      this.detalle=res['data'].detalle;
      switch (res['data'].referencia) {
        case 1:{
          this.referente= res['data'].proveedor
          break;
        }
        case 2:{
          this.referente= res['data'].cliente
          break;
        }
        case 3:{
          this.referente= res['data'].salida_venta
          break;
        }
        case 4:{
          this.referente= res['data'].sucursal
          break;
        }
        case 5:{
          this.referente= res['data'].vendedor
          break;
        }
      }
      this.cargando=false
    })
  }

  Editar(detalle){
    let VentanaEditar = this.Dialogo.open(VentanaEditarSerieComponent,{
      width: '1200px',
      data: detalle
    })

    VentanaEditar.afterClosed().subscribe(res=>{
      if (res) {
        this.SServicio.Actualizar(res.id, res.id_producto, res.serie, res.color, res.almacenamiento).subscribe(res=>{
          this.CargarInformacion();
          this.Notificacion("Se editó el producto con éxito","")
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
