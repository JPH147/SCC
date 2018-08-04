import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import {ServiciosDirecciones, Provincia, Departamento} from '../../../global/direcciones'

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers:[ServiciosDirecciones]
})

export class VentanaEmergenteProvincia {
  
  public selectedValue: string;
  public ProvinciasForm: FormGroup;
  public departamentos: Departamento[]=[];
  private mensaje: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteProvincia>,
    private FormBuilder: FormBuilder,
    private Servicio:ServiciosDirecciones,
    public snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit(){
    this.ProvinciasForm = this.FormBuilder.group({
      'departamento': [null,[
        Validators.required
      ]],
      'nombre': [null,[
        Validators.required
      ]]
    })

    this.Servicio.ListarDepartamentos("",0,100000).subscribe(res=>{
      let Departamento = res['data'].departamentos;
      for(let i in Departamento){
        this.departamentos.push(Departamento[i])
      }
    });

    if(this.data){
      console.log(this.data);
      this.ProvinciasForm.get('departamento').setValue(this.data.departamento);
      this.ProvinciasForm.get('nombre').setValue(this.data.nombre)
    }
  }

  Guardar(formulario){
   if(this.data){
      this.mensaje='Datos actualizados satisfactoriamente';
      this.Servicio.ActualizarDepartamento(this.data.id,formulario.value.nombre).subscribe()
   }

    if(!this.data){
      this.mensaje='Provincia creada satisfactoriamente';
      this.Servicio.CrearProvincia(formulario.value.departamento,formulario.value.nombre).subscribe();
    }
      this.ventana.close()
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

