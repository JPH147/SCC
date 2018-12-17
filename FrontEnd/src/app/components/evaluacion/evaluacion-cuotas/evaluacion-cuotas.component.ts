// Proyecto

import { Component, OnInit, Input,AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
  selector: 'app-evaluacion-cuotas',
  templateUrl: './evaluacion-cuotas.component.html',
  styleUrls: ['./evaluacion-cuotas.component.css']
})
export class EvaluacionCuotasComponent implements OnInit {

  @Input() datos: BehaviorSubject<any>;
  public interes:number;
  public aporte:number;
  public capacidad:number;
  public capital: number;
  public cuotas: number;
  public prestamo: number;
  public fecha_inicio:Date;
  public cronograma:Array<Cronograma>=[];
  public monto_mayor:boolean;

  @ViewChild('InputCapital') FiltroCapital:ElementRef;
  @ViewChild('InputCuotas') FiltroCuotas:ElementRef;

  EvaluacionCuotas: EvaluacionCoutasDataSource;
  Columnas: string[] = ['numero','monto','aporte','fecha','total']

  constructor() { }

  ngOnInit() {
    this.cuotas=12;
    this.fecha_inicio=new Date();
    this.monto_mayor=false;
    this.EvaluacionCuotas = new EvaluacionCoutasDataSource();
    this.CalcularPrimerPago();
    this.datos.subscribe(res=>{
      this.monto_mayor=false;
      this.aporte=res.aporte;
      this.interes=res.interes;
      this.capacidad=res.capacidad;
      this.CalcularPrimerPago();
    })
  }

  ngAfterViewInit(){
    
    merge(
      fromEvent(this.FiltroCapital.nativeElement,'keyup'),
      fromEvent(this.FiltroCuotas.nativeElement,'keyup'),
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.CalcularPagos()
      })
    ).subscribe()
  }

  CalcularPagos(){
    this.prestamo=this.capital*(1+this.cuotas*this.interes);
    this.cronograma=[];
    let fecha:Date;
    for(let i=1; i<=this.cuotas ;i++){
      // console.log(i)
      fecha=new Date(this.fecha_inicio.valueOf() + 1000*60*60*24*30*i);
      this.cronograma.push({
        numero:i,
        monto:this.prestamo/this.cuotas,
        aporte:this.aporte,
        fecha:fecha,
        total:(this.prestamo/this.cuotas)+this.aporte
      })
    }
    this.EvaluacionCuotas.CargarInformacion(this.cronograma);
    this.EvaluarMonto()
  }

  CalcularPrimerPago(){
    let fecha:Date;
<<<<<<< HEAD
    for(let i=1; i==12;i++){
=======
    this.cronograma=[];
    for(let i=1; i<=this.cuotas ;i++){
      // console.log(i)
>>>>>>> 34bca23816ba56be0ed6eee9f2befcbfa959b2b1
      fecha=new Date(this.fecha_inicio.valueOf() + 1000*60*60*24*30*i);
      this.cronograma.push({
        numero:i,
        monto:this.capacidad-this.aporte,
        aporte:this.aporte,
        fecha:fecha,
        total:this.capacidad
      })
    }
    // console.log(this.cronograma, this.prestamo,this.capital)
    this.CalcularPrimerosTotales();
    this.EvaluacionCuotas.CargarInformacion(this.cronograma);
  }

  CalcularPrimerosTotales(){
    this.prestamo=0;
    this.cronograma.forEach((item)=>{
      this.prestamo=this.prestamo+item.monto;
    })
    this.prestamo=Math.round(this.prestamo)*100/100;
    this.capital=Math.round(this.prestamo/(1+this.cuotas*this.interes))*100/100;
  }

  EvaluarMonto(){
    if(this.cronograma[0].total>this.capacidad){
      this.monto_mayor=true;
    }else{
      this.monto_mayor=false
    }
  }

}

export class EvaluacionCoutasDataSource {

  public Cuotas= new BehaviorSubject<any>([]);
  // public Cargando= new BehaviorSubject<boolean>(false);

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.Cuotas.asObservable();
  }
  
  disconnect() {
    this.Cuotas.complete();
    // this.Cargando.complete()
  }
  
  CargarInformacion(cuotas){
    // this.Cargando.next(true)
    this.Cuotas.next(cuotas)
  }
}

export interface Cronograma{
  numero:number,
  monto:number,
  aporte:number,
  fecha: Date,
  total:number
}