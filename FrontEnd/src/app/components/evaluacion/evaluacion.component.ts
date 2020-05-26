import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {ClienteService} from '../clientes/clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import {BehaviorSubject, merge, fromEvent} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EvaluacionService} from './evaluacion.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreditosService } from '../creditos/creditos.service';
import { VentanaEmergenteProvisionalClientes } from '../clientes/ventana-emergente-provisional/ventanaemergenteprovisional' ;
import { SeleccionarClienteComponent } from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css'], 
  providers: [ ClienteService , CreditosService ]
})

export class EvaluacionComponent implements OnInit, AfterViewInit {

  @ViewChild(MatStepper, { static: true }) stepper: MatStepper;
  @ViewChild('InputInteres', { static: true }) FiltroInteres : ElementRef ;
  @ViewChild('InputCliente') FiltroCliente : ElementRef;

  @ViewChild('InputDNI') FiltroDNI : ElementRef;

  public Cargando = new BehaviorSubject<boolean>(false);
  public EvaluacionForm : FormGroup;
  public cliente_encontrado : number;

  public datos_prestamo = new BehaviorSubject<any>({
    interes: 15,
    aporte: 20,
    capacidad:270
  });

  public capacidad : number;
  public interes:number;
  public aporte:number;
  public cliente_afiliado : boolean ;
  public cliente_provisional : boolean ;

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
  public OtrosPagos : Array<any> = [];

  public id_presupuesto : number ;
  public presupuesto_antiguo : boolean = false ;

  constructor(
    private Servicio: EvaluacionService ,
    private CrServicios : CreditosService ,
    private CServicios: ClienteService ,
    private Buidler : FormBuilder,
    private Dialogo : MatDialog,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    this.interes=15;
    this.aporte=20;
    this.capacidad=270;
    this.dni="";
    this.seleccion=false;
    this.cliente_encontrado=3;
    this.cliente_afiliado=false;
    this.CrearFormulario();

    this.route.params.subscribe(params => {
      // Verifica si 'params' tiene datos
      if(Object.keys(params).length>0){
        if(params['idpresupuesto']){
          this.id_presupuesto=params['idpresupuesto'];
          // this.id_presupuesto=94;
          this.SeleccionarPresupuesto();
        }
      }
    })

  }

  ngAfterViewInit(){
    fromEvent(this.FiltroInteres.nativeElement, 'keyup')
    .pipe(
      distinctUntilChanged(),
      debounceTime(200),
      tap(()=>{
        // console.log(this.interes)
        this.ActualizarInformacion();
        this.ActualizarInformacionCuotas();
      })
    ).subscribe()
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

  SeleccionarPresupuesto(){
    this.presupuesto_antiguo = true ;
    this.CrServicios.SeleccionarPresupuesto(this.id_presupuesto).subscribe(resultado=>{

      if(resultado){

        let dni : string = resultado.cliente_dni;
        let dni_longitud : number = (resultado.cliente_dni).toString().length;

        for(let i = dni_longitud; i<8 ; i++){
          dni = "0" + dni ;
        }

        this.EvaluacionForm.get('dni').setValue(dni);
        this.CServicios.BuscarClienteDNI(dni).subscribe(res=>{
          this.Cargando.next(false);
          if(res['codigo']==0){
            this.cliente_encontrado=1;
            this.VerificarCondiciones(res['data'].id);
            this.ConsultarOtrosPagos(res['data'].id);
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

            this.interes=resultado.tasa;
            this.cliente_afiliado = true ;
            this.fecha = resultado.fecha ;
            this.capital = resultado.capital ;
            this.cuotas = resultado.cuotas ;
            this.total_prestamo = resultado.total ;
            this.cronograma = resultado.cronograma ;
            this.productos = resultado.productos ;
            this.tipo_venta = resultado.id_tipo ;
            this.ActualizarInformacion() ;
            this.datos_prestamo.next({
              presupuesto_antiguo : this.presupuesto_antiguo ,
              interes:this.interes,
              aporte:this.aporte,
              capacidad: this.capacidad,
              otros_pagos : this.OtrosPagos,
              capital : this.capital ,
              cuotas : this.cuotas ,
              prestamo : this.total_prestamo ,
              tipo : this.tipo_venta ,
              cronograma : this.cronograma 
            });
          }
        })
      }
    })
  }

  BuscarCliente(){
    this.Cargando.next(true);
    this.CServicios.BuscarClienteDNI(this.FiltroDNI.nativeElement.value).subscribe(res=>{
      this.cliente_provisional=false;
      this.Cargando.next(false);
      if(res['codigo']==0){
        this.cliente_encontrado=1;
        this.capacidad=0;
        this.VerificarCondiciones(res['data'].id);
        this.ConsultarOtrosPagos(res['data'].id);
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
          this.interes= res ;
          this.ActualizarInformacion();
        })
      } else {
      // Si no está afiliado, se verifica el interés inicial y el aporte también es el estándar
        this.cliente_afiliado=false;
        this.CrServicios.SeleccionarParametros().subscribe(res=>{
          this.aporte=res.monto;
          this.ActualizarInformacion();
        })
        this.CrServicios.Verificar_Interes(0).subscribe(res=>{
          this.interes= res ;
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
    this.capacidad = evento ;
    this.datos_prestamo.next({
      interes:this.interes,
      aporte:this.aporte,
      capacidad:this.capacidad
    });
    this.ActualizarInformacion();
  }

  InformacionPrestamo(evento){
    // console.log("Entrada",evento.cronograma);
    this.tipo_venta=evento.tipo;
    this.interes=evento.interes;
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
      afiliado: this.cliente_afiliado,//
      cliente: this.cliente,//
      interes: this.interes,//
      aporte: this.aporte,//
      venta: this.tipo_venta,//
      fecha: this.fecha,//
      fecha_inicio: this.fecha_inicio,
      capital: this.capital,//
      cuotas: this.cuotas,//
      total: this.total_prestamo,//
      cronograma: this.cronograma,//
      productos: this.productos,//
      otros_pagos : this.OtrosPagos
    })
    // console.log("Salida",this.cronograma);
  }

  NuevaEvaluacion(){
    this.stepper.selectedIndex=0;
    this.cliente=null;
    this.interes=15;
    this.aporte=20;
    this.dni="";
    this.cliente_nombre="";
    this.seleccion=false;
    this.datos_prestamo.next({
      interes:this.interes,
      aporte:this.aporte,
      capacidad:this.capacidad,
      otros_pagos : this.OtrosPagos
    });
    this.montos_anteriores.next(null);
    this.RemoverCliente();
  }

  ActualizarCliente(){
    if(this.cliente_provisional){
      this.CServicios.Seleccionar(this.EvaluacionForm.value.id).subscribe(res=>{
        this.Cargando.next(false);
        if(res){
          this.cliente_encontrado=1;
          this.VerificarCondiciones(res.id);
          this.EvaluacionForm.get("dni").setValue(res.dni)
          this.EvaluacionForm.get('id').setValue(res.id);
          this.EvaluacionForm.get('nombre').enable();
          this.EvaluacionForm.get('codigo').enable();
          this.EvaluacionForm.get('cargo').enable();
          this.EvaluacionForm.get('sede').enable();
          this.EvaluacionForm.get('nombre').setValue(res.nombre);
          this.EvaluacionForm.get('codigo').setValue(res.codigo);
          this.EvaluacionForm.get('cargo').setValue(res.cargo);
          this.EvaluacionForm.get('sede').setValue(res.sede_nombre);
          this.cliente=res;
        } else {
          this.cliente_encontrado=2;
          this.cliente=[];
        }
        this.ActualizarInformacion();
      })
    } else {
      this.BuscarCliente();
    }
  }

  AgregarCliente(){
    let Ventana = this.Dialogo.open( VentanaEmergenteProvisionalClientes , {
      width: '1000px',
    } )

    Ventana.afterClosed().subscribe(resultado=>{
      if(resultado){
        this.cliente_provisional=true;
        this.CServicios.Seleccionar(resultado).subscribe(res=>{
          this.Cargando.next(false);
          if(res){
            this.cliente_encontrado=1;
            this.VerificarCondiciones(res.id);
            this.EvaluacionForm.get("dni").setValue(res.dni)
            this.EvaluacionForm.get('id').setValue(res.id);
            this.EvaluacionForm.get('nombre').enable();
            this.EvaluacionForm.get('codigo').enable();
            this.EvaluacionForm.get('cargo').enable();
            this.EvaluacionForm.get('sede').enable();
            this.EvaluacionForm.get('nombre').setValue(res.nombre);
            this.EvaluacionForm.get('codigo').setValue(res.codigo);
            this.EvaluacionForm.get('cargo').setValue(res.cargo);
            this.EvaluacionForm.get('sede').setValue(res.sede_nombre);
            this.cliente=res;
          } else {
            this.cliente_encontrado=2;
            this.cliente=[];
          }
          this.ActualizarInformacion();
        })
      }
    })

  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){

        let dni : string = res.dni;
        let dni_longitud : number = (res.dni).toString().length;
        // console.log(dni_longitud, dni)
        for(let i = dni_longitud; i<8 ; i++){
          // console.log(dni_longitud, dni)
          dni = "0" + dni ;
        }
        // console.log(dni);
        this.EvaluacionForm.get('dni').setValue(dni);
        this.CServicios.BuscarClienteDNI(dni).subscribe(res=>{
          this.Cargando.next(false);
          if(res['codigo']==0){
            this.cliente_encontrado=1;
            this.VerificarCondiciones(res['data'].id);
            this.ConsultarOtrosPagos(res['data'].id);
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
    })
  }

  ActualizarInformacionCuotas(){
    this.datos_prestamo.next({
      presupuesto_antiguo : this.presupuesto_antiguo ,
      interes:this.interes,
      aporte:this.aporte,
      capacidad: this.capacidad,
      otros_pagos : this.OtrosPagos,
      capital : this.capital ,
      cuotas : this.cuotas ,
      prestamo : this.total_prestamo ,
      tipo : this.tipo_venta ,
      cronograma : this.cronograma 
    });
  }

  ConsultarOtrosPagos(id_cliente){
    this.CrServicios.ListarCronogramaxCliente(id_cliente).subscribe(res=>{
      this.OtrosPagos = res['data'] ;
      this.ActualizarInformacionCuotas();
    })
  }

}
