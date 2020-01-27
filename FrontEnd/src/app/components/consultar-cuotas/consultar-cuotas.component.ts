import { Component, OnInit, Input,AfterViewInit,ViewChild, ElementRef, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {FormControl} from '@angular/forms';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ReglasEvaluacionService } from '../tablas-maestras/reglas-evaluacion/reglas-evaluacion.service';
import * as moment from 'moment';
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'app-consultar-cuotas',
  templateUrl: './consultar-cuotas.component.html',
  styleUrls: ['./consultar-cuotas.component.css']
})
export class ConsultarCuotasComponent implements OnInit {

  @Input() datos: BehaviorSubject<any>;
  @Output() informacion = new EventEmitter();
  public aporte:number;
  public aporte_considerado:number;
  public capacidad:number;
  public capital: number;
  public cuotas: number;
  public prestamo: number;
  public fecha_inicio:Date;
  public fecha_prestamo:Date;
  public cronograma:Array<any>=[];
  public monto_mayor:boolean;
  public tipo: number;
  public pago_proximo_mes: boolean;
  public interes_por_dia: boolean;
  public Productos:Array<any>=[];
  public interes_diario: number;
  public total_cronograma_editado : number ;
  public editar_cronograma : number;
  public diferencia : number ;
  public Reglas: Array<any>;
  public correcto:boolean;
  public Hoy : Date = new Date();
  public sucursal : number;
  public ProductosArray : Array<any>;
  public Sucursales : Array<any>;
  public OtrosPagos : Array<any> = [];
  public comodin : number = 0 ;
  public interes : number = 0 ;
  public interes_diario_deshabilitado : boolean = false ;

  @ViewChild('InputCapital', { static: true }) FiltroCapital:ElementRef;
  @ViewChild('InputCuotas', { static: true }) FiltroCuotas:ElementRef;
  @ViewChild('InputInteres', { static: true }) FiltroInteres:ElementRef;

  @ViewChildren('InputNumero') FiltroNumero: QueryList<any>;
  @ViewChildren('InputPrecio') FiltroPrecio: QueryList<any>;

  EvaluacionCuotas: EvaluacionCoutasDataSource;
  Columnas: string[] = ['numero','fecha','monto','aporte','total'] ;

  constructor(
    private Dialogo: MatDialog ,
    private changeDetector : ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.EvaluacionCuotas = new EvaluacionCoutasDataSource();
    this.CalcularInteresDiario();
    
    this.fecha_prestamo=new Date();
    this.fecha_inicio=moment(this.fecha_prestamo).add((1), 'months').toDate();
    this.CorregirFecha(this.fecha_inicio);

    this.tipo=1;
    this.monto_mayor=false;
    this.pago_proximo_mes=true;
    this.interes_por_dia=true;
    this.interes_diario=0;
    this.editar_cronograma = 3;
    
    this.aporte_considerado = 20 ;
    this.cuotas=10;
    this.capital=1000;
    this.interes = 15 ;
    this.CalcularPagos() ;
    this.correcto=true;
  }

  ngAfterViewInit(){
    
    merge(
      fromEvent(this.FiltroCapital.nativeElement,'keyup'),
      fromEvent(this.FiltroCuotas.nativeElement,'keyup'),
      fromEvent(this.FiltroInteres.nativeElement,'keyup'),
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
    ).subscribe();
  }

  // Esta función recibe una fecha y transforma el día en 27 XD!
  CorregirFecha(fecha : Date){
    let ano = moment( fecha ).year() ;
    let mes = moment( fecha ).month() ;
    this.fecha_inicio = new Date(ano, mes, 27) ;
  }

  EmitirInformacion(){
    this.informacion.emit({
      tipo: this.tipo,
      interes : this.interes,
      fecha:this.fecha_prestamo,
      capital: this.capital,
      total: this.prestamo,
      cuotas:this.cuotas,
      cronograma:this.cronograma,
      productos: this.Productos,
    })
  }

  CambioFecha(){
    
    let mes_inicio_pagos = moment(this.fecha_inicio).month() ;
    let mes_firma = moment(this.fecha_prestamo).month() ;
    
    if( mes_inicio_pagos == mes_firma ) {
      this.interes_diario_deshabilitado = true ;
      this.interes_por_dia = false ;
      this.CalcularInteresDiario() ;
    } else {
      this.EvaluarRegla();
      this.interes_diario_deshabilitado = false ;
    }

    this.CalcularPagos();
  }

  EvaluarRegla(){
    if(this.Reglas) {
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
            this.CorregirFecha(this.fecha_inicio);
            this.pago_proximo_mes=true;
          }else{
            this.fecha_inicio=this.fecha_prestamo;
            this.CorregirFecha(this.fecha_inicio);
            this.pago_proximo_mes=false;
          }
        }
      });
    }
  }

  CambioModoPago(evento){
    this.pago_proximo_mes=evento.checked;
    if ( evento.checked ) {
      this.fecha_inicio=moment(this.fecha_prestamo).add((1), 'months').toDate();
      this.CorregirFecha(this.fecha_inicio);
    } else {
      this.fecha_inicio=this.fecha_prestamo;
      this.CorregirFecha(this.fecha_inicio);
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
      this.interes_por_dia=false;
      this.interes=0;
    }
    this.changeDetector.detectChanges();
    this.CalcularPagos();
  }

  CalcularInteresDiario(){
    if (this.interes_por_dia) {
      let interes = this.capital*this.interes/100;
      this.interes_diario=Math.round( interes * (1-(moment(this.fecha_prestamo).date()/moment(this.fecha_prestamo).daysInMonth()) )*10)/10;
    } else {
      this.interes_diario=0;
    }
  }

  CalcularPagos(){

    let aporte : number ;
    if(this.interes==0) {
      aporte = 0;
    } else {
      aporte = this.aporte_considerado ;
    }

    this.cronograma=[];
    let i = 1;

    //Se calcula el monto total y el interés
    let interes : number =  Math.round(+this.capital * (this.interes /100 ) *100 ) / 100;
    let total : number = Math.round(+this.capital * ( 1 + +this.cuotas * this.interes / 100 ) *100 ) / 100

    // Se calculan las fechas de las cuotas
    let ano_pago = moment(this.fecha_inicio).year();
    let mes_pago = moment(this.fecha_inicio).month();
    let dia_pago = moment(this.fecha_inicio).date();
    let fecha_corregida : Date = new Date(ano_pago, mes_pago, dia_pago);
    let fecha : Date;

    // Se evalúa si el crédito se da antes o después de quincena
    let dia_credito :number = moment(this.fecha_prestamo).date();
    let mes_credito :number = moment(this.fecha_prestamo).month();
    let ano_credito :number = moment(this.fecha_prestamo).year();
    let dias_mes : number = moment(this.fecha_prestamo).daysInMonth();
    let interes_truncado = Math.round( ((dias_mes - dia_credito) / dias_mes) * interes * 100 ) / 100;

    let numero_cuotas = moment(this.fecha_inicio).diff(moment(this.fecha_prestamo), 'months') ;
    // Se reemplazó numero_cuotas por (mes_pago - mes_credito)

    // Si el crédito es antes de quincena, se paga a fin de mes los intereses truncados
    if( this.interes_por_dia ){
      let fecha_1 = moment(this.fecha_prestamo).endOf('month');
      this.cronograma.push({
        numero: 0,
        fecha: fecha_1,
        fecha_formato: moment(fecha).format('LL'),
        monto: interes_truncado,
        capital : 0,
        interes : interes_truncado,
        aporte: aporte,
        total: interes_truncado+aporte ,
        otros_pagos : this.comodin,
        total_acumulado : interes_truncado + aporte + this.comodin
      })
    }

    // Se pagan los intereses mientras no se cancele el crédito
    if( numero_cuotas > 1){
      for( i; i<numero_cuotas; i++){
        fecha=moment(new Date(ano_credito, mes_credito, dia_pago)).add(i, 'months').toDate();
        this.cronograma.push({
          numero: i,
          fecha: fecha,
          fecha_formato: moment(fecha).format('LL'),
          monto: interes,
          capital : 0,
          interes : interes,
          aporte: aporte,
          total: interes + aporte,
          otros_pagos : this.comodin,
          total_acumulado : interes + aporte + this.comodin
        })
      }
    };

    let monto_acumulado : number = 0;
    // Se calcula el monto de las cuotas normales
    let monto : number = ( (total)/this.cuotas ) ;

    for (let j = 1; j<=this.cuotas; j++) {
      fecha=moment(fecha_corregida).add(j-1, 'months').toDate();
      this.cronograma.push({
        numero: i+j-1,
        fecha: fecha,
        fecha_formato: moment(fecha).format('LL'),
        monto: monto,
        capital : monto-interes,
        interes : interes,
        aporte: aporte,
        total: monto+ aporte,
        otros_pagos : this.comodin,
        total_acumulado : monto + aporte + this.comodin
      })
    }

    this.prestamo = Math.round(
      +this.cronograma.reduce( (acumulador, item)=>{
        // console.log(item.monto);
        // console.log( acumulador + item.monto );
        return ( acumulador + item.monto ) ;
      },0 )
    * 100 ) / 100;

    // console.log(this.cronograma);

    this.CalcularTotalCronograma();
    this.EvaluacionCuotas.CargarInformacion(this.cronograma);

    this.EmitirInformacion();
  }

  CalcularTotalCronograma(){
    
    // Se calcula el total línea por línea
    this.cronograma.forEach((item)=>{
      item.total = +item.monto +item.aporte
    })

    this.total_cronograma_editado=0;
    
    this.cronograma.forEach((item)=>{
      this.total_cronograma_editado=this.total_cronograma_editado+item.total*1;
    })

    // console.log(this.diferencia);
    this.diferencia= Math.abs(Math.round((this.prestamo-this.total_cronograma_editado)*100)/100);

  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  CalcularTotales(){
    this.prestamo=0;
    this.cronograma.forEach((item)=>{
      this.prestamo+=item.monto
    });
    this.capital=Math.round(this.prestamo/(1+this.cuotas*this.interes/100)*100)/100;
  }

}

export class EvaluacionCoutasDataSource {

  public Cuotas= new BehaviorSubject<any>([]);

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.Cuotas.asObservable();
  }
  
  disconnect() {
    // this.Cuotas.complete();
    // this.Cargando.complete()
  }
  
  CargarInformacion(cuotas){
    this.Cuotas.next(cuotas)
    // console.log(cuotas)
  }

}
