import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstitucionesService } from '../../instituciones.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-parametros-plantillas',
  templateUrl: './ventana-parametros-plantillas.component.html',
  styleUrls: ['./ventana-parametros-plantillas.component.css']
})
export class VentanaParametrosPlantillasComponent implements OnInit {
  public Cargando = new BehaviorSubject<boolean>(false);
  public InstitucionesForm : FormGroup ;
  public Instituciones : Array<any> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaParametrosPlantillasComponent>,
    private Builder : FormBuilder,
    private _instituciones : InstitucionesService
  ) { }

  ngOnInit() {
    this.ListarParametros();
    this.CrearFormulario();
    if(this.data){
      this.InstitucionesForm.get('id_sede').setValue(this.data);
    } else {

    }
  }

  CrearFormulario(){
    this.InstitucionesForm = this.Builder.group({
      id_sede : [null, [
        Validators.required
      ]],
      parametro_condicion : ["", [
        Validators.required
      ]],
      parametro_domicilio : ["", [
        Validators.required
      ]],
      parametro_autorizacion_1 : ["", [
        Validators.required
      ]],
      parametro_autorizacion_2 : ["", [
        Validators.required
      ]],
    })
  }

  ListarParametros(){
    this.Cargando.next(true);
    this._instituciones.ListarSedeParametros(this.data).subscribe(res=>{
      this.Cargando.next(false);
      this.InstitucionesForm.get('parametro_condicion').setValue(res.parametro_condicion) ;
      this.InstitucionesForm.get('parametro_domicilio').setValue(res.parametro_domicilio) ;
      this.InstitucionesForm.get('parametro_autorizacion_1').setValue(res.parametro_autorizacion_1) ;
      this.InstitucionesForm.get('parametro_autorizacion_2').setValue(res.parametro_autorizacion_2) ;
    })
  }

  Guardar(){
    this.Cargando.next(true);
    this._instituciones.ActualizarSedeParametros(
      this.InstitucionesForm.value.id_sede,
      this.InstitucionesForm.value.parametro_condicion,
      this.InstitucionesForm.value.parametro_domicilio,
      this.InstitucionesForm.value.parametro_autorizacion_1,
      this.InstitucionesForm.value.parametro_autorizacion_2,
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