import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from '../../usuarios.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-ventana-usuarios',
  templateUrl: './ventana-usuarios.component.html',
  styleUrls: ['./ventana-usuarios.component.css']
})
export class VentanaUsuariosComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public UsuariosForm : FormGroup ;
  public Perfiles : Array<any> = [] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaUsuariosComponent>,
    private Builder : FormBuilder,
    private _usuarios : UsuariosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarPerfiles();

    console.log(this.data) ;
    if( this.data ) {
      if( this.data.cambiar_pss ) {
        this.UsuariosForm.get('id_usuario').setValue(this.data.id_usuario);
        this.UsuariosForm.get('nombre').setValue(true);
        this.UsuariosForm.get('usuario').setValue(true);
        this.UsuariosForm.get('clave').setValidators([Validators.required]) ;
      } else {
        this.UsuariosForm.get('id_usuario').setValue(this.data.id_usuario);
        this.UsuariosForm.get('nombre').setValue(this.data.nombre);
        this.UsuariosForm.get('usuario').setValue(this.data.usuario);
        this.UsuariosForm.get('perfil').setValue(this.data.id_perfil);
      }
    } else {
      this.UsuariosForm.get('clave').setValidators([Validators.required]) ;
    }
  }

  ngAfterViewInit(){
    this.UsuariosForm.get('usuario').valueChanges
    .pipe(
      debounceTime(200) ,
      distinctUntilChanged(),
      tap(()=>{
        this.VerificarDuplicado() ;
      })
    ).subscribe()
  }

  CrearFormulario(){
    this.UsuariosForm = this.Builder.group({
      id_usuario : [0, [
      ]] ,
      nombre : ["", [
        Validators.required
      ]] ,
      usuario : ["", [
        Validators.required
      ]] ,
      clave : ["", [
      ]] ,
      perfil : [0, [
        Validators.required
      ]],
      usuario_unico : [true, [
        Validators.requiredTrue
      ]],
    })
  }

  VerificarDuplicado(){
    this._usuarios.VerificarUsuario(
      this.UsuariosForm.get('usuario').value ,
      this.UsuariosForm.get('id_usuario').value ,
    )
    .subscribe(res=>{
      if( res > 0 ) {
        this.UsuariosForm.get('usuario_unico').setValue(false) ;
      } else {
        this.UsuariosForm.get('usuario_unico').setValue(true) ;
      }
    })
  }

  ListarPerfiles(){
    this._usuarios.ListarPerfil("", 1, 100).subscribe(perfil=>{
      if( perfil ) {
        this.Perfiles = perfil['data'].perfiles ;
      }
    })
  }

  Guardar(){
    this.Cargando.next(true);

    this._usuarios.VerificarUsuario(
      this.UsuariosForm.get('usuario').value ,
      this.UsuariosForm.get('id_usuario').value ,
    )
    .subscribe(res=>{
      if( res > 0 ) {
        this.UsuariosForm.get('usuario_unico').setValue(false) ;
        this.Cargando.next(false);
      } else {
        if ( !this.data ) {
          this.CrearUsuario() ;
        } else {
          if( this.data.cambiar_pss ) {
            this.ActualizarPss() ;
          } else {
            this.ActualizarUsuario() ;
          }
        }
      }
    })
  }

  CrearUsuario(){
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
  }

  ActualizarPss(){
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
  }

  ActualizarUsuario(){
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
