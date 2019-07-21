import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ClienteService} from '../clientes/clientes.service';
import {MatStepper} from '@angular/material';
import {BehaviorSubject, merge, fromEvent} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EvaluacionService} from './evaluacion.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreditosService } from '../creditos/creditos.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css'], 
  providers: [ ClienteService , CreditosService ]
})

export class EvaluacionComponent implements OnInit {

  @ViewChild(MatStepper) stepper: MatStepper;
  public Cargando = new BehaviorSubject<boolean>(false);
  public EvaluacionForm : FormGroup;
  public cliente_encontrado : number;

  public datos_prestamo = new BehaviorSubject<any>({
    interes: 0.15,
    aporte: 20,
    capacidad:270
  })

  public interes:number;
  public aporte:number;
  public cliente_afiliado : boolean ;

  public dni:string;
  public cliente_nombre:string;
  public cliente:any;
  public fecha: string;
  public montos_anteriores = new BehaviorSubject<any>([]);
  public seleccion: boolean;
  public tipo_venta:number;
  public fecha_inicio = moment(new Date()).add(1, 'months');
  public capital:number;
  public total_pagar:number;
  public cuotas:number;
  public total_prestamo:number;
  public cronograma:Array<any>;
  public productos:Array<any>;
  public informacion = new BehaviorSubject<any>([]);

  @ViewChild('InputDNI') FiltroDNI : ElementRef;

  constructor(
    private Servicio: EvaluacionService ,
    private CrServicios : CreditosService ,
    private CServicios: ClienteService ,
    private Buidler : FormBuilder,
  ) { }

  ngOnInit() {
    this.interes=0.15;
    this.aporte=20;
    this.dni="";
    this.seleccion=false;
    this.cliente_encontrado=3;
    this.cliente_afiliado=false;
    this.CrearFormulario();
  }

  CrearFormulario(){
    this.EvaluacionForm = this.Buidler.group({
      id: [ { value : null , disabled : false },[
      ]],
      dni: [ { value : null , disabled : false },[
        Validators.maxLength(8),
        Validators.minLength(8)
      ]],
      nombre: [ { value : null , disabled : true },[
      ]],
      codigo: [ { value : null , disabled : true },[
      ]],
      cargo: [ { value : null , disabled : true },[
      ]],
      sede: [ { value : null , disabled : true },[
      ]],

    })
  }

  BuscarCliente(){
    this.Cargando.next(true);
    this.CServicios.BuscarClienteDNI(this.FiltroDNI.nativeElement.value).subscribe(res=>{
      this.Cargando.next(false);
      if(res['codigo']==0){
        this.cliente_encontrado=1;
        this.VerificarCondiciones(res['data'].id)
        this.EvaluacionForm.get('id').setValue(res['data'].id);
        this.EvaluacionForm.get('nombre').enable();
        this.EvaluacionForm.get('codigo').enable();
        this.EvaluacionForm.get('cargo').enable();
        this.EvaluacionForm.get('sede').enable();
        this.EvaluacionForm.get('nombre').setValue(res['data'].nombre);
        this.EvaluacionForm.get('codigo').setValue(res['data'].codigo);
        this.EvaluacionForm.get('cargo').setValue(res['data'].cargo_nombre);
        this.EvaluacionForm.get('sede').setValue(res['data'].sede);
        this.cliente=res['data'];
      } else {
        this.cliente_encontrado=2;
        this.cliente=[];
      }
      this.ActualizarInformacion();
    })
  }

  VerificarCondiciones(id){
    this.CrServicios.Verificar_Afiliacion(id).subscribe(res=>{
      // Si está afiliado, se verifica el interés que debería pagar y el aporte se considera 0
      if(res['codigo_afiliacion']) {
        this.cliente_afiliado=true;
        this.CrServicios.Verificar_Interes(res['total_pagado']).subscribe(res=>{
          this.aporte=0;
          this.interes= res / 100;
          this.ActualizarInformacion();
        })
      } else {
      // Si no está afiliado, se verifica el interés inicial y el aporte también es el estándar
        this.cliente_afiliado=false;
        this.CrServicios.SeleccionarParametros().subscribe(res=>{
          this.aporte=res.monto;
          this.ActualizarInformacion();
        });
        this.CrServicios.Verificar_Interes(0).subscribe(res=>{
          this.interes= res / 100;
          this.ActualizarInformacion();
        })
      }
    })
  }

  RemoverCliente(){
    this.cliente_encontrado=3;
    this.EvaluacionForm.get('id').setValue(null);
    this.EvaluacionForm.get('nombre').disable();
    this.EvaluacionForm.get('codigo').enable();
    this.EvaluacionForm.get('cargo').disable();
    this.EvaluacionForm.get('sede').disable();
    this.EvaluacionForm.get('dni').setValue("");
    this.EvaluacionForm.get('nombre').setValue(null);
    this.EvaluacionForm.get('codigo').setValue(null);
    this.EvaluacionForm.get('cargo').setValue(null);
    this.EvaluacionForm.get('sede').setValue(null);
  }

  DefinirCapacidad(evento){
    this.datos_prestamo.next({
      interes:this.interes,
      aporte:this.aporte,
      capacidad:evento
    });
    this.ActualizarInformacion();
  }

  InformacionPrestamo(evento){
    this.tipo_venta=evento.tipo;
    this.capital=evento.capital;
    this.total_pagar=evento.total;
    this.fecha= evento.fecha,
    this.fecha_inicio=evento.fecha_inicio;
    this.productos=evento.productos;
    this.cuotas=evento.cuotas;
    this.total_prestamo=evento.total;
    this.cronograma=evento.cronograma;
    this.ActualizarInformacion();
  }

  ActualizarInformacion(){
    this.informacion.next({
      afiliado: this.cliente_afiliado,
      cliente: this.cliente,
      interes: this.interes,
      aporte: this.aporte,
      venta: this.tipo_venta,
      fecha: this.fecha,
      fecha_inicio: this.fecha_inicio,
      capital: this.capital,
      cuotas: this.cuotas,
      total: this.total_prestamo,
      cronograma: this.cronograma,
      productos: this.productos,
    })
  }

  NuevaEvaluacion(){
    this.stepper.selectedIndex=0;
    this.cliente=null;
    this.interes=0.15;
    this.aporte=20;
    this.dni="";
    this.cliente_nombre="";
    this.seleccion=false;
    this.datos_prestamo.next({
      interes:this.interes,
      aporte:this.aporte,
      capacidad:270
    });
    this.montos_anteriores.next(null);
    this.RemoverCliente();
  }

  ActualizarCliente(){
    console.log(2);
    this.BuscarCliente();
  }

}
