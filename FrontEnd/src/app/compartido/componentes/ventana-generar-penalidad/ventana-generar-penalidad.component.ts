import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, merge } from 'rxjs';
import { EvaluacionService } from 'src/app/modulo-clientes/evaluacion/evaluacion.service';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';

import * as moment from 'moment' ;
import { ServiciosTipoPago } from 'src/app/core/servicios/tipopago';
import { CreditosService } from 'src/app/modulo-creditos/creditos/creditos.service';
import { VentaService } from 'src/app/modulo-ventas/ventas/ventas.service';

@Component({
  selector: 'app-ventana-generar-penalidad',
  templateUrl: './ventana-generar-penalidad.component.html',
  styleUrls: ['./ventana-generar-penalidad.component.css']
})
export class VentanaGenerarPenalidadComponent implements OnInit, AfterViewInit {

  public PenalidadForm : FormGroup ;
  public Cargando = new BehaviorSubject<boolean>(false) ;

  public ListadoTipoPago : Array<any> ;

  private penalidad_porcentaje : number ;
  private penalidad_maxima_cuota : number ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaGenerarPenalidadComponent> ,
    private _builder : FormBuilder ,
    private _evaluacion : EvaluacionService ,
    private _tipoPago : ServiciosTipoPago ,
    private _creditos : CreditosService ,
    private _ventas : VentaService
  ) { }

  ngOnInit(): void {
    this.ListarTipoPago() ;
    this.ObtenerInformacion() ;

    this.CrearFormulario() ;
  }

  ngAfterViewInit() {
    merge(
      this.PenalidadForm.get('monto').valueChanges ,
      this.PenalidadForm.get('numero_cuotas').valueChanges
    )
    .pipe(
      debounceTime(200) ,
      distinctUntilChanged() ,
      tap(()=>{
        this.CalcularMontoCuota() ;
      })
    ).subscribe()
  }

  private CrearFormulario() {
    this.PenalidadForm = this._builder.group({
      monto : [{ value : 0, disabled : false },[
        Validators.required ,
      ]] ,
      numero_cuotas : [{ value : 0, disabled : false },[
        Validators.required ,
      ]] ,
      monto_cuota : [{ value : 0, disabled : false },[
        Validators.required ,
      ]] ,
      fecha_inicio : [{ value : moment(new Date()).endOf('month'), disabled : false },[
        Validators.required ,
      ]] ,
      tipo_pago : [{ value: this.data.tipo_pago, disabled : false },[
        Validators.required ,
      ]] ,
    })
  }

  private ListarTipoPago() {
    this._tipoPago.ListarTipoPago(1).subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  private ObtenerInformacion() {
    this.Cargando.next(true) ;

    this._evaluacion.ObtenerInformacion()
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      this.penalidad_porcentaje = res['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_porcentaje").valor;
      this.penalidad_maxima_cuota = res['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_cuota_maxima").valor;

      this.CalcularPenalidadInicial() ;
    })
  }

  private CalcularPenalidadInicial() {
    let total : number = this.data.monto_total ;
    let numero_cuotas : number = this.data.numero_cuotas ;

    let monto_penalidad : number = total * (100 + this.penalidad_porcentaje)/100 ;
    monto_penalidad = Math.round( monto_penalidad * 100 ) / 100 ;

    let numero_cuotas_penalidad : number = Math.ceil( monto_penalidad / this.penalidad_maxima_cuota ) ;
    
    // Se especifica que si el número de cuotas de la penalidad es mayor que el número original
    // se reduce en uno el número original. Este número debe ser como mínimo 1.
    if( numero_cuotas_penalidad >= numero_cuotas ) {
      numero_cuotas_penalidad = Math.max( numero_cuotas - 1 , 1 );
    }
    
    this.PenalidadForm.get('monto').setValue(monto_penalidad) ;
    this.PenalidadForm.get('numero_cuotas').setValue(numero_cuotas_penalidad) ;

    this.CalcularMontoCuota() ;
  }

  private CalcularMontoCuota() {
    let monto : number = this.PenalidadForm.get('monto').value ;
    let numero_cuotas : number = this.PenalidadForm.get('numero_cuotas').value ;

    let monto_cuotas_penalidad : number = ( monto / numero_cuotas ) ;
    monto_cuotas_penalidad = Math.round( monto_cuotas_penalidad *100 ) / 100 ;

    this.PenalidadForm.get('monto_cuota').setValue(monto_cuotas_penalidad) ;
  }

  Guardar() {
    this.Cargando.next(true) ;
    if ( this.data.id_credito ) {
      this._creditos.CrearPenalidad(
        this.data.id_credito ,
        this.PenalidadForm.get('monto_cuota').value ,
        this.PenalidadForm.get('numero_cuotas').value ,
        this.PenalidadForm.get('fecha_inicio').value ,
        this.PenalidadForm.get('tipo_pago').value ,
      )
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe( resultado =>{
        this.ventana.close(resultado) ;
      })
    }

    if ( this.data.id_venta ) {
      this._ventas.CrearPenalidad(
        this.data.id_venta ,
        this.PenalidadForm.get('monto_cuota').value ,
        this.PenalidadForm.get('numero_cuotas').value ,
        this.PenalidadForm.get('fecha_inicio').value ,
        this.PenalidadForm.get('tipo_pago').value ,
      )
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe( resultado =>{
        this.ventana.close(resultado) ;
      })
    }
  }
}
