import { Component, OnInit, Input,AfterViewInit,ViewChild, ElementRef, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {FormControl} from '@angular/forms';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import {AgregarProductoComponent} from '../agregar-producto/agregar-producto.component';
import { ReglasEvaluacionService } from '../../tablas-maestras/reglas-evaluacion/reglas-evaluacion.service';
import * as moment from 'moment';
import { ServiciosGenerales } from '../../global/servicios';
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'app-evaluacion-cuotas',
  templateUrl: './evaluacion-cuotas.component.html',
  styleUrls: ['./evaluacion-cuotas.component.css'],
  providers: [ ReglasEvaluacionService , ServiciosGenerales ],
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

  @ViewChild('InputCapital', { static: true }) FiltroCapital:ElementRef;
  @ViewChild('InputCuotas', { static: true }) FiltroCuotas:ElementRef;

  @ViewChildren('InputNumero') FiltroNumero: QueryList<any>;
  @ViewChildren('InputPrecio') FiltroPrecio: QueryList<any>;

  EvaluacionCuotas: EvaluacionCoutasDataSource;
  Columnas: string[] = ['numero','fecha','monto','aporte','total'] ;

  constructor(
    private Dialogo: MatDialog ,
    private RServicio: ReglasEvaluacionService ,
    private ServiciosGenerales : ServiciosGenerales ,
    private changeDetector : ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.tipo=1;
    this.cuotas=10;
    this.capital=1000;
    this.correcto=true;
    this.fecha_prestamo=new Date();
    this.fecha_inicio=moment(this.fecha_prestamo).add((1), 'months').toDate();
    this.CorregirFecha(this.fecha_inicio);
    this.monto_mayor=false;
    this.pago_proximo_mes=true;
    this.interes_por_dia=true;
    this.CalcularInteresDiario();
    this.EvaluacionCuotas = new EvaluacionCoutasDataSource();
    this.interes_diario=0;
    this.editar_cronograma = 3;
    this.RServicio.ListarReglas().subscribe(res=>{
      this.Reglas=res;
      this.datos.subscribe(res=>{
        // console.log("Entrada",res.cronograma);
        this.monto_mayor=false;
        this.aporte=res.aporte;
        this.aporte_considerado=res.aporte;
        this.interes=res.interes;
        this.capacidad=res.capacidad;
        if(res.presupuesto_antiguo) {
          this.capital = res.capital ;
          this.cuotas = res.cuotas ;
          this.prestamo = res.prestamo ;
          this.tipo = res.tipo ;
          this.cronograma = res.cronograma ;
          this.EvaluacionCuotas.CargarInformacion(this.cronograma) ;
        } else {
          // console.log(1)
          this.OtrosPagos=res.otros_pagos?res.otros_pagos:[];
          this.CalcularPrimerPago();
          this.EmitirInformacion();
        }
      });
    });
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
    ).subscribe();

    this.FiltroNumero.changes.subscribe(res=>{
      for (let i in this.FiltroNumero['_results']) {
        fromEvent(this.FiltroNumero['_results'][i].nativeElement,'keyup')
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(()=>{
            if (this.FiltroNumero['_results'][i]) {
              if (this.FiltroNumero['_results'][i].nativeElement.value) {
                this.CalcularTotalesProducto();
              }
            }
          })
        ).subscribe()
      }
    })

    this.FiltroPrecio.changes.subscribe(res=>{
      for (let i in this.FiltroPrecio['_results']) {
        fromEvent(this.FiltroPrecio['_results'][i].nativeElement,'keyup')
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(()=>{
            if (this.FiltroPrecio['_results'][i]) {
              if (this.FiltroPrecio['_results'][i].nativeElement.value) {
                this.CalcularTotalesProducto();
              }
            }
          })
        ).subscribe()
      }
    })

  }

  // Esta función recibe una fecha y transforma el día en 27 XD!
  CorregirFecha(fecha : Date){
    let ano = moment( fecha ).year() ;
    let mes = moment( fecha ).month() ;
    this.fecha_inicio = new Date(ano, mes, 27) ;
  }

  EmitirInformacion(){
    // console.log("Salida",this.cronograma);
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
    this.EvaluarRegla();
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
      // this.CalcularPagos();
    } else {
      this.fecha_inicio=this.fecha_prestamo;
      this.CorregirFecha(this.fecha_inicio);
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

  VerificarCoincidenciaCronograma(fecha) {
    let i : number = 0 ;
    let j : boolean = false ;
    if(this.OtrosPagos.length>0){
      this.OtrosPagos.forEach((item)=>{
        i=i+1;
        let comparar_mes = moment(item.fecha_vencimiento).month() == moment(fecha).month();
        let comparar_ano = moment(item.fecha_vencimiento).year() == moment(fecha).year();
        if( comparar_mes && comparar_ano ) {
          j=true;
          this.comodin=item.cuota_mensual;
        }
        if( i==this.OtrosPagos.length && !j ) {
          this.comodin=0 ;
        }
      })
    } else {
      this.comodin=0 ;
    }
  }

  CalcularPagos(){

    // this.EvaluarRegla();
    // this.CalcularInteresDiario();
    // this.CambioModoPago()
    let aporte : number ;
    if(this.interes==0) {
      aporte = 0;
    } else {
      aporte = this.aporte_considerado;
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
        this.VerificarCoincidenciaCronograma(fecha);
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
      this.VerificarCoincidenciaCronograma(fecha);
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

  EvaluarMonto(){
  //   if(this.cronograma[0].total>this.capacidad){
  //     this.monto_mayor=true;
  //   }else{
  //     this.monto_mayor=false;
  //   }
  //   this.informacion.emit({tipo: this.tipo, capital: this.capital,total: this.prestamo, fecha_prestamo: this.fecha_prestamo, cuotas:this.cuotas,cronograma:this.cronograma,productos: this.Productos});
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
    this.EvaluarMonto()
  }

  AgregarProducto(){
    
    let Ventana = this.Dialogo.open(AgregarProductoComponent,{
      width: '1200px',
      data: {capital: this.capital, productos: this.Productos, ocultar_almacen: true}
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Productos=res.productos;
        console.log(this.Productos);
        this.capital=res.total;
        this.CalcularPagos();
      }
    })
  }

  CalcularPrimerPago(){
    if(this.cronograma.length==0){

      // Si se hace una evaluación, cambia el capital
      if( this.capacidad!=270 && this.capacidad>0) {
        this.capital=((this.capacidad-this.aporte)*this.cuotas)/(1+this.cuotas*this.interes/100) ;
        this.capital= Math.round(this.capital*100)/100 ;
      }
  
      // console.log(this.capital);
  
      let aporte : number ;
      if(this.interes==0){
        aporte=0;
      } else {
        aporte=this.aporte_considerado;
      }
  
      this.EvaluarRegla();
  
      let interes : number =  Math.round(+this.capital * (this.interes /100 ) *100 ) / 100;
      this.prestamo = this.capital*(1+this.cuotas*this.interes/100)+this.interes_diario ; // +this.interes_diario solo para pruebas
  
      let fecha:Date;
      let adicional: boolean = false;
  
      let cuota=this.capacidad-aporte;
      let j: number;
  
      this.cronograma=[];
  
      for(let i=1; i<=this.cuotas; i++){
  
        if (this.interes_por_dia && i==1) {
          this.VerificarCoincidenciaCronograma(this.fecha_inicio);
          this.cronograma.push({
            numero:0,
            capital : 0,
            interes : this.interes_diario,
            monto: this.interes_diario,
            aporte: 0,
            fecha: this.fecha_inicio,
            fecha_formato : moment(fecha).format('LL') ,
            total: this.interes_diario,
            otros_pagos : this.comodin,
            total_acumulado : this.interes_diario + this.comodin
          });
          adicional=true;
        }
  
        if (adicional) {
          j=i+0
        }else{
          j=i
        }
        
        fecha = moment(this.fecha_inicio).add((j-1), 'months').toDate();
        this.VerificarCoincidenciaCronograma(fecha);
  
        let total = cuota+aporte + ((!adicional && j==1) ? this.interes_diario : 0);
  
        this.cronograma.push({
          numero: j,
          monto: cuota + ((!adicional && j==1) ? this.interes_diario : 0),
          capital : cuota + ((!adicional && j==1) ? this.interes_diario : 0) - interes,
          interes : interes,
          aporte: aporte,
          fecha: fecha,
          fecha_formato : moment(fecha).format('LL') ,
          total: total,
          otros_pagos : this.comodin,
          total_acumulado : total + this.comodin
        })
      }
      
      this.CalcularPrimerosTotales();
      this.EvaluacionCuotas.CargarInformacion(this.cronograma);
    }
  }

  CalcularPrimerosTotales(){
    // this.prestamo=0;
    // this.cronograma.forEach((item)=>{
    //   this.prestamo=this.prestamo+item.monto;
    // })

    // this.prestamo=Math.round(((this.capacidad-this.aporte)*this.cuotas)+this.interes_diario);

    // this.capital=Math.round(this.prestamo/(1+this.cuotas*this.interes)*100)/100;
  }

  ListarSucursales(){
    this.ServiciosGenerales.ListarSucursal(null,"").subscribe(res=>{
      this.Sucursales=res
    })
  }

  SucursalSeleccionada(evento){
    this.sucursal=evento.value;
    this.Productos = [] ;
    // this.BuscarProducto(this.sucursal,"");
  }

  EliminarProductos(id){
    this.Productos = this.Productos.filter(e=>e.id != id)
  }

  CalcularTotalesProducto(){
    let total : number = 0 ;
    this.Productos.forEach((item)=>{
      item.estado=+item.numero*item.precio;
      total=total+item.estado;
    }) ;
    this.capital = Math.round(total*100)/100 ;
    this.CalcularPagos() ;
  }

  CambiarVistaCronograma(evento){
    if(evento.checked) {
      this.Columnas = ['numero','fecha','monto','aporte','total','otros_pagos','total_acumulado'];
    } else {
      this.Columnas = ['numero','fecha','monto','aporte','total'];
    }
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
