import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup , FormBuilder } from '@angular/forms';
import * as moment from 'moment' ;
import { URLIMAGENES } from 'src/app/core/servicios/url'
import { SeguimientosService } from '../seguimientos.service';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';

@Component({
  selector: 'app-ventana-seguimientos',
  templateUrl: './ventana-seguimientos.component.html',
  styleUrls: ['./ventana-seguimientos.component.css'],
  providers : [ ServiciosGenerales ]
})
export class VentanaSeguimientosComponent implements OnInit {

  public VentanaSeguimientoForm : FormGroup ;
  public Couriers : Array<any>;
  public editar_foto : boolean = false ;
  public hay_foto : boolean = false ;
  public ruta : string ;
  public foto_nuevo : string ;
  public foto_antiguo : string ;
  public foto : string ;
  public entregado : boolean ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    public ventana: MatDialogRef<VentanaSeguimientosComponent> ,
    private Builder : FormBuilder ,
    private GServicios: ServiciosGenerales,
    private Servicio: SeguimientosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ConsultarInformacion();
    this.ListarCouriers();
    this.ruta=URLIMAGENES.urlimages;
  }

  CrearFormulario(){
    this.VentanaSeguimientoForm = this.Builder.group({
      courier : [ { value : null , disabled : false }, [
      ] ],
      fecha : [ { value : null , disabled : false }, [
      ] ],
      numero_seguimiento : [ { value : null , disabled : false }, [
      ] ],
      observacion : [ { value : null , disabled : false }, [
      ] ],
      fecha_recepcion : [ { value : null , disabled : false }, [
      ] ],
      usuario_recepcion : [ { value : null , disabled : false }, [
      ] ],
    })
  }

  ConsultarInformacion(){
    this.Servicio.Seleccionar(this.data.id).subscribe(res=>{
      this.AsignarInformacion(res);
    })
  }

  AsignarInformacion( informacion ){
    this.VentanaSeguimientoForm.get('fecha').setValue( moment(informacion.fecha).toDate() ) ;
    this.VentanaSeguimientoForm.get('numero_seguimiento').setValue( informacion.numero_seguimiento ) ;
    this.VentanaSeguimientoForm.get('observacion').setValue( informacion.observacion ) ;
   
    if ( this.data.editar ) {
      this.VentanaSeguimientoForm.get('courier').setValue( informacion.id_courier ) ;
      if(informacion.foto==""){
        this.editar_foto = true;
      } else {
        this.editar_foto = false ;
        this.foto = URLIMAGENES.carpeta+informacion.tipo+'/'+ informacion.foto;
        this.foto_antiguo = informacion.foto ;
      }
    }

    if( this.data.ver ) {
      this.VentanaSeguimientoForm.get('courier').setValue( informacion.courier ) ;
      if( informacion.id_estado==2 ) {
        this.entregado = true ;
        this.VentanaSeguimientoForm.get('fecha_recepcion').setValue( moment(informacion.fecha_recepcion).toDate() ) ;
        this.VentanaSeguimientoForm.get('usuario_recepcion').setValue( informacion.usuario_recepcion ) ;
      }
      if(informacion.foto==""){
      } else {
        this.foto = URLIMAGENES.carpeta+informacion.tipo+'/'+ informacion.foto;
      }
    }

  }

  ListarCouriers(){
    this.GServicios.ListarCourier("",1,50).subscribe(res=>{
      this.Couriers = res['data'].courier
    })
  }

  SubirArchivo(evento){
    this.foto_nuevo = evento.serverResponse.response.body.data;
  }

  AbrirDocumento(url){
    if(url){
      window.open(url, "_blank");
    }
  }

  Guardar(){

    let random : number = (new Date()).getTime();

    this.GServicios.RenameFile(this.foto_nuevo,'FOTO',random.toString(),"credito").subscribe(res=>{
      this.Servicio.Actualizar(
        this.data.id,
        this.VentanaSeguimientoForm.value.courier,
        this.VentanaSeguimientoForm.value.fecha,
        this.VentanaSeguimientoForm.value.numero_seguimiento,
        res['mensaje'],
        this.VentanaSeguimientoForm.value.observacion,
      ).subscribe(res=>{
        if(res['codigo']==0){
          this.ventana.close(true);
        } else {
          this.ventana.close(false);
        }
      })
    })

  }

}
