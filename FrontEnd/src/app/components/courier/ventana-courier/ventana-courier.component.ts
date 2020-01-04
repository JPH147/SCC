import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { ServiciosGenerales } from '../../global/servicios';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-ventana-courier',
  templateUrl: './ventana-courier.component.html',
  styleUrls: ['./ventana-courier.component.css'],
  providers : [ ServiciosGenerales ]
})
export class VentanaCourierComponent implements OnInit {

  public VentanaCourierForm : FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    public ventana: MatDialogRef<VentanaCourierComponent> ,
    private Builder : FormBuilder ,
    private Servicio: ServiciosGenerales
  ) { }

  ngOnInit() {

    this.CrearFormulario();

    if(this.data) {
       this.AsignarInformacion();
    }

  }

  CrearFormulario(){
    this.VentanaCourierForm = this.Builder.group({
      id: [ { value : null, disabled : false } , [
      ] ],
      nombre: [ { value : null, disabled : false } , [
        Validators.required
      ] ],
      url: [ { value : null, disabled : false } , [
        Validators.required
      ] ],
    })
  }

  AsignarInformacion(){
    this.Servicio.SeleccionarCourier(this.data).subscribe(res=>{
      this.VentanaCourierForm.get('id').setValue(res.id);
      this.VentanaCourierForm.get('nombre').setValue(res.nombre);
      this.VentanaCourierForm.get('url').setValue(res.url);
    })
  }

  Guardar(){
    if(this.data){
      this.ActualizarCourier()
    } else {
      this.CrearCourier()    
    }
  }

  CrearCourier(){
    this.Servicio.CrearCourier(
      this.VentanaCourierForm.value.nombre,
      this.VentanaCourierForm.value.url
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      } else {
        this.ventana.close(false)
      }
    })
  }

  ActualizarCourier(){
    this.Servicio.ActualizarCourier(
      this.VentanaCourierForm.value.id,
      this.VentanaCourierForm.value.nombre,
      this.VentanaCourierForm.value.url
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      } else {
        this.ventana.close(false)
      }
    })
  }

}
