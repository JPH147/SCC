import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosTelefonos } from 'src/app/core/servicios/telefonos';

@Component({
  selector: 'app-ventana-editar-telefono',
  templateUrl: './ventana-editar-telefono.component.html',
  styleUrls: ['./ventana-editar-telefono.component.css']
})
export class VentanaEditarTelefonoComponent implements OnInit {

  public TelefonoForm : FormGroup ;
  public Tipos : Array<any> ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaEditarTelefonoComponent> ,
    private _builder : FormBuilder ,
    private _telefonos : ServiciosTelefonos
  ) { }

  ngOnInit() {
    this.CrearFromulario() ;

    if( this.data ) {
      this.Tipos = this.data.tipos ;
      this.TelefonoForm.get('id_telefono').setValue(this.data.telefono.id) ;
      this.TelefonoForm.get('tipo').setValue(this.data.telefono.id_tipo) ;
      this.TelefonoForm.get('numero').setValue(this.data.telefono.tlf_numero) ;
    }
  }

  CrearFromulario(){
    this.TelefonoForm = this._builder.group({
      id_telefono : [{ value: null, disabled : false }, [
        Validators.required
      ]] ,
      tipo : [{ value: null, disabled : false }, [
        Validators.required,
      ]] ,
      numero : [{ value: null, disabled : false }, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(9),
        Validators.pattern('[0-9- ]+')
      ]] ,
    })
  }
  
  Guardar(){
    this._telefonos.ActualizarTelefono(
      this.TelefonoForm.get('id_telefono').value ,
      this.TelefonoForm.get('numero').value ,
      this.TelefonoForm.get('tipo').value ,
    ).subscribe(res=>{
      this.ventana.close(res)
    }) ;
  }
}
