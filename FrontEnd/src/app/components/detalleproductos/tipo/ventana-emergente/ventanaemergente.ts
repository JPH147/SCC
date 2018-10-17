import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import { ServiciosGenerales } from '../../../global/servicios';

@Component({
  selector: 'app-ventanaemergentetipo',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers:[ServiciosGenerales]
})

export class VentanaEmergenteTipo {
  
  public selectedValue: string;
  public TipoForm: FormGroup;
  public Tipo: Array<any>;
  public lstunidades: any[] = [];
  public mensaje: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteTipo>,
    private FormBuilder: FormBuilder,
    private Servicios:ServiciosGenerales,
    public snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit(){
    this.TipoForm = this.FormBuilder.group({
      'nombre': [null,[
        Validators.required
      ]],
      'idunidadmedida': [null,[
        Validators.required
      ]]
    })

    this.Servicios.ListarUnidadMedida('').subscribe(res=>{
      let unidades = res['data'].unidades;
      for(let i in unidades){
        this.lstunidades.push(unidades[i])
      }
    });

    if(this.data){
      this.TipoForm.get('nombre').setValue(this.data.nombre);
      this.TipoForm.get('idunidadmedida').setValue(this.data.idunidad);
    }

  }  

  Guardar(formulario){
    if(this.data){
      this.mensaje='Datos actualizados satisfactoriamente';
      this.Servicios.EditarTipoProducto(this.data.id,formulario.value.nombre, formulario.value.idunidadmedida).subscribe();
    }

    if(!this.data){
      this.mensaje='Tipo de Producto creado satisfactoriamente';
      this.Servicios.CrearTipoProducto(formulario.value.nombre, formulario.value.idunidadmedida).subscribe();
    }
      this.TipoForm.reset();
      this.ventana.close()
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
