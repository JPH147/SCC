import { Component, OnInit, Input,AfterViewInit,ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {FormControl} from '@angular/forms';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material';
import {AgregarProductoComponent} from '../agregar-producto/agregar-producto.component';
import { ReglasEvaluacionService } from '../../tablas-maestras/reglas-evaluacion/reglas-evaluacion.service';
import * as moment from 'moment';

// import * as _moment from 'moment';

// import {MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import {MatDatepicker} from '@angular/material/datepicker';
// import {default as _rollupMoment, Moment} from 'moment';

// const moment = _rollupMoment || _moment;

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

@Component({
  selector: 'app-evaluacion-cuotas',
  templateUrl: './evaluacion-cuotas.component.html',
  styleUrls: ['./evaluacion-cuotas.component.css'],
  providers: [ReglasEvaluacionService
    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
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

  @ViewChild('InputCapital') FiltroCapital:ElementRef;
  @ViewChild('InputCuotas') FiltroCuotas:ElementRef;

  EvaluacionCuotas: EvaluacionCoutasDataSource;
  Columnas: string[] = ['fecha','monto','aporte','total']

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
        this.informacion.emit({tipo: this.tipo, capital: this.capital,total: this.prestamo, cuotas:this.cuotas,cronograma:this.cronograma,productos: this.Productos})
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
    this.pago_proximo_mes=evento.checked
    if (this.pago_proximo_mes) {
      this.fecha_inicio=moment(this.fecha_prestamo).add((1), 'months').toDate();
    }else{
      this.fecha_inicio=this.fecha_prestamo;
    }
    this.CalcularPagos();
  }

  // CambioInteresDiario(){
    // console.log(evento.checked)
    // if (this.interes_por_dia) {
    //   this.CalcularInteresDiario();
    // }else{
    //   this.interes_diario=0;
    // }
    // this.CalcularPagos()
  // }

  CambioTipoVenta(evento){
    if (evento.value==1) {
      this.aporte_considerado=this.aporte;
    }else{
      this.aporte_considerado=0;
    }
    this.CalcularPagos()
  }

  CalcularInteresDiario(){
    // console.log(this.capital)
    if (this.interes_por_dia) {
      this.interes_diario=Math.round((this.capital*this.interes)*(1-(moment(this.fecha_prestamo).date()/moment(this.fecha_prestamo).daysInMonth()))*10)/10;
    } else {
      this.interes_diario=0;
    }
  }

  CalcularPagos(){

    this.EvaluarRegla();

    // this.CalcularInteresDiario()
    // this.CambioModoPago()

    this.cronograma=[];

    let fecha:Date;
    let adicional:boolean=false;
    let j:number;

    let interes_mensual=Math.round((this.capital*this.interes)*10)/10;
    let cuota=Math.round(((this.capital/this.cuotas)+interes_mensual)*10)/10;

    for(let i=1; i<=this.cuotas ;i++){

      if (this.fecha_inicio == this.fecha_prestamo && this.interes_diario>0 && i==1) {
        this.cronograma.push({
          numero:1,
          monto: this.interes_diario,
          aporte: this.aporte_considerado,
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
        fecha: fecha,
        total: cuota+this.aporte_considerado + ((!adicional && j==1) ? this.interes_diario : 0),
      })
    }

    this.prestamo=Math.round(this.capital+interes_mensual*this.cuotas)+this.interes_diario;

    this.EvaluacionCuotas.CargarInformacion(this.cronograma);

    this.EvaluarMonto()
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


  // date = new FormControl(moment());

  // chosenYearHandler(normalizedYear: Moment) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.date.setValue(ctrlValue);
  // }

  // chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.month(normlizedMonth.month());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }

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
