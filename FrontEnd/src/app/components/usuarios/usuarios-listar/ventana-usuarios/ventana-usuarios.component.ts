import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from '../../usuarios.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-usuarios',
  templateUrl: './ventana-usuarios.component.html',
  styleUrls: ['./ventana-usuarios.component.css']
})
export class VentanaUsuariosComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public UsuariosForm : FormGroup ;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaUsuariosComponent>,
    private Builder : FormBuilder,
    private _usuarios : UsuariosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();

    if( this.data ) {
      if( this.data.pss ) {
        this.UsuariosForm.get('id_usuario').setValue(this.data.id_usuario);
        this.UsuariosForm.get('nombre').setValue(true);
        this.UsuariosForm.get('usuario').setValue(true);
        this.UsuariosForm.get('clave').setValidators([Validators.required]) ;
      } else {
        this.UsuariosForm.get('id_usuario').setValue(this.data.id_usuario);
        this.UsuariosForm.get('nombre').setValue(this.data.nombre);
        this.UsuariosForm.get('usuario').setValue(this.data.usuario);
      }
    } else {
      this.UsuariosForm.get('clave').setValidators([Validators.required]) ;
    }
  }

  CrearFormulario(){
    this.UsuariosForm = this.Builder.group({
      id_usuario : [null, [
      ]] ,
      nombre : ["", [
        Validators.required
      ]] ,
      usuario : ["", [
        Validators.required
      ]] ,
      clave : ["", [
      ]] ,
      perfil : [1, [
        Validators.required
      ]]
    })
  }

  Guardar(){
    this.Cargando.next(true);
    if ( !this.data ) {
      this._usuarios.CrearUsuario(
        this.UsuariosForm.value.nombre ,
        this.UsuariosForm.value.usuario ,
        this.UsuariosForm.value.clave ,
        this.UsuariosForm.value.perfil ,
      ).subscribe(res=>{
        this.Cargando.next(false);
        if(res['codigo']==0){
          this.ventana.close({resultado:true});
        } else {
          this.ventana.close({resultado:false});
        }
      })
    } else {
      if( this.data.pss ) {
        this._usuarios.ActualizarPss(
          this.UsuariosForm.value.id_usuario ,
          this.UsuariosForm.value.clave
        ).subscribe(res=>{
          this.Cargando.next(false);
          if(res['codigo']==0){
            this.ventana.close({resultado:true});
          } else {
            this.ventana.close({resultado:false});
          }
        })
      } else {
        this._usuarios.ActualizarUsuario(
          this.UsuariosForm.value.id_usuario ,
          this.UsuariosForm.value.nombre ,
          this.UsuariosForm.value.usuario ,
          this.UsuariosForm.value.perfil ,
        ).subscribe(res=>{
          this.Cargando.next(false);
          if(res['codigo']==0){
            this.ventana.close({resultado:true});
          } else {
            this.ventana.close({resultado:false});
          }
        })
      }
    }
  }
}
