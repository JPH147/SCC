import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { URLIMAGENES } from 'src/app/core/servicios/url';
import { CobranzaJudicialService } from '../cobranza-judicial.service';

@Component({
  selector: 'app-ventana-devolver-anexos',
  templateUrl: './ventana-devolver-anexos.component.html',
  styleUrls: ['./ventana-devolver-anexos.component.css']
})
export class VentanaDevolverAnexosComponent implements OnInit {
  
  public Cargando = new BehaviorSubject<boolean>(false) ;
  public DevolucionAnexosForm : FormGroup ;

  public archivo : File ;
  public archivo_nombre : string = "";
  public archivo_nombre_antiguo : string = "";
  public archivo_nombre_antiguo_enlace : string = "";
  public editar_archivo : boolean ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    private ventana : MatDialogRef<VentanaDevolverAnexosComponent> ,
    private _builder : FormBuilder ,
    private _generales : ServiciosGenerales ,
    private _judiciales : CobranzaJudicialService ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;

    if ( this.data.tipo == 'ver' || this.data.tipo == 'editar' ) {
      this.AsignarInformacion() ;
    }
  }

  private CrearFormulario() {
    this.DevolucionAnexosForm = this._builder.group({
      fecha : [ new Date() , [
        Validators.required ,
      ]] ,
      observacion : ["", [
        Validators.required ,
      ]] ,
    })
  }

  private AsignarInformacion() {
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

  private GuardarInformacion(archivo) {
    this._judiciales.DevolverAnexosProceso(
      this.data.id_proceso ,
      this.DevolucionAnexosForm.get('fecha').value ,
      this.DevolucionAnexosForm.get('observacion').value ,
      archivo
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
