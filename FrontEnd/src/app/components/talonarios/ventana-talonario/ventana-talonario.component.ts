import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { ServiciosVentas } from '../../global/ventas';

@Component({
  selector: 'app-ventana-talonario',
  templateUrl: './ventana-talonario.component.html',
  styleUrls: ['./ventana-talonario.component.css'],
  providers: [ServiciosVentas]
})
export class VentanaTalonarioComponent implements OnInit {

  public TalonariosForm : FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaTalonarioComponent>,
    private Builder: FormBuilder,
    private Servicios: ServiciosVentas,
  ) {}

  ngOnInit() {
    this.CrearFormulario();
  }

  ngAfterViewInit(){
  }

  CrearFormulario(){
    this.TalonariosForm = this.Builder.group({
      'serie': [{value: "", disabled: false}, [
        Validators.required
      ]],
      'numero_inicio': [{value: 0, disabled: false}, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      'numero_fin': [ 0, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]]
    });
  }

  Guardar(){
    this.CrearTalonario()
  }

  CrearTalonario(){
    this.Servicios.CrearTalonarios(
      this.TalonariosForm.value.serie,
      this.TalonariosForm.value.numero_inicio,
      this.TalonariosForm.value.numero_fin
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

}