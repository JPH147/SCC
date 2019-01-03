import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ClienteService} from '../clientes/clientes.service';
import {MatStepper} from '@angular/material';
import {BehaviorSubject, merge, fromEvent} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EvaluacionService} from './evaluacion.service';
import * as moment from 'moment';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css'], 
  providers: [ClienteService]
})

export class EvaluacionComponent implements OnInit {

  @ViewChild(MatStepper) stepper: MatStepper;

  public datos_prestamo = new BehaviorSubject<any>({
    interes: 0.15,
    aporte: 20,
    capacidad:500
  })

  public interes:number;
  public aporte:number;

  public dni:string;
  public nombre:string;
  public Clientes: Array<any>;
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
  @ViewChild('InputNombre') FiltroNombre : ElementRef;

  constructor(
    private Servicio: EvaluacionService,
    private CServicios: ClienteService,
  ) { }

  ngOnInit() {
    this.interes=0.15;
    this.aporte=20;
    this.dni="";
    this.nombre="";
    this.seleccion=false;
    this.BuscarCliente();

  }

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroDNI.nativeElement,'keyup'),
      fromEvent(this.FiltroNombre.nativeElement,'keyup'),
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.BuscarCliente();
      })
    ).subscribe()

  }

  DisplayDNI(cliente): string | undefined {
    return cliente ? cliente.dni : ''
  }

  DisplayNombre(cliente): string | undefined {
    return cliente ? cliente.nombre : ''
  }

  ClienteSeleccionado(numero,evento){

    this.cliente=evento.option.value;
    this.ActualizarInformacion();
    this.seleccion=true;
    // console.log(this.cliente);
    this.Servicio.ConsultarCapacidad(this.cliente.id).subscribe(res=>{
      if (res) {
        this.fecha=moment(res.montos[0].fecha,"YYYY-MM-DD").format("DD/MM/YYYY");
        this.montos_anteriores.next(res.montos);
      }
    })

    if (numero==1) {
      this.nombre=evento.option.value
    }
    if (numero==2) {
      this.dni=evento.option.value
    }
  }

  BuscarCliente(){
    this.CServicios.BuscarCliente(this.dni,this.nombre).subscribe(res=>{
      this.Clientes=res;
    })
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
    this.fecha_inicio=evento.fecha_inicio;
    this.productos=evento.productos;
    this.cuotas=evento.cuotas;
    this.total_prestamo=evento.total;
    this.cronograma=evento.cronograma;
    this.ActualizarInformacion();
  }

  ActualizarInformacion(){
    this.informacion.next({
      cliente: this.cliente,
      interes: this.interes,
      aporte: this.aporte,
      venta: this.tipo_venta,
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
    this.nombre="";
    this.seleccion=false;
    this.datos_prestamo.next({
      interes:this.interes,
      aporte:this.aporte,
      capacidad:500
    });
    this.montos_anteriores.next(null)
  }

}
