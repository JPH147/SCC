import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InstitucionesService } from '../../instituciones.service';
import { BehaviorSubject } from 'rxjs';
import { ServiciosGenerales } from 'src/app/components/global/servicios';

@Component({
  selector: 'app-ventana-sede',
  templateUrl: './ventana-sede.component.html',
  styleUrls: ['./ventana-sede.component.css']
})
export class VentanaSedeComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public InstitucionesForm : FormGroup ;
  public Instituciones : Array<any> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaSedeComponent>,
    private Builder : FormBuilder,
    private _generales : ServiciosGenerales,
    private _instituciones : InstitucionesService
  ) { }

  ngOnInit() {
    this.ListarInstituciones();
    this.CrearFormulario();
    if(this.data){
      this.InstitucionesForm.get('id_sede').setValue(this.data.id);
      this.InstitucionesForm.get('institucion').setValue(this.data.id_institucion);
      this.InstitucionesForm.get('sede').setValue(this.data.nombre);
    } else {

    }
  }

  CrearFormulario(){
    this.InstitucionesForm = this.Builder.group({
      id_sede : [null, [
        Validators.required
      ]],
      institucion : ["", [
        Validators.required
      ]],
      sede : ["", [
        Validators.required
      ]]
    })
  }

  ListarInstituciones(){
    this._generales.ListarInstitucion().subscribe( res => {
      this.Instituciones=res;
    });
  }

  Guardar(){
    this.Cargando.next(true);
    if (!this.data) {
      this._instituciones.CrearSede(
        this.InstitucionesForm.value.institucion,
        this.InstitucionesForm.value.sede
      ).subscribe(res=>{
        this.Cargando.next(false);
        if(res['codigo']==0){
          this.ventana.close({resultado:true});
        } else {
          this.ventana.close({resultado:false});
        }
      })
    } else {
      this._instituciones.ActualizarSede(
        this.InstitucionesForm.value.id_sede,
        this.InstitucionesForm.value.institucion,
        this.InstitucionesForm.value.sede
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