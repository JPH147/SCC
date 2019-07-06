import { Component, OnInit, Input, Output,EventEmitter,ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import {fromEvent, merge} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from'rxjs/operators';
import {EvaluacionService} from '../evaluacion.service';
import {Notificaciones} from '../../global/notificacion';

@Component({
  selector: 'app-evaluacion-capacidad',
  templateUrl: './evaluacion-capacidad.component.html',
  styleUrls: ['./evaluacion-capacidad.component.css'],
  providers: [EvaluacionService,Notificaciones]
})
export class EvaluacionCapacidadComponent implements OnInit {

  public sueldo_bruto: number;
  public total_descuento_oficial: number;
  public sueldo_base: number;
  public sueldo_disponible:number;
  public total_descuento_personal:number;
  public capacidad_pago:number;
  public descuento_oficial: Array<any>=[];
  public descuento_personal:Array<any>=[];
  public alto: number;

  @Input() cliente: any;
  @Input() montos: any;
  @Output() capacidad = new EventEmitter();
  @ViewChild('InputSueldo') FiltroSueldo: ElementRef;
  @ViewChildren('InputDescuento') FiltroDescuento: QueryList<any>;

  constructor(
    private Servicio: EvaluacionService,
    private Notificacion: Notificaciones,
  ) { }

  ngOnInit() {
    this.alto=450;
    this.descuento_oficial.push({descuento:null}, {descuento:null}, {descuento:null})
    this.descuento_personal.push({descuento:null}, {descuento:null}, {descuento:null})
  }

  ngAfterViewInit(){

    fromEvent(this.FiltroSueldo.nativeElement,'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.CalcularTotales()
      })
    ).subscribe()

    for (let i in this.FiltroDescuento['_results']) {
      fromEvent(this.FiltroDescuento['_results'][i].nativeElement,'keyup')
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          this.CalcularTotales()
        })
      ).subscribe()
    }

    this.FiltroDescuento.changes.subscribe(res=>{
      for (let i in this.FiltroDescuento['_results']) {
        fromEvent(this.FiltroDescuento['_results'][i].nativeElement,'keyup')
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          tap(()=>{
            this.CalcularTotales();
          })
        ).subscribe()
      }
    })

    this.montos.subscribe(res=>{
      if (res && res.length>0) {
        this.descuento_oficial=[];
        this.descuento_personal=[];
        res.forEach((item)=>{
          if (item.tipo==1) {
            this.sueldo_bruto=item.monto;
          }
          if (item.tipo==2) {
            this.descuento_oficial.push({descuento:item.monto});
          }
          if (item.tipo==3) {
            this.descuento_personal.push({descuento:item.monto});
          }
        })
        this.CalcularAlto();
        this.CalcularTotales();
      }
      if (res===null) {
        this.Resetear();
      }
    })

  }

  AgregarDescuentoOficial(){
    this.descuento_oficial.push({descuento:null});
    this.CalcularAlto()
  }

  AgregarDescuentoPersonal(){
    this.descuento_personal.push({descuento:null});
    this.CalcularAlto()
  }
  
  CalcularAlto(){
    this.alto=Math.max(this.alto,this.descuento_oficial.length*68,this.descuento_personal.length*68);
  }

  CalcularDescuentoTotal(){
    this.total_descuento_oficial=0;
    this.total_descuento_personal=0;
    this.descuento_oficial.forEach((item)=>{
      this.total_descuento_oficial=this.total_descuento_oficial+item.descuento*1
    })
    this.descuento_personal.forEach((item)=>{
      this.total_descuento_personal=this.total_descuento_personal+item.descuento*1
    })
  }

  CalcularTotales(){

    this.CalcularDescuentoTotal()

    this.sueldo_base=0;
    this.sueldo_disponible=0;
    this.capacidad_pago=0;

    this.sueldo_base=this.sueldo_bruto-this.total_descuento_oficial;
    this.sueldo_disponible=this.sueldo_base*0.5;
    this.capacidad_pago=this.sueldo_disponible-this.total_descuento_personal;
    this.capacidad.emit(this.capacidad_pago);
  }

  Guardar(){
    this.Servicio.GuardarEvaluacion(
      this.cliente.id,
      this.sueldo_bruto,
      this.descuento_oficial,
      this.descuento_personal,
      new Date(),
    )
    this.Notificacion.Snack("Se grabaron los datos de la evluación","")
  }

  Resetear(){

    this.sueldo_bruto=null;
    this.sueldo_base=null;
    this.sueldo_disponible=null;
    this.capacidad_pago=null;
    this.total_descuento_oficial=null;
    this.total_descuento_personal=null;
    this.descuento_oficial=[];
    this.descuento_personal=[];

    this.alto=350;
    this.descuento_oficial.push({descuento:null}, {descuento:null}, {descuento:null})
    this.descuento_personal.push({descuento:null}, {descuento:null}, {descuento:null})
    this.capacidad.emit(null);
  }

}