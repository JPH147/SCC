import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import {ServiciosDirecciones, Departamento} from '../../../global/direcciones'

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers:[ServiciosDirecciones]
})

export class VentanaEmergenteDepartamento {
  
  public selectedValue: string;
  public DepartamentosForm: FormGroup;
  public Departamento: Array<Departamento>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteDepartamento>,
    private FormBuilder: FormBuilder,
    private Servicios:ServiciosDirecciones,
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit(){
    this.DepartamentosForm = this.FormBuilder.group({
      'nombre': [null,[
        Validators.required
      ]]
    })

    if(this.data){
      this.DepartamentosForm.get('nombre').setValue(this.data.nombre)
    }

  }  

  Guardar(formulario){
    if(this.data){
      this.Servicios.ActualizarDepartamento(this.data.id,formulario.value.nombre).subscribe()
    }

    if(!this.data){
      this.Servicios.CrearDepartamento(formulario.value.nombre).subscribe();
    }
      this.DepartamentosForm.reset();
      this.ventana.close()
  }

}
