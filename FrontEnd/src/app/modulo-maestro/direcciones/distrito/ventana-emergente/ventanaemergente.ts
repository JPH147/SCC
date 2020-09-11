import {Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import {ServiciosDirecciones, Departamento, Provincia} from 'src/app/core/servicios/direcciones'

@Component({
  selector: 'app-ventanaemergentedistrito',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers:[ServiciosDirecciones]
})

export class VentanaEmergenteDistrito {
  
  public selectedValue: string;
  public DistritosForm: FormGroup;
  public departamentos: Departamento[] = [];
  public provincias: Provincia[] = [];
  public mensaje:string;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteDistrito>,
    private FormBuilder: FormBuilder,
    private Servicio:ServiciosDirecciones,
    public snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit(){
    this.DistritosForm = this.FormBuilder.group({
      'departamento': [null,[
        Validators.required
      ]],
      'provincia': [{value:null, disabled:true},[
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
      // Se traen y asignan los datos
      console.log(this.data);
      this.DistritosForm.get('departamento').setValue(this.data.departamento);
      this.ListarProvincias(this.data.departamento);
      this.DistritosForm.get('provincia').setValue(this.data.provincia);
      this.DistritosForm.get('nombre').setValue(this.data.nombre);
      // Se habilitan los formularios
      this.DistritosForm.controls['provincia'].enable();
    }

  }  

  Guardar(formulario){
    if(this.data){
      this.Servicio.ActualizarDistrito(this.data.id,formulario.value.provincia,formulario.value.nombre).subscribe(res=>{
        if(res['codigo']==0){
          this.Notificacion("Se actualizó el distrito satisfactoriamente","")
        } else {
          this.Notificacion("Ocurrió un error al actualizar el distrito","")
        }
      })
    }

    if(!this.data){
      this.Servicio.CrearDistrito(formulario.value.provincia,formulario.value.nombre).subscribe(res=>{
        if(res['codigo']==0){
          this.Notificacion("Se creó el distrito satisfactoriamente","")
        } else {
          this.Notificacion("Ocurrió un error al crear el distrito","")
        }
      });
    }
      this.DistritosForm.reset();
      this.ventana.close()
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  DepartamentoSeleccionado(event) {
    this.ListarProvincias(event.value);
    this.DistritosForm.get('provincia').setValue("");
    this.DistritosForm.controls['provincia'].enable();
  }

  ListarProvincias(nombre_departamento){
    this.provincias=[];
    this.Servicio.ListarProvincias(nombre_departamento,"",0,100000).subscribe(res=>{
      let Provincia = res['data'].provincias;
      for(let i in Provincia){
        this.provincias.push(Provincia[i])
      }
    });
  }

}
