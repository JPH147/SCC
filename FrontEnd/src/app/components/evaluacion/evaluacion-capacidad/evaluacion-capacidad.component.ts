import { Component, OnInit, Output,EventEmitter,ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import {fromEvent, merge} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from'rxjs/operators';


@Component({
  selector: 'app-evaluacion-capacidad',
  templateUrl: './evaluacion-capacidad.component.html',
  styleUrls: ['./evaluacion-capacidad.component.css']
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

  @Output() capacidad = new EventEmitter();
  @ViewChild('InputSueldo') FiltroSueldo: ElementRef;
  @ViewChildren('InputDescuento') FiltroDescuento: QueryList<any>;

  constructor() { }

  ngOnInit() {
  
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

  this.FiltroDescuento.changes.subscribe(res=>{
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
  })

  }

  AgregarDescuentoOficial(){
    this.descuento_oficial.push({descuento:null})
  }

  AgregarDescuentoPersonal(){
    this.descuento_personal.push({descuento:null})
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

}