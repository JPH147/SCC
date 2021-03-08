import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';

import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms' ;
import { BehaviorSubject, Subject, merge, Observable, forkJoin } from 'rxjs';
import { CobranzasService } from '../../../modulo-cobranzas/cobranzas-listar/cobranzas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, takeUntil, map, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { CooperativaConfiguracionService } from 'src/app/modulo-maestro/cooperativa-configuracion/cooperativa-configuracion.service';

import { Validadores } from '../../utilitarios/validadores' ;
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';

import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-ventana-generar-pago-transaccion-unitaria',
  templateUrl: './ventana-generar-pago-transaccion-unitaria.component.html',
  styleUrls: ['./ventana-generar-pago-transaccion-unitaria.component.css']
})
export class VentanaGenerarPagoTransaccionUnitariaComponent implements OnInit, AfterViewInit {

  // private changesUnsubscribe = new Subject() ;
  public VerificandoVoucher = new BehaviorSubject<boolean>(false) ;

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public PagosForm : FormGroup ;
  public PagoArrayForm : FormArray ;

  public tipo_pagos : number = 0 ;

  public ListadoCuentas : Array<any> = [] ;

  public Vendedores : Array<any> = [] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaGenerarPagoTransaccionUnitariaComponent> ,
    private _builder : FormBuilder ,
    private _cobranzas : CobranzasService ,
    private _configuracion : CooperativaConfiguracionService ,
    private _generales : ServiciosGenerales ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;

    this.ListarCuentas() ;
    this.ListarVendedor() ;
  }

  ngAfterViewInit() {
    // this.SuscribirFormArray() ;
  }

  // SuscribirFormArray(){
  //   this.changesUnsubscribe.next();

  //   merge(
  //     ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
  //       control.get('pago_directo').valueChanges.pipe(
  //         debounceTime(200) ,
  //         distinctUntilChanged() ,
  //         takeUntil(this.changesUnsubscribe),
  //         map( value => ({
  //           index : index ,
  //           valor : value
  //         }))
  //       )
  //     )
  //   )
  //   .subscribe((respuesta) => {
  //     this.CalcularTotalPagosDirectos(respuesta.valor, respuesta.index) ;
  //   });

  //   merge(
  //     ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
  //       control.get('pago_planilla').valueChanges.pipe(
  //         debounceTime(200) ,
  //         distinctUntilChanged() ,
  //         takeUntil(this.changesUnsubscribe),
  //         map( value => ({
  //           index : index ,
  //           valor : value
  //         }))
  //       )
  //     )
  //   )
  //   .subscribe(() => {
  //     this.CalcularTotalPagosPlanilla() ;
  //   });

  //   merge(
  //     ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
  //       control.get('pago_judicial').valueChanges.pipe(
  //         debounceTime(200) ,
  //         distinctUntilChanged() ,
  //         takeUntil(this.changesUnsubscribe),
  //         map( value => ({
  //           index : index ,
  //           valor : value
  //         }))
  //       )
  //     )
  //   )
  //   .subscribe(() => {
  //     this.CalcularTotalPagosJudiciales() ;
  //   });

  //   merge(
  //     ...this.PagoArrayForm.controls.map( (control: AbstractControl, index: number) =>
  //       control.get('numero_operacion').valueChanges.pipe(
  //         debounceTime(200) ,
  //         distinctUntilChanged() ,
  //         takeUntil(this.changesUnsubscribe),
  //         map( value => ({
  //           index : index ,
  //           valor : value
  //         }))
  //       )
  //     )
  //   )
  //   .subscribe((valores) => {
  //     this.VerificarVoucherUnicoVista() ;
  //   });
  // }

  CrearFormulario(){
    this.PagosForm = this._builder.group({
      PagoArrayForm : this._builder.array([])
    }) ;

    this.PagoArrayForm = this.PagosForm.get('PagoArrayForm') as FormArray ;
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
        Validators.min(0) ,
        Validators.required
      ] ] ,
      pago_planilla : [ { value : 0, disabled : false },[
        this.NumeroDecimal ,
        Validators.min(0) ,
        Validators.required
      ] ] ,
      pago_judicial : [ { value : 0, disabled : false },[
        this.NumeroDecimal ,
        Validators.min(0) ,
        Validators.required
      ] ] ,
      // 1. Generado para que coincida con el mes de la cuota
      // 2. Creado por el usuario
      tipo : [ { value : tipo, disabled : false },[
      ] ] ,
      cuenta_bancaria : [ { value : "", disabled: false },[
      ] ] ,
      referente : [ { value : 0, disabled: false },[
      ] ] ,
      // El número de cuenta solo se utiliza para mostrarlo en el hint del formulario
      numero_cuenta : [ { value : "", disabled: false },[
      ] ] ,
      numero_operacion : [ { value : "", disabled: false },[
      ], [
        Validadores.VoucherUnicioValidador(this._cobranzas)
      ]] ,
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

  // CrearPago() {
  //   // Calculamos el index del último elemento
  //   // El index será la longitud del form actual -1
  //   let longitud_form : number = this.PagoArrayForm.length ;

  //   // Obtenemos la fecha del último elemento
  //   let ultima_fecha : Date = this.PagoArrayForm.controls[longitud_form-1].get('fecha_pago').value ;

  //   // Agregamos un mes a la última fecha
  //   let proxima_fecha = moment(ultima_fecha).add(1, 'month').toDate() ;

  //   // Creamos un nuevo elemento
  //   this.AgregarPagoForm(2) ;

  //   // Cambiamos la fecha del último elemento creado
  //   this.PagoArrayForm.controls[longitud_form].get('fecha_pago').setValue(proxima_fecha) ;
  // }

  // 1. Se utilizan las fechas del cronograma por periodos
  // 2. Se utilizan las fechas del cronograma normal (Todo es por periodos ahora)
  EstablecerControlesArray(tipo : number) {
    this.AgregarPagoForm(tipo) ;
    if ( tipo == 1 ) {
      // this.data.cronograma_periodos.map( (item, index) =>{
        this.PagoArrayForm.controls[0].get('fecha_pago').setValue(moment(new Date()).endOf('month').toDate() ) ;
        this.PagoArrayForm.controls[0].get('monto_cuota').setValue(0) ;
        this.PagoArrayForm.controls[0].get('pago_planilla').setValue(0) ;
        // this.PagoArrayForm.controls[0].get('pago_planilla_antiguo').setValue(0) ;
        this.PagoArrayForm.controls[0].get('pago_judicial').setValue(0) ;
        // this.PagoArrayForm.controls[0].get('pago_judicial_antiguo').setValue(0) ;
      //   return item ;
      // })
    } else {
      // this.data.cronograma_periodos.map( (item, index) =>{
        this.PagoArrayForm.controls[0].get('fecha_pago').setValue(new Date()) ;
        this.PagoArrayForm.controls[0].get('monto_cuota').setValue(0) ;
        this.PagoArrayForm.controls[0].get('cuenta_bancaria').setValidators([Validators.required]) ;
        this.PagoArrayForm.controls[0].get('numero_operacion').setValidators([Validators.required]) ;
        // return item ;
      // })
    }
  }

  AgregarCuota(tipo : number) {
    let siguiente_fecha : Date ;
    let total_pagos : number = this.PagoArrayForm.length ;
    let ultima_fecha : Date = this.PagoArrayForm.controls[total_pagos-1].get('fecha_pago').value ;

    siguiente_fecha = moment(ultima_fecha).add(1,'month').toDate() ;
    
    this.AgregarPagoForm(tipo) ;
    if ( tipo == 1 ) {
      // this.data.cronograma_periodos.map( (item, index) =>{
        this.PagoArrayForm.controls[total_pagos].get('fecha_pago').setValue(siguiente_fecha) ;
        this.PagoArrayForm.controls[total_pagos].get('monto_cuota').setValue(0) ;
        this.PagoArrayForm.controls[total_pagos].get('pago_planilla').setValue(0) ;
        // this.PagoArrayForm.controls[0].get('pago_planilla_antiguo').setValue(0) ;
        this.PagoArrayForm.controls[total_pagos].get('pago_judicial').setValue(0) ;
        // this.PagoArrayForm.controls[0].get('pago_judicial_antiguo').setValue(0) ;
      //   return item ;
      // })
    } else {
      // this.data.cronograma_periodos.map( (item, index) =>{
        // this.AgregarPagoForm(1) ;
        this.PagoArrayForm.controls[total_pagos].get('fecha_pago').setValue(siguiente_fecha) ;
        this.PagoArrayForm.controls[total_pagos].get('monto_cuota').setValue(0) ;
        this.PagoArrayForm.controls[total_pagos].get('cuenta_bancaria').setValidators([Validators.required]) ;
        this.PagoArrayForm.controls[total_pagos].get('numero_operacion').setValidators([Validators.required]) ;
        // return item ;
      // })
    }
  }

  // AgregarControlesFechaActual() {
  //   let longitud_form = this.PagoArrayForm.value.length ;
  //   let ultima_fecha = this.PagoArrayForm.controls[longitud_form-1].get('fecha_pago').value ;

  //   let meses_hasta_hoy = moment(new Date()).diff(moment(ultima_fecha), 'months') ;

  //   for (let index = 0; index < meses_hasta_hoy; index++) {
  //     let fecha_nueva = moment(ultima_fecha).add(index+1, 'months').toDate() ;

  //     this.AgregarPagoForm(2) ;
  //     this.PagoArrayForm.controls[longitud_form+index].get('fecha_pago').setValue(fecha_nueva) ;
  //     this.PagoArrayForm.controls[longitud_form+index].get('monto_cuota').setValue(0) ;
  //   }

  // }

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

  AnoElegido(ano_normalizado: Moment, index : number) {
    let ano_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.PagoArrayForm.controls[index].get('fecha_pago').value ) {
      ano_seleccionado = moment(this.PagoArrayForm.controls[index].get('fecha_pago').value) ;
    } else {
      ano_seleccionado = moment() ;
    }
    ano_seleccionado.year(ano_normalizado.year());
    this.PagoArrayForm.controls[index].get('fecha_pago').setValue(ano_seleccionado);
  }

  MesElegido(mes_normalizado: Moment, datepicker: MatDatepicker<Moment>, index : number) {
    let mes_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.PagoArrayForm.controls[index].get('fecha_pago').value ) {
      mes_seleccionado = moment( this.PagoArrayForm.controls[index].get('fecha_pago').value ) ;
    } else {
      mes_seleccionado = moment() ;
    }

    mes_seleccionado.year(mes_normalizado.year()) ;
    mes_seleccionado.month(mes_normalizado.month());

    this.PagoArrayForm.controls[index].get('fecha_pago').setValue(moment(mes_seleccionado).endOf('month').toDate());
    datepicker.close();
  }

  TipoPagoSeleccionado(tipo) {
    if ( tipo == 1 ) {
      this.tipo_pagos = 1 ;
    }
    if ( tipo == 2 ) {
      this.tipo_pagos = 2 ;
    }
    this.EstablecerControlesArray(tipo) ;
    // this.SuscribirFormArray() ;
  }

  ListarVendedor() {
    this._generales.ListarVendedor("","","",1,50).subscribe( res => {
      this.Vendedores = res ;
    });
  }

  Guardar() {
    let Pagos = this.PagoArrayForm.value ;
    let array_obserables : Array<Observable<any>> = [] ;
    let informacion : Array<any> = [] ;

    if ( this.tipo_pagos == 1 ) {
      Pagos.forEach((elemento, index) => {
        if ( this.data.tipo == 1 ) {
          if ( elemento.pago_planilla > 0 ) {
            array_obserables.push(
              this._cobranzas.CrearCobranzaManualCredito(
                this.data.id_credito ,
                4 ,
                elemento.fecha_pago ,
                (new Date()).getTime().toString() ,
                Math.round(100*elemento.pago_planilla)/100 ,
                "Regularización de pago por planilla" ,
              )
            )
          }
          if ( elemento.pago_judicial > 0 ) {
            array_obserables.push(
              this._cobranzas.CrearCobranzaManualCredito(
                this.data.id_credito ,
                5 ,
                elemento.fecha_pago ,
                (new Date()).getTime().toString() ,
                Math.round(100*elemento.pago_judicial)/100 ,
                "Regularización de pago judicial" ,
              )
            )
          }
        }
        
        if ( this.data.tipo == 2 ) {
          if ( elemento.pago_planilla > 0 ) {
            array_obserables.push(
              this._cobranzas.CrearCobranzaManualVenta(
                this.data.id_venta ,
                4 ,
                elemento.fecha_pago ,
                (new Date()).getTime().toString() ,
                Math.round(100*elemento.pago_planilla)/100 ,
                "Regularización de pago por planilla" ,
              )
            )
          }
          if ( elemento.pago_judicial > 0 ) {
            array_obserables.push(
              this._cobranzas.CrearCobranzaManualVenta(
                this.data.id_venta ,
                5 ,
                elemento.fecha_pago ,
                (new Date()).getTime().toString() ,
                Math.round(100*elemento.pago_judicial)/100 ,
                "Regularización de pago judicial" ,
              )
            )
          }
        }
      });
      this.Cargando.next(true) ;

      forkJoin(
        array_obserables
      ).pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(() =>{
        this.ventana.close(true) ;
      })
    }

    if ( this.tipo_pagos == 2 ) {
      this.Cargando.next(true) ;
      Pagos.forEach(elemento => {
        array_obserables.push(
          this._cobranzas.CrearCobranzaDirectaMasivo(
            elemento.fecha_pago ,
            this.data.cliente ,
            elemento.cuenta_bancaria ,
            elemento.numero_operacion ,
            elemento.referente ,
            elemento.pago_directo ,
            this.data.tipo ,
            this.data.tipo == 1 ? this.data.id_credito : this.data.id_venta ,
            "Regularización de pago directo"
          )
        )
      });

      forkJoin(
        array_obserables
      ).pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(() =>{
        this.ventana.close(true) ;
      })
    }
  }
}