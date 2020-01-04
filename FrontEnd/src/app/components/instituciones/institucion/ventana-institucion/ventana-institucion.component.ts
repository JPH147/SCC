import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InstitucionesService } from '../../instituciones.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-institucion',
  templateUrl: './ventana-institucion.component.html',
  styleUrls: ['./ventana-institucion.component.css']
})
export class VentanaInstitucionComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public InstitucionesForm : FormGroup ;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaInstitucionComponent>,
    private Builder : FormBuilder,
    private _instituciones : InstitucionesService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    if(this.data){
      this.InstitucionesForm.get('id_institucion').setValue(this.data.id);
      this.InstitucionesForm.get('institucion').setValue(this.data.nombre);
    } else {

    }
  }

  CrearFormulario(){
    this.InstitucionesForm = this.Builder.group({
      id_institucion : [null, [
        Validators.required
      ]],
      institucion : ["", [
        Validators.required
      ]]
    })
  }

  Guardar(){
    this.Cargando.next(true);
    if (!this.data) {
      this._instituciones.CrearInstitucion(
        this.InstitucionesForm.value.institucion
      ).subscribe(res=>{
        this.Cargando.next(false);
        if(res['codigo']==0){
          this.ventana.close({resultado:true});
        } else {
          this.ventana.close({resultado:false});
        }
      })
    } else {
      this._instituciones.ActualizarInstitucion(
        this.InstitucionesForm.value.id_institucion,
        this.InstitucionesForm.value.institucion
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