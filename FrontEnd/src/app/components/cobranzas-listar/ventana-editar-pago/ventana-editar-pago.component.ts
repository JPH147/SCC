import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

import { ServiciosTipoPago } from 'src/app/core/servicios/tipopago';
import { CobranzasService } from '../cobranzas.service';

@Component({
  selector: 'app-ventana-editar-pago',
  templateUrl: './ventana-editar-pago.component.html',
  styleUrls: ['./ventana-editar-pago.component.css'],
  providers: [ ServiciosTipoPago ]
})
export class VentanaEditarPagoComponent implements OnInit {

  public VentanaPagoForm : FormGroup;
  public ListadoTipoPago : Array<any> ;
  public Hoy = new Date() ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEditarPagoComponent>,
    private Builder : FormBuilder ,
    private ServicioTipoPago: ServiciosTipoPago,
    private Servicios : CobranzasService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarTipoPago();

    this.VentanaPagoForm.get('fecha_vencimiento').setValue(moment(this.data.fecha_vencimiento).toDate())
    this.VentanaPagoForm.get('tipo_pago').setValue(this.data.tipo_pago)
  }

  onNoClick(){
    this.ventana.close()
  }

  CrearFormulario(){
    this.VentanaPagoForm = this.Builder.group({
      fecha_vencimiento : [ { value:new Date(), disabled : false },[
        Validators.required
      ] ],
      tipo_pago : [ { value:0, disabled : false },[
        Validators.required
      ] ],
    })
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago(1).subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  Guardar(){
    this.Servicios.ActualizarCuota(
      this.data.tipo,
      this.data.id,
      this.VentanaPagoForm.value.fecha_vencimiento,
      this.VentanaPagoForm.value.tipo_pago,
    ).subscribe(res=>{
      if(res['data']){
        this.ventana.close(true)
      } else {
        this.ventana.close(false)
      }
    })
  }

}
