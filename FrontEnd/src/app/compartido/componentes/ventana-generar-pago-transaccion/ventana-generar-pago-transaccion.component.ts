import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';

import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms' ;
import { BehaviorSubject, Subject, merge, Observable, forkJoin } from 'rxjs';
import { CobranzasService } from '../../../components/cobranzas-listar/cobranzas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, debounceTime, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-ventana-generar-pago-transaccion',
  templateUrl: './ventana-generar-pago-transaccion.component.html',
  styleUrls: ['./ventana-generar-pago-transaccion.component.css']
})
export class VentanaGenerarPagoTransaccionComponent implements OnInit, AfterViewInit {

  private changesUnsubscribe = new Subject() ;

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public PagosForm : FormGroup ;
  public PagoArrayForm : FormArray ;

  public total_pagos : number = 0 ;
  public total_pagos_directos : number = 0 ;
  public total_pagos_judiciales : number = 0 ;
  public total_pagos_planilla : number = 0 ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaGenerarPagoTransaccionComponent> ,
    private _builder : FormBuilder ,
    private _cobranzas : CobranzasService ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;
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
    .subscribe(() => {
      this.CalcularTotalPagosDirectos() ;
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
    })
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

  CalcularTotalPagosDirectos() {
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

  Guardar() {
    let pagos = this.PagoArrayForm.value ;
    let array_obserables : Array<Observable<any>> = [] ;

    pagos.map(elemento => {
      if ( elemento.pago_directo > 0 ) {
        array_obserables.push( this.CrearPagoManual(1,elemento.pago_directo, elemento.fecha_pago) ) ;
      }
      if ( elemento.pago_planilla > 0 ) {
        array_obserables.push( this.CrearPagoManual(2,elemento.pago_planilla, elemento.fecha_pago) ) ;
      }
      if ( elemento.pago_judicial > 0 ) {
        array_obserables.push( this.CrearPagoManual(3,elemento.pago_judicial, elemento.fecha_pago) ) ;
      }
      return elemento ;
    }) ;

    forkJoin(array_obserables)
    .subscribe(() =>{
      this.ventana.close(true) ;
    })
  }

  CrearPagoManual( tipo : number , monto_pagado : number, fecha: Date ) : Observable<any> {
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

}