import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { TrabajadoresService } from '../trabajadores.service';

@Component({
  selector: 'app-ventana-trabajador',
  templateUrl: './ventana-trabajador.component.html',
  styleUrls: ['./ventana-trabajador.component.css'],
  providers: [TrabajadoresService]
})

export class VentanaTrabajadoresComponent implements OnInit {

  public TrabajadorForm : FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaTrabajadoresComponent>,
    private Servicio: TrabajadoresService,
    private Builder : FormBuilder
  ) { }

  ngOnInit() {
    this.CrearFormulario();
  }

  CrearFormulario(){

    this.TrabajadorForm = this.Builder.group({
      documento : [{value: "", disabled :false},[
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern ('[0-9- ]+')
      ]],
      nombre:[{value: null, disabled: false},[
        Validators.required
      ]],
      cargo : [ {value: "", disabled :false} ,[
        Validators.required
      ]],
      hora_ingreso : [{value: "09:00", disabled :false},[
        Validators.required
      ]],
      hora_salida : [{value: "19:00", disabled :false},[
        Validators.required
      ]]
    })
  }

  Guardar(){
    this.Servicio.Crear(
      this.TrabajadorForm.value.documento,
      this.TrabajadorForm.value.nombre,
      this.TrabajadorForm.value.cargo,
      this.TrabajadorForm.value.hora_ingreso,
      this.TrabajadorForm.value.hora_salida
    ).subscribe(res=>{
      this.ventana.close(true)
    })
  }

  onNoClick(): void {
    this.ventana.close();
  }

}