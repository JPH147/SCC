import { Component, OnInit, AfterViewInit,  ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of , BehaviorSubject , merge, fromEvent} from 'rxjs';
import { catchError , finalize, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionarClienteComponent } from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaEmergenteContacto} from '../clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { VentanaEmergenteClientes } from '../clientes/ventana-emergente/ventanaemergente';
import { RefinanciamientoService } from './refinanciamiento.service';
import { CreditosService } from '../creditos/creditos.service';
import { ClienteService } from '../clientes/clientes.service' ;
import { ServiciosDirecciones } from '../global/direcciones';
import { ServiciosTelefonos } from '../global/telefonos';
import { EvaluacionService } from '../evaluacion/evaluacion.service' ;
import { ServiciosGenerales } from '../global/servicios' ;
import * as moment from 'moment' ;
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-refinanciamiento',
  templateUrl: './refinanciamiento.component.html',
  styleUrls: ['./refinanciamiento.component.scss'],
  providers : [ CreditosService , ServiciosDirecciones , ServiciosTelefonos, ClienteService , ServiciosGenerales ]
})

export class RefinanciamientoComponent implements OnInit, AfterViewInit {

  @ViewChild('InputCapital', { static: true }) FiltroCapital : ElementRef;
  @ViewChild('InputCuotas', { static: true }) FiltroCuotas : ElementRef;
  @ViewChild('InputVendedor', { static: true }) VendedorAutoComplete : ElementRef;

  public RefinanciamientoSeleccionForm : FormGroup ;
  public RefinanciamientoCronogramaForm : FormGroup ;
  public RefinanciamientoArchivosForm : FormGroup ;
  public Transacciones : Array<any> ;

  public Listadotransacciones : RefinanciamientoDataSource ;
  public ListadoCronograma : CronogramaDataSource ;
  public Columnas : Array<string> ;
  public ColumnasCronograma : Array<string> ;
  public Hoy : Date = new Date();

  public Informacion : any ;
  public Informacion2 : any ;
  public InformacionCompleta : Array<any> ;
  public Cronograma : Array<any> ;

  public interes_diario : number ;
  public comodin : number ;

  public garantes : FormArray ;
  public distrito_aval : string ;
  public direccion_aval : string ;
  public autorizacion_aval : string ;
  public ddjj_aval : string ;
  public carta_aval : string ;
  public compromiso_aval : string ;

  public dni_cliente : string ;
  public generados : boolean ;
  public ddjj : string ;
  public autorizacion : string ;
  public compromiso : string ;
  public transaccion : string ;
  public tarjeta : string ;

  public ListadoVendedores : Array<any> ;
  public distrito_cliente : string ;
  public direccion_cliente : string ;
  public informacion_cooperativa : any ;
  public cooperativa_nombre : string ;
  public penalidad_porcentaje : number ;
  public penalidad_maxima_cuota : number ;
  public contrato_dias_premura : number ;
  public cooperativa_cuenta_banco : string ;
  public cooperativa_cuenta_numero : string ;
  public cooperativa_contacto : string ;
  public cooperativa_direccion : string ;
  public cooperativa_direccion_1 : string ;
  public cooperativa_direccion_2 : string ;
  public cooperativa_direccion_3 : string ;
  public cooperativa_direccion_4 : string ;
  public presidente_nombre : string ;
  public presidente_dni : string ;
  public presidente_direccion : string ;

  constructor(
    private Dialogo : MatDialog ,
    private Builder : FormBuilder ,
    private route : Router ,
    private location: Location,
    private Servicio : RefinanciamientoService ,
    private CrServicios : CreditosService ,
    private CServicios : ClienteService ,
    private DServicios : ServiciosDirecciones ,
    private TServicios : ServiciosTelefonos ,
    private AServicios : EvaluacionService ,
    private ServiciosGenerales : ServiciosGenerales,
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ObtenerDatosCooperativa();
    this.ListarVendedor("");

    this.Columnas = [ "numero" , "considerar" , "fecha" , "tipo" , "documento" , "monto_pendiente" ] ;
    this.Listadotransacciones = new RefinanciamientoDataSource(this.Servicio);

    this.ColumnasCronograma =  ['numero','fecha','capital','interes', 'total'] ;
    this.ListadoCronograma = new CronogramaDataSource();
  }

  Atras(){
    this.location.back()
  }

  ngAfterViewInit(): void {
    merge(
      fromEvent(this.FiltroCapital.nativeElement,'keyup'),
      fromEvent(this.FiltroCuotas.nativeElement,'keyup'),
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.CrearCronograma();
      })
    ).subscribe();

    fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarVendedor(this.VendedorAutoComplete.nativeElement.value);
      })
     ).subscribe();

  }

  CrearFormulario(){
    this.CrearFormularioSeleccion();
    this.CrearFormularioCronograma();
    this.CrearFormularioArchivos();
  }

  CrearFormularioSeleccion(){
    this.RefinanciamientoSeleccionForm = this.Builder.group({
      id_cliente : [ { value : null , disabled : false },[
        Validators.required
      ] ],
      cliente_nombre : [ { value : null , disabled : false },[
      ] ],
      total : [ { value : 0 , disabled : false }, [
        Validators.min(1)
      ] ]
    })
  }

  CrearFormularioCronograma(){
    this.RefinanciamientoCronogramaForm = this.Builder.group({
      numero_cuotas : [ { value: 10, disabled : false } ,[
      ] ] ,
      capital_adicional : [ { value: 0, disabled : false } ,[
      ] ] ,
      capital_anterior : [ { value: 0, disabled : false } ,[
      ] ] ,
      capital : [ { value: 0, disabled : false } ,[
      ] ] ,
      total : [ { value: 0, disabled : false } ,[
      ] ] ,
      fecha_prestamo : [ { value: this.Hoy , disabled : false } ,[
      ] ] ,
      interes_por_dia : [ { value: false, disabled : false } ,[
      ] ] ,
      cuotas_homogeneas : [ { value: true, disabled : false } ,[
      ] ] ,
      fecha_inicio : [ { value: new Date( moment( this.Hoy ).add(1, 'months').year() , moment( this.Hoy ).add(1, 'months').month() , 27 ), disabled : false } ,[
      ] ] ,
      aporte : [ { value: 0, disabled : false } ,[
      ] ] ,
      interes : [ { value: 0, disabled : false } ,[
      ] ] ,
    })
  }

  CrearFormularioArchivos(){
    this.RefinanciamientoArchivosForm = this.Builder.group({
      plantilla_ddjj : [ { value : null , disabled : false } , [
      ]],
      plantilla_autorizacion : [ { value : null , disabled : false } , [
      ]],
      plantilla_transaccion : [ { value : null , disabled : false } , [
      ]],
      plantilla_compromiso : [ { value : null , disabled : false } , [
      ]],
      plantilla_tarjeta : [ { value : null , disabled : false } , [
      ]],
      parametro_condicion : [ { value : "" , disabled : false } , [
      ]],
      parametro_domicilio : [ { value : "" , disabled : false } , [
      ]],
      parametro_autorizacion_1 : [ { value : "" , disabled : false } , [
      ]],
      parametro_autorizacion_2 : [ { value : "" , disabled : false } , [
      ]],
      tipo : [ { value : null , disabled : false } , [
      ]],
      id_cliente : [ { value : null , disabled : false } , [
        Validators.required
      ]],
      nombre : [ { value : null , disabled : false } , [
      ]],
      dni : [ { value : null , disabled : false } , [
      ]],
      trabajo : [ { value : null , disabled : false } , [
      ]],
      cargo : [ { value : null , disabled : false } , [
      ]],
      cargo_estado : [ { value : null , disabled : false } , [
      ]],
      cip : [ { value : null , disabled : false } , [
      ]],
      codigo : [ { value : null , disabled : false } , [
      ]],
      casilla : [ { value : null , disabled : false } , [
      ]],
      subsede : [ { value : null , disabled : false } , [
      ]],
      capital : [ { value : null , disabled : false } , [
      ]],
      interes : [ { value : null , disabled : false } , [
      ]],
      total : [ { value : null , disabled : false } , [
      ]],
      monto_asociado : [ { value : null , disabled : false } , [
      ]],
      monto_cuota : [ { value : null , disabled : false } , [
      ]],
      numero_cuotas : [ { value : null , disabled : false } , [
      ]],
      telefono_tipo : [ { value : "" , disabled : false } , [
      ]],
      telefono_numero : [ { value : null , disabled : false } , [
      ]],
      telefono_whatsapp : [ { value : null , disabled : false } , [
      ]],
      considerar_direccion_cliente : [ { value : false , disabled : false } , [
      ]],
      direccion_resumen : [ { value : null , disabled : false } , [
      ]],
      provincia : [ { value : null , disabled : false } , [
      ]],
      direccion_mostrar : [ { value : null , disabled : false } , [
      ]],
      direccion : [ { value : null , disabled : false } , [
      ]],
      distrito : [ { value : null , disabled : false } , [
      ]],
      email : [ { value : null , disabled : false } , [
      ]],
      cuenta_banco : [ { value : "" , disabled : false } , [
      ]],
      cuenta_numero : [ { value : null , disabled : false } , [
      ]],
      fecha_letras : [ { value : null , disabled : false } , [
      ]],
      id_vendedor : [ { value : null , disabled : false } , [
        Validators.required
      ]],
      vendedor : [ { value : null , disabled : false } , [
      ]],
      vendedor_dni : [ { value : "" , disabled : false } , [
      ]],
      id_trabajador : [ { value : null , disabled : false } , [
      ]],
      trabajador : [ { value : "" , disabled : false } , [
      ]],
      trabajador_dni : [ { value : "" , disabled : false } , [
      ]],
      trabajador_cargo : [ { value : "" , disabled : false } , [
      ]],
      lugar : [ { value : null , disabled : false } , [
        Validators.required
      ]],
      dias_premura : [ { value : null , disabled : false } , [
        Validators.required,
        Validators.min(0)
      ]],
      hay_garante : [ { value : false , disabled : false } , [
      ]],
      garantes: this.Builder.array([this.CrearGarante()]),
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        // console.log(res);
        this.RefinanciamientoSeleccionForm.get('id_cliente').setValue(res.id);
        this.RefinanciamientoSeleccionForm.get('cliente_nombre').setValue(res.nombre);
        this.VerificarCondiciones(res.id);

        this.dni_cliente = res.dni;
        let dni_longitud : number = (res.dni).toString().length;
        // console.log(dni_longitud, dni)
        for(let i = dni_longitud; i<8 ; i++){
          // console.log(dni_longitud, dni)
          this.dni_cliente = "0" + this.dni_cliente ;
        }
        this.BuscarCliente(this.dni_cliente);
        this.BuscarTransacciones();
      }
    })
  }

  RemoverCliente(){
    this.RefinanciamientoSeleccionForm.get('id_cliente').setValue(null);
    this.RefinanciamientoSeleccionForm.get('cliente_nombre').setValue("");

    this.RefinanciamientoSeleccionForm.get('total').setValue(0) ;
    this.Listadotransacciones.InformacionTransacciones.next([]);
  }

  TransaccionSeleccionada(evento, id) {
    // console.log(evento, id) ;
    this.Listadotransacciones.InformacionTransacciones.value.forEach((item)=>{
      if(item.id==id) {
        item.considerar=evento.checked;
        return ;
      }
    })

    this.CalcularTotal() ;

  }

  CalcularTotal(){

    let total : number = 0 ;
    let monto : number ;

    this.Listadotransacciones.InformacionTransacciones.value.forEach( (item)=>{
      monto = item.considerar ? item.monto_pendiente : 0 ;
      total = total + monto ;
    }) ;

    this.RefinanciamientoSeleccionForm.get('total').setValue(total) ;
    this.SeleccionarTransaccionesConsideradas();
  }

  BuscarTransacciones(){
    this.Listadotransacciones.CargarInformacion(this.RefinanciamientoSeleccionForm.value.id_cliente);
    this.RefinanciamientoSeleccionForm.get('total').setValue(0);
  }

  SeleccionarTransaccionesConsideradas(){
    this.Transacciones = [] ;
    this.Listadotransacciones.InformacionTransacciones.value.forEach( (item)=>{
      if(item.considerar) {
        this.Transacciones.push({tipo: item.id_tipo, id: item.id, documento: item.documento});
      }
    }) ;
  }

  /*******************************************************************************************/
  Paso1Completado(){
    this.CrearCuotasArray();
    this.RefinanciamientoCronogramaForm.get('capital_adicional').setValue( 0 ) ;
    this.RefinanciamientoCronogramaForm.get('capital_anterior').setValue( this.RefinanciamientoSeleccionForm.value.total ) ;
    this.RefinanciamientoCronogramaForm.get('interes_por_dia').setValue(false) ;

    this.RefinanciamientoCronogramaForm.get('total').setValue( this.RefinanciamientoSeleccionForm.value.total ) ;
    this.CalcularInteresDiario();
    this.CalcularNuevoCapital();
    this.CrearCronograma();
  }

 // Esta función recibe una fecha y transforma el día en 27 XD!
  CorregirFecha(fecha : Date){
    let ano = moment( fecha ).year() ;
    let mes = moment( fecha ).month() ;
    this.RefinanciamientoCronogramaForm.get('fecha_inicio').setValue( new Date(ano, mes, 27) ) ;
  }

  CalcularNuevoCapital(){
    let capital = this.RefinanciamientoCronogramaForm.value.capital_adicional + this.RefinanciamientoCronogramaForm.value.capital_anterior ;
    this.RefinanciamientoCronogramaForm.get('capital').setValue( capital ) ;
  }

  VerificarCondiciones(id){
    this.CrServicios.Verificar_Afiliacion(id).subscribe(res=>{
      // Si está afiliado, se verifica el interés que debería pagar y el aporte se considera 0
      // console.log(id,res);
      if(res['codigo_afiliacion']) {
        this.CrServicios.Verificar_Interes(res['total_pagado']).subscribe(res=>{
          this.RefinanciamientoCronogramaForm.get('aporte').setValue(0);
          this.RefinanciamientoCronogramaForm.get('interes').setValue(res) ;
        })
      }
    })
  }

  CrearCuotasArray(){
    this.InformacionCompleta = this.Listadotransacciones.Cronograma ;
    this.Informacion = [] ;
    let documento : any = {} ;

    // Se filtran todas las cuotas del las transacciones
    this.Transacciones.forEach((item)=>{
      documento = {} ;
      this.InformacionCompleta.forEach((item2)=>{
        if( item.tipo == item2.tipo && item.id == item2.id_transaccion ) {
          documento[item.documento] = item2.cuota_mensual ;
          this.Informacion.push({ fecha: item2.fecha_vencimiento , monto: item2.cuota_mensual , capital : item2.capital , documento})
        }
      })
    })
  }

  CalcularInteresDiario(){
    if (this.RefinanciamientoCronogramaForm.value.interes_por_dia) {
      let interes = this.RefinanciamientoCronogramaForm.value.capital*this.RefinanciamientoCronogramaForm.value.interes;
      this.interes_diario=Math.round( interes * (1-(moment(this.RefinanciamientoCronogramaForm.value.fecha_prestamo).date()/moment(this.RefinanciamientoCronogramaForm.value.fecha_prestamo).daysInMonth()) )*10)/10;
    } else {
      this.interes_diario=0;
    }
    this.CrearCronograma();
  }

  CambioTipoCuotas(){
    if( this.RefinanciamientoCronogramaForm.value.cuotas_homogeneas ) {
      this.ColumnasCronograma =  ['numero','fecha','capital','interes', 'total'] ;
    } else {
      this.ColumnasCronograma =  ['numero','fecha','nuevo', 'antiguo', 'interes', 'total'] ;
    }
    this.CrearCronograma();
  }

  VerificarCoincidenciaCronograma(fecha, tipo) {
    // tipo 2. Exacta (Se considera si el mes es el mes de la cuota)
    // Tipo 1. Límite (Se considera los montos hasta esa fecha)
    // Tipo 3. Límite (Se considera los montos desde esa fecha)
    this.comodin = 0 ;
    let i : number = 0 ;
    let j : boolean = false ;

    if( this.RefinanciamientoCronogramaForm.value.cuotas_homogeneas ) {

      this.comodin = 0;

    } else {

      if( tipo == 1 ) {
        if(this.Informacion.length>0){
          this.Informacion.forEach((item)=>{
            i=i+1;
            if( moment(item.fecha).isSameOrBefore(fecha, 'month') ) {
              j=true;
              this.comodin=this.comodin+item.capital;
            }
            if( i==this.Informacion.length && !j ) {
              this.comodin=0 ;
            }
          })
        } else {
          this.comodin=0 ;
        }
      }
  
      if( tipo == 2 ) {
        if(this.Informacion.length>0){
          this.Informacion.forEach((item)=>{
            i=i+1;
            if( moment(item.fecha).isSame(fecha, 'month') ) {
              j=true;
              this.comodin=this.comodin+item.capital;
            }
            if( i==this.Informacion.length && !j ) {
              this.comodin=0 ;
            }
          })
        } else {
          this.comodin=0 ;
        }
      }
  
      if( tipo == 3 ) {
        if(this.Informacion.length>0){
          this.Informacion.forEach((item)=>{
            i=i+1;
            if( moment(item.fecha).isSameOrAfter(fecha, 'month') ) {
              j=true;
              this.comodin=this.comodin+item.capital;

            }
            if( i==this.Informacion.length && !j ) {
              this.comodin=0 ;
            }
          })
        } else {
          this.comodin=0 ;
        }
      }
    }
  }

  CrearCronograma(){

    this.CalcularNuevoCapital();

    let fecha_inicio = this.RefinanciamientoCronogramaForm.value.fecha_inicio ;
    let fecha_prestamo = this.RefinanciamientoCronogramaForm.value.fecha_prestamo ;
    let tasa_interes = this.RefinanciamientoCronogramaForm.value.interes ;
    let cuotas = this.RefinanciamientoCronogramaForm.value.numero_cuotas ;
    
    let capital : number ;

    if(this.RefinanciamientoCronogramaForm.value.cuotas_homogeneas) {
      capital = this.RefinanciamientoCronogramaForm.value.capital ;
    } else {
      capital = this.RefinanciamientoCronogramaForm.value.capital_adicional ;
    }

    this.Cronograma=[];
    let i = 1;

    //Se calcula el monto total y el interés
    let interes : number =  Math.round(capital * (tasa_interes /100 ) *100 ) / 100 ;
    let total : number = Math.round(capital * ( 1 + cuotas * tasa_interes / 100 ) *100 ) / 100 ;
    let monto : number = ( total / cuotas ) ;

    //Se calculan las cuotas estándar.
    let capital_estandar : number = this.RefinanciamientoCronogramaForm.value.capital ;
    let interes_estandar : number =  Math.round(capital_estandar * (tasa_interes /100 ) *100 ) / 100 ;
    let total_estandar : number = Math.round(capital_estandar * ( 1 + cuotas * tasa_interes / 100 ) *100 ) / 100 ;
    let monto_estandar : number = ( total_estandar / cuotas ) ;
    
    // Se calculan las fechas de las cuotas
    let ano_pago = moment(fecha_inicio).year();
    let mes_pago = moment(fecha_inicio).month();
    let dia_pago = moment(fecha_inicio).date();
    let fecha_corregida : Date = new Date(ano_pago, mes_pago, dia_pago);
    let fecha : Date;

    // Se evalúa si el crédito se da antes o después de quincena
    let dia_credito :number = moment(fecha_prestamo).date();
    let mes_credito :number = moment(fecha_prestamo).month();
    let ano_credito :number = moment(fecha_prestamo).year();
    let dias_mes : number = moment(fecha_prestamo).daysInMonth();
    let interes_truncado = Math.round( ((dias_mes - dia_credito) / dias_mes) * interes_estandar * 100 ) / 100;

    let numero_cuotas = moment(fecha_inicio).diff(moment(fecha_prestamo), 'months') ;
    // Se reemplazó numero_cuotas por (mes_pago - mes_credito)

    // Si el crédito es antes de quincena, se paga a fin de mes los intereses truncados
    if( this.RefinanciamientoCronogramaForm.value.interes_por_dia ){
      let fecha_1 = moment(fecha_prestamo).endOf('month');
      this.Cronograma.push({
        numero: 0,
        fecha: fecha_1,
        fecha_vencimiento: fecha_1,
        fecha_formato: moment(fecha).format('LL'),
        monto: interes_truncado,
        capital : 0,
        interes : interes_truncado,
        total: interes_truncado ,
        monto_cuota: interes_truncado ,
        antiguo : 0 ,
        nuevo : 0,
      })
    }

    // Se pagan los intereses mientras no se cancele el crédito
    if( numero_cuotas > 1){
      for( i; i< numero_cuotas; i++){
        fecha=moment(new Date(ano_credito, mes_credito, dia_pago)).add(i, 'months').toDate();
        (i==1 ) ? this.VerificarCoincidenciaCronograma(fecha,1) : this.VerificarCoincidenciaCronograma(fecha,2)

        let capital_total = this.comodin ;
        let interes_cuota = ( interes_estandar * capital_total ) / ( monto_estandar - interes_estandar )

        this.Cronograma.push({
          numero: i,
          fecha: fecha,
          fecha_vencimiento: fecha,
          fecha_formato: moment(fecha).format('LL'),
          monto: interes,
          capital : capital_total,
          interes : interes_estandar + interes_cuota,
          total: capital_total + interes_estandar + interes_cuota,
          monto_cuota: capital_total + interes_estandar + interes_cuota,
          antiguo : this.comodin,
          nuevo : 0,
        })
      }
    };

    let capital_cuota : number = 0 ;
    // Se calcula el monto de las cuotas normales
    for (let j = 1; j<=cuotas; j++) {
      fecha=moment(fecha_corregida).add(j-1, 'months').toDate();
      ( i == 1 && j == 1 ) ? this.VerificarCoincidenciaCronograma(fecha,1) : this.VerificarCoincidenciaCronograma(fecha,2);
      ( j == cuotas ) ? this.VerificarCoincidenciaCronograma(fecha,3) : "Nada XD!" ;

      let capital_cuota = monto - interes ;
      let capital_total = monto - interes + this.comodin ;
      let interes_cuota = ( interes_estandar * capital_total ) / ( monto_estandar - interes_estandar ) ;
      // console.log(interes_cuota, interes_estandar, capital_total, monto, interes, this.comodin);

      this.Cronograma.push({
        numero: i+j-1,
        fecha: fecha,
        fecha_vencimiento: fecha,
        fecha_formato: moment(fecha).format('LL'),
        monto: monto,
        capital : capital_total,
        interes : interes_cuota,
        total: capital_total + interes_cuota,
        monto_cuota: capital_total + interes_cuota,
        antiguo : this.comodin,
        nuevo : capital_cuota,
      })
    }

    let prestamo = Math.round(
        +this.Cronograma.reduce( (acumulador, item)=>{
          return ( acumulador + item.total ) ;
        },0 )
      * 100 ) / 100;

    this.RefinanciamientoCronogramaForm.get('total').setValue(prestamo) ;
    // console.log(this.Cronograma);

    this.ListadoCronograma.CargarInformacion(this.Cronograma) ;
  }

  /***************************************************************************************** */ 
  Paso2Completado(){
    let fecha : Date = this.RefinanciamientoCronogramaForm.value.fecha_prestamo ;
    console.log(fecha);
    this.RefinanciamientoArchivosForm.get('fecha_letras').setValue( fecha ) ;
  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoVendedores=res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.RefinanciamientoArchivosForm.value.vendedor.nombre;
    this.RefinanciamientoArchivosForm.get('id_vendedor').setValue(this.RefinanciamientoArchivosForm.value.vendedor.id);
    this.RefinanciamientoArchivosForm.get('vendedor_dni').setValue(this.RefinanciamientoArchivosForm.value.vendedor.dni);
    this.RefinanciamientoArchivosForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.RefinanciamientoArchivosForm.get('id_vendedor').setValue(null);
    this.RefinanciamientoArchivosForm.get('vendedor').setValue("");
    this.RefinanciamientoArchivosForm.get('vendedor_dni').setValue("");
    this.ListarVendedor("");
  }

  BuscarCliente(dni){
    this.CServicios.BuscarClienteDNI(dni).subscribe(res=>{
      if(res['codigo']==0){
        // console.log(res);
        this.RefinanciamientoArchivosForm.get('id_cliente').setValue(res['data'].id) ;
        this.RefinanciamientoArchivosForm.get('plantilla_ddjj').setValue(res['data'].plantilla_ddjj) ;
        this.RefinanciamientoArchivosForm.get('plantilla_autorizacion').setValue(res['data'].plantilla_autorizacion) ;
        this.RefinanciamientoArchivosForm.get('plantilla_compromiso').setValue(res['data'].plantilla_compromiso) ;
        this.RefinanciamientoArchivosForm.get('plantilla_transaccion').setValue(res['data'].plantilla_transaccion) ;
        this.RefinanciamientoArchivosForm.get('plantilla_tarjeta').setValue(res['data'].plantilla_tarjeta) ;
        this.RefinanciamientoArchivosForm.get('parametro_condicion').setValue(res['data'].parametro_condicion) ;
        this.RefinanciamientoArchivosForm.get('parametro_domicilio').setValue(res['data'].parametro_domicilio) ;
        this.RefinanciamientoArchivosForm.get('parametro_autorizacion_1').setValue(res['data'].parametro_autorizacion_1) ;
        this.RefinanciamientoArchivosForm.get('parametro_autorizacion_2').setValue(res['data'].parametro_autorizacion_2) ;
        this.RefinanciamientoArchivosForm.get('nombre').setValue(res['data'].nombre) ;
        this.RefinanciamientoArchivosForm.get('dni').setValue(res['data'].dni) ;
        this.RefinanciamientoArchivosForm.get('trabajo').setValue(res['data'].trabajo) ;
        this.RefinanciamientoArchivosForm.get('cargo').setValue(res['data'].cargo_nombre + " " +res['data'].cargo_estado); ;
        this.RefinanciamientoArchivosForm.get('cargo_estado').setValue(res['data'].cargo_estado) ;
        this.RefinanciamientoArchivosForm.get('cip').setValue(res['data'].cip) ;
        this.RefinanciamientoArchivosForm.get('codigo').setValue(res['data'].codigo) ;
        this.RefinanciamientoArchivosForm.get('casilla').setValue(res['data'].casilla) ;
        this.RefinanciamientoArchivosForm.get('email').setValue(res['data'].email) ;
        this.RefinanciamientoArchivosForm.get('subsede').setValue(res['data'].subsede) ;
        this.ObtenerDireccion(res['data'].id);
        this.ObtenerTelefono(res['data'].id);
        this.ObtenerNumeroCelular(res['data'].id);
        this.ObtenerCuenta(res['data'].id);
      }
    })
  }

  EditarCliente(){

    let VentanaClientes;

    this.CServicios.Seleccionar(this.RefinanciamientoArchivosForm.value.id_cliente).subscribe(res => {
      VentanaClientes= this.Dialogo.open(VentanaEmergenteClientes, {
        width: '1000px',
        data: {objeto: res, id: this.RefinanciamientoArchivosForm.value.id_cliente},
      });

      VentanaClientes.afterClosed().subscribe (res => {
        if(res){
          this.BuscarCliente( this.dni_cliente ) ;
        }
      });

    });
  }

  EditarClienteContacto(){

    let VentanaContacto= this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1000px',
      data: this.RefinanciamientoArchivosForm.value.id_cliente
    });

    VentanaContacto.afterClosed().subscribe (res => {
      console.log(res);
      if(res){
        this.BuscarCliente( this.dni_cliente ) ;
      }
    });
  }

  CambiarDireccion(evento){
    
    let objeto : string ;
    if(evento.checked){
      objeto = "la dirección del cliente"
    } else {
      objeto = "la dirección de la cooperativa"
    }

    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      width: '600px',
      data: { objeto: objeto, titulo: "Confirmar", accion: "utilizar", mensaje: "se considerará" }
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(evento.checked){
          this.RefinanciamientoArchivosForm.get('distrito').setValue(this.distrito_cliente);
          this.RefinanciamientoArchivosForm.get('direccion').setValue(this.direccion_cliente);
        } else {
          this.RefinanciamientoArchivosForm.get('distrito').setValue(this.informacion_cooperativa['direccion_ddjj'].distrito);
          this.RefinanciamientoArchivosForm.get('direccion').setValue(this.informacion_cooperativa['direccion_ddjj'].direccion);
        }
      } else {
        this.RefinanciamientoArchivosForm.get('considerar_direccion_cliente').setValue(!evento.checked)
      }
    })
  }

  ObtenerDireccion(id) {
    this.DServicios.ListarDireccion( id, '1',1,1).subscribe(res => {
      // console.log(res);
      if(res['codigo']==0){
        if (res['data']) {
          this.distrito_cliente = res['data'].direcciones[0].distrito;
          this.direccion_cliente = res['data'].direcciones[0].direccion_formateada;

          this.RefinanciamientoArchivosForm.get('direccion_resumen').setValue(res['data'].direcciones[0].direccion);
          this.RefinanciamientoArchivosForm.get('provincia').setValue(res['data'].direcciones[0].provincia);

          this.RefinanciamientoArchivosForm.get('considerar_direccion_cliente').setValue(false);
          this.RefinanciamientoArchivosForm.get('distrito').setValue(this.distrito_cliente);
          this.RefinanciamientoArchivosForm.get('direccion').setValue(this.direccion_cliente);
          this.RefinanciamientoArchivosForm.get('direccion_mostrar').setValue(this.direccion_cliente);
        } else {
          this.RefinanciamientoArchivosForm.get('direccion').setValue("No registra");
          this.RefinanciamientoArchivosForm.get('direccion_mostrar').setValue("No registra");
          this.RefinanciamientoArchivosForm.get('distrito').setValue("");
        }
      } else {
        this.RefinanciamientoArchivosForm.get('direccion').setValue(" No registra ");
        this.RefinanciamientoArchivosForm.get('direccion_mostrar').setValue(" No registra ");
        this.RefinanciamientoArchivosForm.get('distrito').setValue("");
      }
    });
  }

  ObtenerTelefono(id) {
    this.TServicios.ListarTelefono( id, '1',1,1).subscribe(res => {
      if(res['codigo']==0){
        if (res['data']) {
          this.RefinanciamientoArchivosForm.get('telefono_numero').setValue(res['data'].telefonos[0].tlf_numero);
          if(res['data'].telefonos[0].id_tipo==1){
            this.RefinanciamientoArchivosForm.get('telefono_tipo').setValue("Celular de trabajo");
          } else {
            this.RefinanciamientoArchivosForm.get('telefono_tipo').setValue("Teléfono de " + res['data'].telefonos[0].tipo);
          }
        }else{
          this.RefinanciamientoArchivosForm.get('telefono_numero').setValue("No registra")
          this.RefinanciamientoArchivosForm.get('telefono_tipo').setValue("No registra")
        }
      }else{
        this.RefinanciamientoArchivosForm.get('telefono_numero').setValue(" No registra ")
        this.RefinanciamientoArchivosForm.get('telefono_tipo').setValue(" No registra ")
      }
    });
  }

  ObtenerNumeroCelular(id){
    this.CServicios.BuscarCelular(id).subscribe(res=>{
      if (res){
        this.RefinanciamientoArchivosForm.get('telefono_whatsapp').setValue(res);
      } else {
        this.RefinanciamientoArchivosForm.get('telefono_whatsapp').setValue(0);
      }
    })
  }

  ObtenerCuenta(id){
    this.CServicios.ListarCuenta( id, '1',1,1).subscribe(res => {
      // console.log(res)
      if(res['codigo']==0){
        if (res['data']) {
          this.RefinanciamientoArchivosForm.get('cuenta_banco').setValue(res['data'].cuentas[0].nombre_banco);
          this.RefinanciamientoArchivosForm.get('cuenta_numero').setValue(res['data'].cuentas[0].cuenta_numero);
        }else{
          this.RefinanciamientoArchivosForm.get('cuenta_banco').setValue("")
          this.RefinanciamientoArchivosForm.get('cuenta_numero').setValue("")
        }
      }else{
        this.RefinanciamientoArchivosForm.get('cuenta_banco').setValue("")
        this.RefinanciamientoArchivosForm.get('cuenta_numero').setValue("")
      }
    });
  }

  ObtenerDatosCooperativa(){
    let i = 0;
    this.AServicios.ObtenerInformacion().subscribe(res=>{
      this.informacion_cooperativa=res;
      this.cooperativa_nombre=this.informacion_cooperativa['cooperativa'].find(e => e.parametro=="nombre").valor;
      this.penalidad_porcentaje=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_porcentaje").valor;
      this.penalidad_maxima_cuota=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_cuota_maxima").valor;
      this.contrato_dias_premura=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="transaccion_contrato_dias_premura").valor;
      this.RefinanciamientoArchivosForm.get('dias_premura').setValue(this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="transaccion_contrato_dias_premura").valor);
      this.cooperativa_cuenta_banco=this.informacion_cooperativa['cuenta'].banco;
      this.cooperativa_cuenta_numero=this.informacion_cooperativa['cuenta'].cuenta;
      this.cooperativa_contacto=this.informacion_cooperativa['contacto'];

      let array_comodin = this.informacion_cooperativa['direccion_transaccion'].filter(e=>e.id_tipo==2);
      this.cooperativa_direccion_1=array_comodin[0].direccion;
      this.cooperativa_direccion_2=array_comodin[1].direccion;
      this.cooperativa_direccion_3=array_comodin[2].direccion;
      this.cooperativa_direccion_4=array_comodin[3].direccion;

      this.informacion_cooperativa['direccion_transaccion'].forEach((item)=>{
        if(item.id_tipo=1) {
          this.cooperativa_direccion=item.direccion;
        }
      });
      this.presidente_nombre = this.informacion_cooperativa['presidente'].nombre;
      this.presidente_dni = this.informacion_cooperativa['presidente'].documento;
      this.presidente_direccion = this.informacion_cooperativa['presidente'].direccion;
    })
  }

  GenerarArchivos(){
    let ahora = (new Date()).getTime();
    // console.log(this.cronograma);
    this.generados = false ;

    this.ddjj = "" ;
    this.autorizacion = "" ;
    this.compromiso = "" ;
    this.transaccion = "" ;
    this.tarjeta = "" ;

    this.GenerarDDJJ("DDJJ_"+ahora);
    this.GenerarCompromiso("Compromiso_"+ahora);

    if(this.RefinanciamientoArchivosForm.value.email && this.RefinanciamientoArchivosForm.value.codigo){
      this.GenerarAutorizacion("Autorizacion_"+ahora);
    }

    // if(this.RefinanciamientoArchivosForm.value.cuenta_numero){
    //   this.GenerarTarjeta("Tarjeta_"+ahora);
    // }

    if(this.RefinanciamientoArchivosForm.value.email && this.RefinanciamientoArchivosForm.value.casilla){
      this.GenerarTransaccion("Transaccion_"+ahora);
    }

    if(this.RefinanciamientoArchivosForm.value.hay_garante){
      this.GenerarArchivosAval(ahora);
    }

  }

  GenerarDDJJ(nombre_archivo){
    this.AServicios.GenerarDDJJ(
      this.RefinanciamientoArchivosForm.value.plantilla_ddjj,
      nombre_archivo,
      this.RefinanciamientoArchivosForm.value.nombre,
      this.RefinanciamientoArchivosForm.value.dni,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.distrito_cliente : this.informacion_cooperativa['direccion_ddjj'].distrito,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.direccion_cliente : this.informacion_cooperativa['direccion_ddjj'].direccion,
      this.RefinanciamientoArchivosForm.value.lugar,
      this.RefinanciamientoArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.ddjj=res['data'];
      }
    })
  }

  GenerarAutorizacion(nombre_archivo){

    let monto_cuota : number = 0;
    this.Cronograma.forEach((item)=>{
      if( item.monto > monto_cuota) {
        monto_cuota = item.monto ;
      }
    })

    this.AServicios.GenerarAutorizacion(
      this.RefinanciamientoArchivosForm.value.plantilla_autorizacion,
      nombre_archivo,
      this.cooperativa_nombre,
      "2",
      this.RefinanciamientoArchivosForm.value.nombre,
      this.RefinanciamientoArchivosForm.value.cargo_estado,
      this.RefinanciamientoArchivosForm.value.dni,
      this.RefinanciamientoArchivosForm.value.cip,
      this.RefinanciamientoArchivosForm.value.codigo,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.direccion_cliente : this.informacion_cooperativa['direccion_ddjj'].direccion,
      this.RefinanciamientoArchivosForm.value.telefono_tipo,
      this.RefinanciamientoArchivosForm.value.telefono_numero,
      this.RefinanciamientoArchivosForm.value.email,
      this.RefinanciamientoArchivosForm.value.subsede,
      0,
      monto_cuota,
      this.RefinanciamientoCronogramaForm.value.numero_cuotas,
      this.RefinanciamientoArchivosForm.value.lugar,
      this.RefinanciamientoArchivosForm.value.fecha_letras,
      this.RefinanciamientoArchivosForm.value.parametro_autorizacion_1 ,
      this.RefinanciamientoArchivosForm.value.parametro_autorizacion_2 ,
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.autorizacion=res['data'];
      }
    })
  }

  GenerarTransaccion(nombre_archivo){

    let monto_cuota : number = 0;
    this.Cronograma.forEach((item)=>{
      if( item.monto > monto_cuota) {
        monto_cuota = item.monto ;
      }
    })

    this.AServicios.GenerarTransaccion(
      this.RefinanciamientoArchivosForm.value.plantilla_transaccion,
      nombre_archivo,
      this.RefinanciamientoArchivosForm.value.parametro_condicion ,
      this.RefinanciamientoArchivosForm.value.parametro_domicilio ,
      this.RefinanciamientoArchivosForm.value.parametro_autorizacion_1 ,
      this.RefinanciamientoArchivosForm.value.parametro_autorizacion_2 ,
      this.cooperativa_nombre,
      this.cooperativa_direccion,
      this.cooperativa_direccion_1,
      this.cooperativa_direccion_2,
      this.cooperativa_direccion_3,
      this.cooperativa_direccion_4,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.presidente_nombre,
      this.presidente_dni,
      this.presidente_direccion,
      this.RefinanciamientoArchivosForm.value.nombre,
      this.RefinanciamientoArchivosForm.value.cargo_estado,
      this.RefinanciamientoArchivosForm.value.dni,
      this.RefinanciamientoArchivosForm.value.cip,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.direccion_cliente : this.informacion_cooperativa['direccion_ddjj'].direccion,
      this.RefinanciamientoArchivosForm.value.casilla,
      this.RefinanciamientoArchivosForm.value.subsede,
      this.RefinanciamientoArchivosForm.value.fecha,
      this.RefinanciamientoArchivosForm.value.dias_premura,
      Math.round(this.RefinanciamientoCronogramaForm.value.total*100)/100,
      Math.round(monto_cuota*100)/100,
      this.RefinanciamientoCronogramaForm.value.numero_cuotas,
      this.penalidad_porcentaje,
      this.penalidad_maxima_cuota,
      this.RefinanciamientoArchivosForm.value.cuenta_banco,
      this.RefinanciamientoArchivosForm.value.cuenta_numero,
      this.RefinanciamientoArchivosForm.value.email,
      this.RefinanciamientoArchivosForm.value.telefono_whatsapp,
      this.RefinanciamientoArchivosForm.value.lugar,
      this.RefinanciamientoArchivosForm.value.vendedor,
      this.RefinanciamientoArchivosForm.value.vendedor_dni,
      this.Cronograma,
      1,
      [],
      this.RefinanciamientoArchivosForm.value.hay_garante ? this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.nombre : "0",
      this.RefinanciamientoArchivosForm.value.hay_garante ? this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.dni : "0",
    ).subscribe(res=>{
      console.log(res);
      this.generados=true;
      this.transaccion=res['data'];
    })
  }

  GenerarCompromiso(nombre_archivo){
    this.AServicios.GenerarCompromiso(
      this.RefinanciamientoArchivosForm.value.plantilla_compromiso,
      nombre_archivo,
      this.cooperativa_nombre,
      this.RefinanciamientoArchivosForm.value.nombre,
      this.RefinanciamientoArchivosForm.value.dni,
      this.RefinanciamientoArchivosForm.value.cip,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.cooperativa_contacto,
      this.RefinanciamientoArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.compromiso=res['data'];
      }
    })
  }

  AbrirArchivo(nombre_archivo){
    this.AServicios.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      // console.log(res);
      saveAs(res, nombre_archivo+'.docx');
    })
  }

  // Todo lo del garante
  CrearGarante(): FormGroup{
    return this.Builder.group({
      id_cliente: [{value: null, disabled: false}, [
      ]],
      nombre: [{value: null, disabled: false}, [
      ]],
      subsede: [{value: null, disabled: false}, [
      ]],
      direccion: [{value: null, disabled: false}, [
      ]],
      direccion_resumen: [{value: null, disabled: false}, [
      ]],
      provincia: [{value: null, disabled: false}, [
      ]],
      distrito: [{value: null, disabled: false}, [
      ]],
      dni: [{value: null, disabled: false}, [
      ]],
      cip: [{value: null, disabled: false}, [
      ]],
      codigo: [{value: null, disabled: false}, [
      ]],
      telefono_numero: [{value: null, disabled: false}, [
      ]],
      telefono_tipo: [{value: null, disabled: false}, [
      ]],
      plantilla_ddjj: [{value: null, disabled: false}, [
      ]],
      plantilla_autorizacion: [{value: null, disabled: false}, [
      ]],
      plantilla_transaccion: [{value: null, disabled: false}, [
      ]],
      plantilla_compromiso: [{value: null, disabled: false}, [
      ]],
    })
  }

  AgregarGarante():void{
    this.garantes = this.RefinanciamientoArchivosForm.get('garantes') as FormArray;
    this.garantes.push(this.CrearGarante());
    // this.VentasForm['controls'].garantes['controls'].forEach((item, index)=>{
    //   console.log(item.dni_editar)
    // })
  };

  EliminarGarante(index){
    this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('id_cliente').setValue(null);
    this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('nombre').setValue("");
    this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('dni').setValue("");
    this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('subsede').setValue("");
  }

  SeleccionarGarante(index){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px",
      data: {cliente : this.RefinanciamientoArchivosForm.value.id_cliente}
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        console.log(res);
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('id_cliente').setValue(res.id);
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('nombre').setValue(res.nombre);
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('dni').setValue(res.dni);
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('subsede').setValue(res.subsede);
        this.ObtenerDireccionGarante(res.id,index);
        this.ObtenerTelefonoGarante(res.id,index);
        this.CServicios.Seleccionar(res.id).subscribe(res=>{
          console.log(res)
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('plantilla_ddjj').setValue(res.plantilla_ddjj) ;
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('plantilla_autorizacion').setValue(res.plantilla_autorizacion) ;
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('plantilla_compromiso').setValue(res.plantilla_compromiso) ;
        })
      }
    })
  }

  ObtenerDireccionGarante(id_cliente, index) {
    this.DServicios.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('direccion').setValue(res['data'].direcciones[0].direccioncompleta)
      }
      if(res['codigo']==0){
        if (res['data']) {
          this.distrito_aval = res['data'].direcciones[0].distrito;
          this.direccion_aval = res['data'].direcciones[0].direccion_formateada;

          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('direccion_resumen').setValue(res['data'].direcciones[0].direccion);
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('provincia').setValue(res['data'].direcciones[0].provincia);

          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('distrito').setValue(this.distrito_aval);
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('direccion').setValue(this.direccion_aval);
        } else {
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('direccion').setValue("No registra");
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('distrito').setValue("");
        }
      } else {
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('direccion').setValue(" No registra ");
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('distrito').setValue("");
      }
    });
  }

  ObtenerTelefonoGarante(id_cliente, index) {
    this.TServicios.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if(res['codigo']==0){
        if (res['data']) {
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('telefono_numero').setValue(res['data'].telefonos[0].tlf_numero);
          if(res['data'].telefonos[0].id_tipo==1){
            this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('telefono_tipo').setValue("Celular de trabajo");
          } else {
            this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('telefono_tipo').setValue("Teléfono de " + res['data'].telefonos[0].tipo);
          }
        }else{
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('telefono_numero').setValue("No registra")
          this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('telefono_tipo').setValue("No registra")
        }
      }else{
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('telefono_numero').setValue(" No registra ")
        this.RefinanciamientoArchivosForm['controls'].garantes['controls'][index].get('telefono_tipo').setValue(" No registra ")
      }
    });
  }

  EditarContactoGarante(id_cliente, index){
    let VentanaContacto = this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: id_cliente
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      this.ObtenerDireccionGarante(id_cliente,index);
    })
  }

  GenerarArchivosAval(codigo){

    this.autorizacion_aval = "" ;
    this.ddjj_aval = "" ;
    this.carta_aval = "" ;
    this.compromiso_aval = "" ;

    let nombre_archivo : string = "_Aval_" + codigo ;

    this.GenerarAutorizacionAval("Autorizacion"+nombre_archivo) ;
    this.GenerarDDJJAval("DDJJ"+nombre_archivo) ;
    this.GenerarCompromisoAval("Compromiso"+nombre_archivo) ;
    this.GenerarCartaAval("Carta" + nombre_archivo);
  }

  GenerarAutorizacionAval(nombre_archivo){

    let monto_cuota : number = 0;
    this.Cronograma.forEach((item)=>{
      if( item.monto > monto_cuota) {
        monto_cuota = item.monto ;
      }
    })

    this.AServicios.GenerarAutorizacion(
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.plantilla_autorizacion,
      nombre_archivo,
      this.cooperativa_nombre,
      "2",
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.nombre,
      this.RefinanciamientoArchivosForm.value.cargo_estado,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.dni,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.cip,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.codigo,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.direccion_aval : this.informacion_cooperativa['direccion_ddjj'].direccion,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.telefono_tipo,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.telefono_numero,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.email,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.subsede,
      0,
      monto_cuota,
      this.RefinanciamientoCronogramaForm.value.numero_cuotas,
      this.RefinanciamientoArchivosForm.value.lugar,
      this.RefinanciamientoArchivosForm.value.fecha_letras,
      this.RefinanciamientoArchivosForm.value.parametro_autorizacion_1 ,
      this.RefinanciamientoArchivosForm.value.parametro_autorizacion_2 ,
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.autorizacion_aval=res['data'];
      }
    })
  }

  GenerarDDJJAval(nombre_archivo){
    this.AServicios.GenerarDDJJ(
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.plantilla_ddjj,
      nombre_archivo,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.nombre,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.dni,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.distrito_aval : this.informacion_cooperativa['direccion_ddjj'].distrito,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.direccion_aval : this.informacion_cooperativa['direccion_ddjj'].direccion,
      this.RefinanciamientoArchivosForm.value.lugar,
      this.RefinanciamientoArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        // this.generados=true;
        this.ddjj_aval=res['data'];
      }
    })
  }

  GenerarCompromisoAval(nombre_archivo){
    this.AServicios.GenerarCompromiso(
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.plantilla_compromiso,
      nombre_archivo,
      this.cooperativa_nombre,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.nombre,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.dni,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.cip,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.cooperativa_contacto,
      this.RefinanciamientoArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        // this.generados=true;
        this.compromiso_aval=res['data'];
      }
    })
  }

  GenerarCartaAval(nombre_archivo){
    this.AServicios.GenerarCarta(
      nombre_archivo,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.nombre,
      this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.dni,
      this.RefinanciamientoArchivosForm.value.considerar_direccion_cliente ? this.direccion_aval : this.informacion_cooperativa['direccion_ddjj'].direccion,
      this.RefinanciamientoArchivosForm.value.nombre,
      this.RefinanciamientoArchivosForm.value.dni,
      this.RefinanciamientoArchivosForm.value.lugar,
      this.RefinanciamientoArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        // this.generados=true;
        this.carta_aval=res['data'];
      }
    })
  }

  Guardar(){
    let id_cliente = this.RefinanciamientoSeleccionForm.value.id_cliente ;

    let data = {
      id_vendedor : this.RefinanciamientoArchivosForm.value.id_vendedor ,
      vendedor : this.RefinanciamientoArchivosForm.value.vendedor ,
      capital : this.RefinanciamientoCronogramaForm.value.capital ,
      interes : this.RefinanciamientoCronogramaForm.value.interes ,
      cuotas : this.RefinanciamientoCronogramaForm.value.numero_cuotas ,
      total : this.RefinanciamientoCronogramaForm.value.total ,
      fecha_prestamo : this.RefinanciamientoCronogramaForm.value.fecha_prestamo ,
      fecha_inicio : this.RefinanciamientoCronogramaForm.value.fecha_inicio ,
      aval : this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.id_cliente ,
      aval_nombre : this.RefinanciamientoArchivosForm['controls'].garantes['controls'][0].value.nombre ,
      transacciones : this.Transacciones ,
      cronograma : this.Cronograma
    }

    this.route.navigate(['/creditos', 'nuevo', 'refinanciamiento', id_cliente ], {state: data } )
  }

}

export class RefinanciamientoDataSource implements DataSource<any> {

  public InformacionTransacciones = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public Cronograma : Array<any> = [] ;

  constructor(
    private Servicio: RefinanciamientoService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTransacciones.asObservable();
  }

  disconnect() {
    this.InformacionTransacciones.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    cliente:number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarTransacciones( cliente )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.Cronograma = res['mensaje'];
      this.InformacionTransacciones.next(res['data'].transacciones);
    });
  }

}

export class CronogramaDataSource implements DataSource<any> {

  public InformacionTransacciones = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public Cronograma : Array<any> = [] ;

  constructor(
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTransacciones.asObservable();
  }

  disconnect() {
    this.InformacionTransacciones.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion( array ) {
    this.InformacionTransacciones.next( array );
  }

}