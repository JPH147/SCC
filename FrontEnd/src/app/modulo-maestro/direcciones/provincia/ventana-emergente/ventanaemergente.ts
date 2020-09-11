import {Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ServiciosDirecciones, Departamento} from 'src/app/core/servicios/direcciones'

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
  public mensaje: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private ventana: MatDialogRef<VentanaEmergenteProvincia>,
    private FormBuilder: FormBuilder,
    private Servicio:ServiciosDirecciones,
    private snackBar: MatSnackBar
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
      this.ProvinciasForm.get('departamento').setValue(this.data.departamento);
      this.ProvinciasForm.get('nombre').setValue(this.data.nombre)
    }
  }

  Guardar(formulario){
   if(this.data){
      this.Servicio.ActualizarProvincia(this.data.id, formulario.value.departamento, formulario.value.nombre).subscribe(res=>{
        if(res['codigo']==0){
          this.Notificacion("Se actualizó la provincia satisfactoriamente","")
        } else {
          this.Notificacion("Ocurrió un error al actualizar la provincia","")
        }
      })
   }

    if(!this.data){
      this.Servicio.CrearProvincia(formulario.value.departamento,formulario.value.nombre).subscribe(res=>{
        if(res['codigo']==0){
          this.Notificacion("Se creó la provincia satisfactoriamente","")
        } else {
          this.Notificacion("Ocurrió un error al crear la provincia","")
        }
      });
    }
      this.ventana.close()
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

