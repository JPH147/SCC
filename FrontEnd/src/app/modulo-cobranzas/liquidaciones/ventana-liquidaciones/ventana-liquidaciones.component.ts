import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-liquidaciones',
  templateUrl: './ventana-liquidaciones.component.html',
  styleUrls: ['./ventana-liquidaciones.component.css']
})
export class VentanaLiquidacionesComponent implements OnInit {

  public LiquidacionesForm : FormGroup ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any , 
    private _builder : FormBuilder
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;

    this.AsignarInformacion(this.data.liquidacion) ;
  }

  private CrearFormulario() {
    this.LiquidacionesForm = this._builder.group({
      tipo : '' ,
      documento : '' ,
      id_tipo : '' ,
      id_transaccion : '' ,
      cliente_dni : '' ,
      cliente_nombre : '' ,
      monto : '' ,
      fecha : '' ,
      usuario : '' ,
      observacion : '' ,
    })
  }

  private AsignarInformacion(informacion) {
    this.LiquidacionesForm.get('tipo').setValue(informacion.tipo) ;
    this.LiquidacionesForm.get('documento').setValue(informacion.documento) ;
    this.LiquidacionesForm.get('id_tipo').setValue(informacion.id_tipo) ;
    this.LiquidacionesForm.get('id_transaccion').setValue(informacion.id_transaccion) ;
    this.LiquidacionesForm.get('cliente_dni').setValue(informacion.cliente_dni) ;
    this.LiquidacionesForm.get('cliente_nombre').setValue(informacion.cliente_nombre) ;
    this.LiquidacionesForm.get('monto').setValue(informacion.monto) ;
    this.LiquidacionesForm.get('fecha').setValue(informacion.fecha) ;
    this.LiquidacionesForm.get('usuario').setValue(informacion.usuario) ;
    this.LiquidacionesForm.get('observacion').setValue(informacion.observacion) ;
  }

}
