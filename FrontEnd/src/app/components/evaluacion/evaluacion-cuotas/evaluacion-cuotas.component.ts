import { Component, OnInit, Input,AfterViewInit,ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {FormControl} from '@angular/forms';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material';
import {AgregarProductoComponent} from '../agregar-producto/agregar-producto.component';
import { ReglasEvaluacionService } from '../../tablas-maestras/reglas-evaluacion/reglas-evaluacion.service';
import * as moment from 'moment';

@Component({
  selector: 'app-evaluacion-cuotas',
  templateUrl: './evaluacion-cuotas.component.html',
  styleUrls: ['./evaluacion-cuotas.component.css'],
  providers: [ReglasEvaluacionService
  ],
})
export class EvaluacionCuotasComponent implements OnInit {

  @Input() datos: BehaviorSubject<any>;
  @Output() informacion = new EventEmitter();
  public interes:number;
  public aporte:number;
  public aporte_considerado:number;
  public capacidad:number;
  public capital: number;
  public cuotas: number;
  public prestamo: number;
  public fecha_inicio:Date;
  public fecha_prestamo:Date;
  public cronograma:Array<Cronograma>=[];
  public monto_mayor:boolean;
  public tipo: number;
  public pago_proximo_mes: boolean;
  public interes_por_dia: boolean;
  public Productos:Array<any>=[];
  public interes_diario: number;
  public Reglas: Array<any>;
  public correcto:boolean;
  public Hoy : Date = new Date();

  @ViewChild('InputCapital') FiltroCapital:ElementRef;
  @ViewChild('InputCuotas') FiltroCuotas:ElementRef;

  EvaluacionCuotas: EvaluacionCoutasDataSource;
  Columnas: string[] = ['numero','fecha','monto','aporte','total']

  constructor(
    private Dialogo: MatDialog,
    private RServicio: ReglasEvaluacionService
  ) { }

  ngOnInit() {
    this.tipo=1;
    this.cuotas=10;
    this.correcto=true;
    this.fecha_prestamo=new Date();
    this.fecha_inicio=moment(this.fecha_prestamo).add((1), 'months').toDate();
    this.monto_mayor=false;
    this.pago_proximo_mes=true;
    this.interes_por_dia=true;
    this.CalcularInteresDiario();
    this.EvaluacionCuotas = new EvaluacionCoutasDataSource();
    this.interes_diario=0;

    this.RServicio.ListarReglas().subscribe(res=>{
      this.Reglas=res;
      // this.EvaluarRegla();

      this.datos.subscribe(res=>{
        this.monto_mayor=false;
        this.aporte=res.aporte;
        this.aporte_considerado=res.aporte;
        this.interes=res.interes;
        this.capacidad=res.capacidad;
        this.CalcularPrimerPago();
        this.EmitirInformacion();
      })

    })
    // this.aporte_considerado=this.aporte;
  }

  ngAfterViewInit(){
    
    merge(
      fromEvent(this.FiltroCapital.nativeElement,'keyup'),
      fromEvent(this.FiltroCuotas.nativeElement,'keyup'),
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if ( Number.isInteger(this.capital) && Number.isInteger(this.cuotas) ) {
          this.correcto=true;
          this.CalcularPagos();
        }else{
          this.correcto=false;
        }
      })
    ).subscribe()
  }

  EmitirInformacion(){
    this.informacion.emit({
      tipo: this.tipo,
      fecha:this.fecha_prestamo,
      capital: this.capital,
      total: this.prestamo,
      cuotas:this.cuotas,
      cronograma:this.cronograma,
      productos: this.Productos,
    })
  }

  CambioFecha(){
    this.EvaluarRegla();
    this.CalcularPagos();
  }

  EvaluarRegla(){
    this.Reglas.forEach((item)=>{
      if (this.fecha_prestamo.getDate()>=item.desde && this.fecha_prestamo.getDate()<=item.hasta) {
        if (item.interes_diario==1) {
          this.CalcularInteresDiario();
          this.interes_por_dia=true;
        }else{
          this.interes_diario=0;
          this.interes_por_dia=false;
        }
        if (item.proximo_mes==1) {
          this.fecha_inicio=moment(this.fecha_prestamo).add((1), 'months').toDate();
          this.pago_proximo_mes=true;
        }else{
          this.fecha_inicio=this.fecha_prestamo;
          this.pago_proximo_mes=false;
        }
      }
    });
  }

  CambioModoPago(evento){
    this.pago_proximo_mes=evento.checked;
    if ( evento.checked ) {
      this.fecha_inicio=moment(this.fecha_prestamo).add((1), 'months').toDate();
      // this.CalcularPagos();
    } else {
      this.fecha_inicio=this.fecha_prestamo;
      // this.CalcularPagos();
    }
  }

  CambioInteresDiario(evento){
    this.interes_por_dia=evento.checked;
    if (this.interes_por_dia) {
      this.CalcularInteresDiario();
    }else{
      this.interes_diario=0;
    }
    this.CalcularPagos()
  }

  CambioTipoVenta(evento){
    if (evento.value==1) {
      this.aporte_considerado=this.aporte;
      this.Productos=[];
    }else{
      this.aporte_considerado=0;
    }
    this.CalcularPagos()
  }

  CalcularInteresDiario(){
    if (this.interes_por_dia) {
      let interes = this.capital*this.interes;
      this.interes_diario=Math.round( interes * (1-(moment(this.fecha_prestamo).date()/moment(this.fecha_prestamo).daysInMonth()) )*10)/10;
    } else {
      this.interes_diario=0;
    }
  }

  CalcularPagos(){

    this.EvaluarRegla();

    this.CalcularInteresDiario();
    // this.CambioModoPago()

    this.cronograma=[];

    let fecha:Date;
    let adicional:boolean=false;
    let j:number = 0;

    let interes_mensual=Math.round((this.capital*this.interes)*10)/10;
    let cuota=Math.round(((this.capital/this.cuotas)+interes_mensual)*10)/10;

    if ( this.pago_proximo_mes && this.interes_por_dia) {
      this.cronograma.push({
        numero:1,
        monto: this.interes_diario,
        aporte: 0,
        fecha_formato : moment(this.fecha_prestamo).format('LL') ,
        fecha: this.fecha_prestamo,
        total: this.interes_diario,
      });
      j=1;
    }

    for(let i=1; i<=this.cuotas ;i++){

      j=j+1;

      fecha = moment(this.fecha_inicio).add((j-1), 'months').toDate();

      this.cronograma.push({
        numero: j,
        monto: cuota + ( (!adicional && j==1) ? this.interes_diario : 0) ,
        aporte: this.aporte_considerado,
        fecha_formato : moment(this.fecha_prestamo).format('LL') ,
        fecha: fecha,
        total: cuota+this.aporte_considerado + ((!adicional && j==1) ? this.interes_diario : 0),
      })

    }

    this.prestamo=Math.round(this.capital+interes_mensual*this.cuotas)+this.interes_diario;

    this.EvaluacionCuotas.CargarInformacion(this.cronograma);

    this.EmitirInformacion()
  }

  EvaluarMonto(){
  //   if(this.cronograma[0].total>this.capacidad){
  //     this.monto_mayor=true;
  //   }else{
  //     this.monto_mayor=false;
  //   }
  //   this.informacion.emit({tipo: this.tipo, capital: this.capital,total: this.prestamo, fecha_prestamo: this.fecha_prestamo, cuotas:this.cuotas,cronograma:this.cronograma,productos: this.Productos});
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
      data: {capital: this.capital, productos: this.Productos, ocultar_almacen: true}
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Productos=res[0];
        this.capital=res[1];
        this.CalcularPagos();
      }
    })
  }

  CalcularPrimerPago(){

    this.capital=((this.capacidad-this.aporte)*this.cuotas)/(1+this.cuotas*this.interes);

    this.EvaluarRegla();

    this.prestamo=this.capital*(1+this.cuotas*this.interes)+this.interes_diario; // +this.interes_diario solo para pruebas

    let fecha:Date;
    let adicional: boolean = false;

    let cuota=this.capacidad-this.aporte;
    let j: number;

    this.cronograma=[];

    for(let i=1; i<=this.cuotas; i++){

      if (!this.pago_proximo_mes && this.interes_por_dia && i==1) {
        this.cronograma.push({
          numero:1,
          monto: this.interes_diario,
          aporte: 0,
          fecha_formato : moment(this.fecha_prestamo).format('LL') ,
          fecha: this.fecha_inicio,
          total: this.interes_diario,
        });
        adicional=true;
      }

      if (adicional) {
        j=i+1
      }else{
        j=i
      }
      
      fecha = moment(this.fecha_inicio).add((j-1), 'months').toDate();

      this.cronograma.push({
        numero: j,
        monto: cuota + ((!adicional && j==1) ? this.interes_diario : 0),
        aporte: this.aporte_considerado,
        fecha_formato : moment(this.fecha_prestamo).format('LL') ,
        fecha: fecha,
        total: cuota+this.aporte_considerado + ((!adicional && j==1) ? this.interes_diario : 0),
      })
    }
    
    this.CalcularPrimerosTotales();
    this.EvaluacionCuotas.CargarInformacion(this.cronograma);
  }

  CalcularPrimerosTotales(){
    // this.prestamo=0;
    // this.cronograma.forEach((item)=>{
    //   this.prestamo=this.prestamo+item.monto;
    // })

    // this.prestamo=Math.round(((this.capacidad-this.aporte)*this.cuotas)+this.interes_diario);

    // this.capital=Math.round(this.prestamo/(1+this.cuotas*this.interes)*100)/100;
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
  fecha_formato:string,
  fecha: Date,
  total:number
}
