import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { URLIMAGENES } from 'src/app/core/servicios/url';
import { CobranzaJudicialService } from '../cobranza-judicial.service';

@Component({
  selector: 'app-ventana-notificaciones',
  templateUrl: './ventana-notificaciones.component.html',
  styleUrls: ['./ventana-notificaciones.component.css']
})
export class VentanaNotificacionesComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public NotificacionForm : FormGroup ;

  public archivo : File ;
  public archivo_nombre : string = "";
  public archivo_nombre_antiguo : string = "";
  public archivo_nombre_antiguo_enlace : string = "";
  public editar_archivo : boolean = false ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaNotificacionesComponent> ,
    private _builder : FormBuilder ,
    private _judiciales : CobranzaJudicialService ,
    private _generales : ServiciosGenerales ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;

    if ( this.data.tipo === 'editar' ) {
      this.AsignarInformacion() ;
    }
  }

  private CrearFormulario() {
    this.NotificacionForm = this._builder.group({
      codigo : ["", [
        Validators.required ,
      ]] ,
      destinatario : ["", [
        Validators.required ,
      ]] ,
      anexos : ["", [
      ]] ,
      juzgado_fecha_resolucion : ["", [
      ]] ,
      juzgado_fecha_notificacion : ["", [
      ]] ,
      juzgado_fecha_envio : ["", [
      ]] ,
      juzgado_fecha_recepcion : ["", [
      ]] ,
      central_fecha_notificacion : ["", [
      ]] ,
      central_fecha_cargo : ["", [
      ]] ,
      comentarios : ["", [
      ]] ,
      observacion : ["", [
      ]] ,
    })
  }

  private AsignarInformacion() {
    this.NotificacionForm.get('codigo').setValue(this.data.notificacion.codigo) ;
    this.NotificacionForm.get('destinatario').setValue(this.data.notificacion.destinatario) ;
    this.NotificacionForm.get('anexos').setValue(this.data.notificacion.anexos) ;
    this.NotificacionForm.get('juzgado_fecha_resolucion').setValue(this.data.notificacion.juzgado_fecha_resolucion) ;
    this.NotificacionForm.get('juzgado_fecha_notificacion').setValue(this.data.notificacion.juzgado_fecha_notificacion) ;
    this.NotificacionForm.get('juzgado_fecha_envio').setValue(this.data.notificacion.juzgado_fecha_envio) ;
    this.NotificacionForm.get('juzgado_fecha_recepcion').setValue(this.data.notificacion.juzgado_fecha_recepcion) ;
    this.NotificacionForm.get('central_fecha_notificacion').setValue(this.data.notificacion.central_fecha_notificacion) ;
    this.NotificacionForm.get('central_fecha_cargo').setValue(this.data.notificacion.central_fecha_cargo) ;
    this.NotificacionForm.get('comentarios').setValue(this.data.notificacion.comentarios) ;
    this.NotificacionForm.get('observacion').setValue(this.data.notificacion.observacion) ;

    this.archivo_nombre_antiguo_enlace = URLIMAGENES.carpeta + 'proceso judicial/' + this.data.notificacion.archivo ;
    this.archivo_nombre_antiguo = this.data.notificacion.archivo ;
    this.data.notificacion.archivo ? this.editar_archivo = false : this.editar_archivo = true ;
  }

  SubirArchivo(archivo: FileList) {
    this.archivo = archivo.item(0);
    this.archivo_nombre = this.archivo.name ;
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = "" ;
  }

  AbrirDocumento(archivo){
    if(archivo){
      window.open(archivo, "_blank");
    }
  }

  Guardar() {
    let random=(new Date()).getTime() ;

    this.Cargando.next(true) ;
    this._generales.SubirArchivo(this.archivo).subscribe(path_archivo => {
      if ( path_archivo ) {
        this._generales.RenameFile(path_archivo['data'], "notificacion", "_" + random, "proceso judicial")
        .subscribe(archivo_nombre=>{
          this.GuardarInformacion(archivo_nombre.mensaje) ;
        })
      } else {
        this.GuardarInformacion('') ;
      }
    })
  }

  GuardarInformacion(nombre_archivo) {
    if ( this.data.tipo === 'crear' ) {
      this._judiciales.CrearNotificaciones(
        this.data.documento_proceso ,
        this.NotificacionForm.get('codigo').value ,
        this.NotificacionForm.get('destinatario').value ,
        this.NotificacionForm.get('anexos').value ,
        this.NotificacionForm.get('juzgado_fecha_resolucion').value ,
        this.NotificacionForm.get('juzgado_fecha_notificacion').value ,
        this.NotificacionForm.get('juzgado_fecha_envio').value ,
        this.NotificacionForm.get('juzgado_fecha_recepcion').value ,
        this.NotificacionForm.get('central_fecha_notificacion').value ,
        this.NotificacionForm.get('central_fecha_cargo').value ,
        this.NotificacionForm.get('comentarios').value ,
        this.NotificacionForm.get('observacion').value ,
        nombre_archivo ,
      )
      .pipe(
        finalize(() => {
          this.Cargando.next(false)
        })
      )
      .subscribe(resultado => {
        this.ventana.close(resultado) ;
      })
    }
    if ( this.data.tipo === 'editar' ) {
      this.Cargando.next(true) ;
      this._judiciales.ActualizarNotificaciones(
        this.data.notificacion.id_proceso_judicial_notificacion ,
        this.NotificacionForm.get('codigo').value ,
        this.NotificacionForm.get('destinatario').value ,
        this.NotificacionForm.get('anexos').value ,
        this.NotificacionForm.get('juzgado_fecha_resolucion').value ,
        this.NotificacionForm.get('juzgado_fecha_notificacion').value ,
        this.NotificacionForm.get('juzgado_fecha_envio').value ,
        this.NotificacionForm.get('juzgado_fecha_recepcion').value ,
        this.NotificacionForm.get('central_fecha_notificacion').value ,
        this.NotificacionForm.get('central_fecha_cargo').value ,
        this.NotificacionForm.get('comentarios').value ,
        this.NotificacionForm.get('observacion').value ,
        nombre_archivo ? nombre_archivo : this.archivo_nombre_antiguo ,
      )
      .pipe(
        finalize(() => {
          this.Cargando.next(false)
        })
      )
      .subscribe(resultado => {
        this.ventana.close(resultado) ;
      })
    }
  }

}
