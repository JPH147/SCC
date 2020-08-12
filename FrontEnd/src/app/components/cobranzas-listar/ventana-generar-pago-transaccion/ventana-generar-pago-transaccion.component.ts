import { Component, OnInit, Inject } from '@angular/core';

import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms' ;
import { BehaviorSubject } from 'rxjs';
import { CobranzasService } from '../cobranzas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ventana-generar-pago-transaccion',
  templateUrl: './ventana-generar-pago-transaccion.component.html',
  styleUrls: ['./ventana-generar-pago-transaccion.component.css']
})
export class VentanaGenerarPagoTransaccionComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public PagosForm : FormGroup ;
  public PagoArrayForm : FormArray ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : any ,
    private ventana : MatDialogRef<VentanaGenerarPagoTransaccionComponent> ,
    private _builder : FormBuilder ,
    private _cobranzas : CobranzasService ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;
  }

  CrearFormulario(){
    this.PagosForm = this._builder.group({
      PagoArrayForm : this._builder.array([this.CrearFormArray()])
    }) ;

    this.PagoArrayForm = this.PagosForm.get('PagoArrayForm') as FormArray ;
  }

  CrearFormArray() : FormGroup {
    return this._builder.group({
      fecha_pago : [ { value : new Date(), disabled : false },[
        Validators.required
      ] ] ,
      pago_directo : [ { value : 0, disabled : false },[
        this.NumeroDecimal ,
        Validators.required
      ] ] ,
      pago_planilla : [ { value : 0, disabled : false },[
        this.NumeroDecimal ,
        Validators.required
      ] ] ,
      pago_judicial : [ { value : 0, disabled : false },[
        this.NumeroDecimal ,
        Validators.required
      ] ] ,
    })
  }

  AgregarPagoForm() {
    this.PagoArrayForm.push(this.CrearFormArray()) ;
  }

  NumeroDecimal(): ValidatorFn {
    return  (c: AbstractControl): {[key: string]: boolean} | null => {
      let number = /^[.\d]+$/.test(c.value) ? +c.value : NaN;
      if (number !== number) {
        return { 'value': true };
      }
  
      return null;
    };
  }

  EliminarPago( index ){
    this.PagoArrayForm.removeAt(index) ;
  }

  Guardar() {
    let pagos = this.PagoArrayForm.value ;

    pagos.map(elemento => {
      if ( elemento.pago_directo > 0 ) {
        this.CrearPagoManual(1,elemento.pago_directo, elemento.fecha_pago)
      }
      if ( elemento.pago_planilla > 0 ) {
        this.CrearPagoManual(2,elemento.pago_planilla, elemento.fecha_pago)
      }
      if ( elemento.pago_judicial > 0 ) {
        this.CrearPagoManual(3,elemento.pago_judicial, elemento.fecha_pago)
      }
      return elemento ;
    }) ;
    this.ventana.close(true) ;
  }

  CrearPagoManual( tipo : number , monto_pagado : number, fecha: Date ) {
    this.Cargando.next(true) ;

    let tipo_pago : string ;
    
    switch (tipo) {
      case 1:
        tipo_pago = "directo" ;
        break;

      case 2:
        tipo_pago = "por planilla" ;
        break;

      case 3:
        tipo_pago = "judicial" ;
        break;
    
      default:
        break;
    }

    this._cobranzas.CrearCobranzaManual(
      this.data.cliente ,
      tipo + 2 ,
      fecha ,
      (new Date()).getTime().toString() ,
      0 ,
      monto_pagado ,
      "Regularización de pago " + tipo_pago ,
    )
    .subscribe(res=>{
      this._cobranzas.CrearDetalleCobranza(
        0 ,
        0 ,
        0 ,
        res['data'] ,
        this.data.tipo == 1 ? this.data.id_credito : 0 ,
        this.data.tipo == 2 ? this.data.id_venta : 0 ,
        monto_pagado ,
        fecha
      )
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe()
    })
  }

}