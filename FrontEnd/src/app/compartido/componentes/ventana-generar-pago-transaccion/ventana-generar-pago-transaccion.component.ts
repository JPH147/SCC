import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';

import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms' ;
import { BehaviorSubject, Subject, merge, Observable, forkJoin } from 'rxjs';
import { CobranzasService } from '../../../modulo-cobranzas/cobranzas-listar/cobranzas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, takeUntil, map, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { CooperativaConfiguracionService } from 'src/app/modulo-maestro/cooperativa-configuracion/cooperativa-configuracion.service';

@Component({
  selector: 'app-ventana-generar-pago-transaccion',
  templateUrl: './ventana-generar-pago-transaccion.component.html',
  styleUrls: ['./ventana-generar-pago-transaccion.component.css']
})
export class VentanaGenerarPagoTransaccionComponent implements OnInit, AfterViewInit {

  private changesUnsubscribe = new Subject() ;
  public VerificandoVoucher = new BehaviorSubject<boolean>(false) ;

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public PagosForm : FormGroup ;
  public PagoArrayForm : FormArray ;

  public tipo_pagos : number = 0 ;

  public total_pagos : number = 0 ;
  public total_pagos_directos : number = 0 ;
  public total_pagos_judiciales : number = 0 ;
  public total_pagos_planilla : number = 0 ;

  public ListadoCuentas : Array<any> = [] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaGenerarPagoTransaccionComponent> ,
    private _builder : FormBuilder ,
    private _cobranzas : CobranzasService ,
    private _configuracion : CooperativaConfiguracionService ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;

    this.ListarCuentas() ;
  }

  ngAfterViewInit() {
    this.SuscribirFormArray() ;
  }

  SuscribirFormArray(){
    this.changesUnsubscribe.next();

    merge(
      ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
        control.get('pago_directo').valueChanges.pipe(
          debounceTime(200) ,
          distinctUntilChanged() ,
          takeUntil(this.changesUnsubscribe),
          map( value => ({
            index : index ,
            valor : value
          }))
        )
      )
    )
    .subscribe((respuesta) => {
      this.CalcularTotalPagosDirectos(respuesta.valor, respuesta.index) ;
    });

    merge(
      ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
        control.get('pago_planilla').valueChanges.pipe(
          debounceTime(200) ,
          distinctUntilChanged() ,
          takeUntil(this.changesUnsubscribe),
          map( value => ({
            index : index ,
            valor : value
          }))
        )
      )
    )
    .subscribe(() => {
      this.CalcularTotalPagosPlanilla() ;
    });

    merge(
      ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
        control.get('pago_judicial').valueChanges.pipe(
          debounceTime(200) ,
          distinctUntilChanged() ,
          takeUntil(this.changesUnsubscribe),
          map( value => ({
            index : index ,
            valor : value
          }))
        )
      )
    )
    .subscribe(() => {
      this.CalcularTotalPagosJudiciales() ;
    });

    merge(
      ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
        control.get('numero_operacion').valueChanges.pipe(
          debounceTime(200) ,
          distinctUntilChanged() ,
          takeUntil(this.changesUnsubscribe),
          map( value => ({
            index : index ,
            valor : value
          }))
        )
      )
    )
    .subscribe((valores) => {
      this.VerificarVoucherUnico(valores.valor, valores.index) ;
    });
  }

  CrearFormulario(){
    this.PagosForm = this._builder.group({
      PagoArrayForm : this._builder.array([])
    }) ;

    this.PagoArrayForm = this.PagosForm.get('PagoArrayForm') as FormArray ;

    this.EstablecerControlesArray() ;
  }

  CrearFormArray( tipo : number ) : FormGroup {
    return this._builder.group({
      fecha_pago : [ { value : new Date(), disabled : false },[
        Validators.required
      ] ] ,
      monto_cuota : [ { value : 0, disabled : false },[
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
      // 1. Generado para que coincida con el mes de la cuota
      // 2. Creado por el usuario
      tipo : [ { value : tipo, disabled : false },[
      ] ] ,
      cuenta_bancaria : [ { value : "", disabled: false },[
      ] ] ,
      // El número de cuenta solo se utiliza para mostrarlo en el hint del formulario
      numero_cuenta : [ { value : "", disabled: false },[
      ] ] ,
      numero_operacion : [ { value : "", disabled: false },[
      ] ] ,
    })
  }

  ListarCuentas(){
    this._configuracion.ListarCuentas(0,"",1,100).subscribe(res=>{
      this.ListadoCuentas = res['data'].cuentas;
    })
  }

  CuentaSeleccionada(index) {
    let cuenta : number = this.PagoArrayForm.controls[index].get('cuenta_bancaria').value ;
    let cuenta_seleccionada = this.ListadoCuentas.filter(e => e.id == cuenta)[0] ;
    this.PagoArrayForm.controls[index].get('numero_cuenta').setValue(cuenta_seleccionada.numero_cuenta) ;
  }

  AgregarPagoForm(tipo : number) {
    this.PagoArrayForm.push(this.CrearFormArray(tipo)) ;
  }

  CrearPago() {
    // Calculamos el index del último elemento
    // El index será la longitud del form actual -1
    let longitud_form : number = this.PagoArrayForm.length ;

    // Obtenemos la fecha del último elemento
    let ultima_fecha : Date = this.PagoArrayForm.controls[longitud_form-1].get('fecha_pago').value ;

    // Agregamos un mes a la última fecha
    let proxima_fecha = moment(ultima_fecha).add(1, 'month').toDate() ;

    // Creamos un nuevo elemento
    this.AgregarPagoForm(2) ;

    // Cambiamos la fecha del último elemento creado
    this.PagoArrayForm.controls[longitud_form].get('fecha_pago').setValue(proxima_fecha) ;
  }

  EstablecerControlesArray() {
    this.data.cronograma.map( (item, index) =>{
      this.AgregarPagoForm(1) ;
      this.PagoArrayForm.controls[index].get('fecha_pago').setValue(item.fecha_vencimiento) ;
      this.PagoArrayForm.controls[index].get('monto_cuota').setValue(this.data.tipo == 1 ? item.monto : item.monto_cuota) ;
      return item ;
    })

    this.AgregarContolesFechaActual() ;
  }

  AgregarContolesFechaActual() {
    let longitud_form = this.PagoArrayForm.value.length ;
    let ultima_fecha = this.PagoArrayForm.controls[longitud_form-1].get('fecha_pago').value ;

    let meses_hasta_hoy = moment(new Date()).diff(moment(ultima_fecha), 'months') ;

    for (let index = 0; index < meses_hasta_hoy; index++) {
      let fecha_nueva = moment(ultima_fecha).add(index+1, 'months').toDate() ;

      this.AgregarPagoForm(2) ;
      this.PagoArrayForm.controls[longitud_form+index].get('fecha_pago').setValue(fecha_nueva) ;
      this.PagoArrayForm.controls[longitud_form+index].get('monto_cuota').setValue(0) ;
    }

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

  CalcularTotalPagosDirectos(valor, indice) {
    if ( valor > 0 ) {
      this.PagoArrayForm.controls[indice].get('cuenta_bancaria').setValidators([Validators.required]) ;
      this.PagoArrayForm.controls[indice].get('numero_operacion').setValidators([Validators.required]) ;
      this.PagoArrayForm.controls[indice].get('cuenta_bancaria').updateValueAndValidity() ;
      this.PagoArrayForm.controls[indice].get('numero_operacion').updateValueAndValidity() ;
    } else {
      this.PagoArrayForm.controls[indice].get('cuenta_bancaria').clearValidators() ;
      this.PagoArrayForm.controls[indice].get('numero_operacion').clearValidators() ;
      this.PagoArrayForm.controls[indice].get('cuenta_bancaria').updateValueAndValidity() ;
      this.PagoArrayForm.controls[indice].get('numero_operacion').updateValueAndValidity() ;
    }

    this.total_pagos_directos = 0 ;
    this.PagoArrayForm.value.forEach(elemento => {
      this.total_pagos_directos = this.total_pagos_directos + elemento.pago_directo*1 ;
    });
    this.CalcularTotalGeneral() ;
  }

  CalcularTotalPagosJudiciales() {
    this.total_pagos_judiciales = 0 ;
    this.PagoArrayForm.value.forEach(elemento => {
      this.total_pagos_judiciales = this.total_pagos_judiciales + elemento.pago_judicial*1 ;
    });
    this.CalcularTotalGeneral() ;
  }

  CalcularTotalPagosPlanilla() {
    this.total_pagos_planilla = 0 ;
    this.PagoArrayForm.value.forEach(elemento => {
      this.total_pagos_planilla = this.total_pagos_planilla + elemento.pago_planilla*1 ;
    });
    this.CalcularTotalGeneral() ;
  }

  CalcularTotalGeneral() {
    this.total_pagos = this.total_pagos_directos + this.total_pagos_judiciales + this.total_pagos_planilla ;
  }

  TipoPagoSeleccionado(tipo) {
    if ( tipo == 1 ) {
      this.tipo_pagos = 1 ;
    }
    if ( tipo == 2 ) {
      this.tipo_pagos = 2 ;
      // this.PagoArrayForm.controls.forEach(elemento => {
      //   elemento.get('cuenta_bancaria').setValidators([Validators.required]) ;
      //   elemento.get('numero_operacion').setValidators([Validators.required]) ;
      //   elemento.get('cuenta_bancaria').updateValueAndValidity() ;
      //   elemento.get('numero_operacion').updateValueAndValidity() ;
      // });
    }
  }

  VerificarVoucherUnico(valor, indice){
    this.VerificandoVoucher.next(true) ;
    this._cobranzas.BuscarNumeroOperacion(valor)
    .pipe(
      finalize(()=>{
        this.VerificandoVoucher.next(false) ;
      })
    )
    .subscribe(resultado=>{
      console.log(resultado) ;
      if ( resultado ) {
        this.PagoArrayForm.controls[indice].get('numero_operacion').setErrors({'repetido':true}) ;
      } else {
        this.PagoArrayForm.controls[indice].get('numero_operacion').setErrors(null) ;
      }
    })
  }

  Guardar() {
    let pagos = this.PagoArrayForm.value ;
    let array_obserables : Array<Observable<any>> = [] ;

    if ( this.tipo_pagos == 1 ) {
      pagos.map(elemento => {
        // if ( elemento.pago_directo > 0 ) {
        //   array_obserables.push( this.CrearPagoManual(1,elemento.pago_directo, elemento.fecha_pago) ) ;
        // }
        if ( elemento.pago_planilla > 0 ) {
          array_obserables.push( this.CrearPagoManual(2,elemento.pago_planilla, elemento.fecha_pago) ) ;
        }
        if ( elemento.pago_judicial > 0 ) {
          array_obserables.push( this.CrearPagoManual(3,elemento.pago_judicial, elemento.fecha_pago) ) ;
        }
        return elemento ;
      }) ;
  
      this.Cargando.next(true) ;
      forkJoin(array_obserables)
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(() =>{
        this.ventana.close(true) ;
      })
    }

    if ( this.tipo_pagos == 2 ) {
      pagos.map(elemento => {
        if ( elemento.pago_directo > 0 ) {
          array_obserables.push(
            this.CrearPagoMasivo(
              elemento.pago_directo , 
              elemento.fecha_pago , 
              elemento.numero_operacion ,
              elemento.cuenta_bancaria
            )
          ) ;
        }
        return elemento ;
      }) ;
  
      this.Cargando.next(true) ;
      forkJoin(array_obserables)
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(() =>{
        this.ventana.close(true) ;
      })
    }
  }

  CrearPagoManual( tipo : number , monto_pagado : number, fecha: Date ) : Observable<any> {
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

    if ( this.data.tipo == 1 ) {
      return this._cobranzas.CrearCobranzaManualCredito(
        this.data.id_credito ,
        tipo + 2 ,
        fecha ,
        (new Date()).getTime().toString() ,
        Math.round(100*monto_pagado)/100 ,
        "Regularización de pago " + tipo_pago ,
      )
    }

    if ( this.data.tipo == 2 ) {
      return this._cobranzas.CrearCobranzaManualVenta(
        this.data.id_venta ,
        tipo + 2 ,
        fecha ,
        (new Date()).getTime().toString() ,
        Math.round(100*monto_pagado)/100 ,
        "Regularización de pago " + tipo_pago ,
      )
    }
  }

  CrearPagoMasivo(monto : number, fecha : Date, numero_operacion : string, cuenta_bancaria : number) : Observable<boolean> {
    return this._cobranzas.CrearCobranzaDirectaMasivo(
      fecha ,
      this.data.cliente ,
      cuenta_bancaria ,
      numero_operacion ,
      monto ,
      this.data.tipo ,
      this.data.tipo == 1 ? this.data.id_credito : this.data.id_venta ,
      "Regularización de pago masivo"
    )
  }

}