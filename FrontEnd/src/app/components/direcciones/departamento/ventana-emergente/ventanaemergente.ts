import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import {ServiciosDirecciones, Departamento} from '../../../global/direcciones'

@Component({
  selector: 'app-ventanaemergentedepartamento',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers:[ServiciosDirecciones]
})

export class VentanaEmergenteDepartamento {
  
  public selectedValue: string;
  public DepartamentosForm: FormGroup;
  public Departamento: Array<Departamento>;
  private mensaje: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteDepartamento>,
    private FormBuilder: FormBuilder,
    private Servicios:ServiciosDirecciones,
    public snackBar: MatSnackBar
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
      this.mensaje='Datos actualizados satisfactoriamente';
      this.Servicios.ActualizarDepartamento(this.data.id,formulario.value.nombre).subscribe()
    }

    if(!this.data){
      this.mensaje='Departamento creado satisfactoriamente';
      this.Servicios.CrearDepartamento(formulario.value.nombre).subscribe();
    }
      this.DepartamentosForm.reset();
      this.ventana.close()
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
