import { Component, OnInit, Input,AfterViewInit,ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material';
import {AgregarProductoComponent} from '../agregar-producto/agregar-producto.component';
import * as moment from 'moment';

@Component({
  selector: 'app-evaluacion-cuotas',
  templateUrl: './evaluacion-cuotas.component.html',
  styleUrls: ['./evaluacion-cuotas.component.css']
})
export class EvaluacionCuotasComponent implements OnInit {

  @Input() datos: BehaviorSubject<any>;
  @Output() informacion = new EventEmitter();
  public interes:number;
  public aporte:number;
  public capacidad:number;
  public capital: number;
  public cuotas: number;
  public prestamo: number;
  public fecha_inicio:Date;
  public cronograma:Array<Cronograma>=[];
  public monto_mayor:boolean;
  public tipo: number;
  public pago_inicio_mes: boolean;
  public Productos:Array<any>=[];

  @ViewChild('InputCapital') FiltroCapital:ElementRef;
  @ViewChild('InputCuotas') FiltroCuotas:ElementRef;

  EvaluacionCuotas: EvaluacionCoutasDataSource;
  Columnas: string[] = ['numero','monto','aporte','fecha','total']

  constructor(
    private Dialogo: MatDialog,
  ) { }

  ngOnInit() {
    this.tipo=1;
    this.cuotas=12;
    this.fecha_inicio=new Date();
    this.monto_mayor=false;
    this.pago_inicio_mes=true;
    this.EvaluacionCuotas = new EvaluacionCoutasDataSource();
    this.CalcularPrimerPago();
    this.datos.subscribe(res=>{
      this.monto_mayor=false;
      this.aporte=res.aporte;
      this.interes=res.interes;
      this.capacidad=res.capacidad;
      this.CalcularPrimerPago();
      this.informacion.emit({tipo: this.tipo, capital: this.capital,total: this.prestamo, cuotas:this.cuotas,cronograma:this.cronograma,productos: this.Productos})
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

  CambioFecha(){
    this.CalcularPagos();
  }

  CambioModoPago(){
    // console.log(this.pago_inicio_mes)
    // console.log(moment(this.fecha_inicio).daysInMonth())
    this.CalcularPagos();
  }

  CalcularPagos(){

    this.cronograma=[];
    let fecha:Date;

    let interes_mes_actual=Math.round((this.capital*this.interes)*(1-(moment(this.fecha_inicio).date()/moment(this.fecha_inicio).daysInMonth()))*100)/100;

    if (!this.pago_inicio_mes) {
      this.cronograma.push({
        numero:0,
        monto: interes_mes_actual,
        aporte: this.tipo==1 ? this.aporte : 0,
        fecha: this.fecha_inicio,
        total: interes_mes_actual+(this.tipo==1 ? this.aporte : 0)
      })
    }

    for(let i=1; i<=this.cuotas ;i++){
      fecha = new Date(this.fecha_inicio.valueOf() + 1000*60*60*24*30*i);
      this.cronograma.push({
        numero:i,
        monto: this.prestamo/this.cuotas + ((this.pago_inicio_mes && i==1) ? interes_mes_actual : 0),
        aporte:this.tipo==1 ? this.aporte : 0,
        fecha:fecha,
        total: (this.prestamo/this.cuotas) + ((this.pago_inicio_mes  && i==1 ) ? interes_mes_actual : 0) + (this.tipo==1 ? this.aporte : 0)
      })
    }

    this.prestamo=Math.round(this.capital*(1+this.cuotas*this.interes)*100)/100+(!this.pago_inicio_mes ? interes_mes_actual : 0);

    this.EvaluacionCuotas.CargarInformacion(this.cronograma);
    this.EvaluarMonto()
  }

  CalcularPrimerPago(){
    let fecha:Date;

    let interes_mes_actual=(this.capital*this.interes)*(1-(moment(this.fecha_inicio).date()/moment(this.fecha_inicio).daysInMonth()));

    this.cronograma=[];

    for(let i=1; i<=this.cuotas ;i++){
      // console.log(i)
      fecha=new Date(this.fecha_inicio.valueOf() + 1000*60*60*24*30*i);
      this.cronograma.push({
        numero:i,
        monto: this.capacidad ? (this.capacidad-this.aporte) : 480,
        aporte:this.tipo==1 ? this.aporte : 0,
        fecha:fecha,
        total: this.capacidad ? this.capacidad : 500
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
    this.prestamo=Math.round(this.prestamo*100)/100;
    this.capital=Math.round(this.prestamo/(1+this.cuotas*this.interes)*100)/100;
  }

  EvaluarMonto(){
    if(this.cronograma[0].total>this.capacidad){
      this.monto_mayor=true;
    }else{
      this.monto_mayor=false
    }
    this.informacion.emit({tipo: this.tipo, capital: this.capital,total: this.prestamo, fecha_inicio: this.fecha_inicio, cuotas:this.cuotas,cronograma:this.cronograma,productos: this.Productos})
  }

  CambioTipoVenta(){
    if (this.tipo==1) {
      this.cronograma.forEach((item)=>{
        item.aporte=this.aporte;
        item.monto=item.total-this.aporte;
      })
    }
    if (this.tipo==2) {
      this.cronograma.forEach((item)=>{
        item.aporte=0;
        item.monto=item.total;
      })
    }
    this.CalcularTotales()
  }

  CalcularTotales(){
    this.prestamo=0;
    this.cronograma.forEach((item)=>{
      this.prestamo+=item.monto
    });
    this.capital=Math.round(this.prestamo/(1+this.cuotas*this.interes)*100)/100;
    this.EvaluarMonto()
  }

  AgregarProducto(){
    
    let Ventana = this.Dialogo.open(AgregarProductoComponent,{
      width: '1200px',
      data: {capital: this.capital, productos: this.Productos}
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Productos=res[0];
        this.capital=res[1];
        this.CalcularPagos();
      }
    })

  }

}

export class EvaluacionCoutasDataSource {

  public Cuotas= new BehaviorSubject<any>([]);

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