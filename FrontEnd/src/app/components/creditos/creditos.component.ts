import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CreditosService } from './creditos.service';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatDialog, MatSort } from '@angular/material';
import {ServiciosTipoPago} from '../global/tipopago';
import {ClienteService } from '../clientes/clientes.service';
import { forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {ServiciosTelefonos} from '../global/telefonos';
import {ServiciosDirecciones,} from '../global/direcciones';
import {ServiciosGenerales} from '../global/servicios';
import * as moment from 'moment';
import {Location} from '@angular/common';
import {Notificaciones} from '../global/notificacion';
import {URLIMAGENES} from '../global/url'
import {SeleccionarClienteComponent} from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaEmergenteContacto} from '../clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import { ReglasEvaluacionService } from '../tablas-maestras/reglas-evaluacion/reglas-evaluacion.service';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss'],
  providers: [CreditosService, ClienteService, ServiciosDirecciones, ServiciosTelefonos, ServiciosGenerales, ServiciosTipoPago, ReglasEvaluacionService]
})
export class CreditosComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public CreditosForm: FormGroup
  public id_credito: number;
  public id_credito_editar: number;
  public id_cliente: number;
  public garantes: FormArray;
  public editar_cronograma:number;
  public Reglas : Array<any>;
  public ruta: string;

  public ListadoCronograma: CronogramaDataSource;
  public ColumnasCronograma: Array<string>;
  public Cronograma: Array<any> = [];
  public total_cronograma_editado: number;
  public diferencia: number;

  public foto : string = "";
  public dni : string = "";
  public cip : string = "";
  public planilla : string = "";
  public voucher : string = "";
  public recibo : string = "";
  public casilla : string = "";
  public transaccion : string = "";
  public autorizacion : string = "";
  public tarjeta : string = "";
  public compromiso : string = "";
  public letra : string = "";
  public ddjj : string = "";

  @ViewChild('InputCapital') FiltroCapital: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;
  @ViewChild('Vendedor') VendedorAutoComplete: ElementRef;
  @ViewChild('Autorizador') AutorizadorAutoComplete: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  public ListadoVendedores: Array<any>;
  public ListadoAudorizadores: Array<any>;
  public ListadoSucursales: Array<any>;
  public ListadoTipoPago: Array<any>;

  constructor(
    private Servicio: CreditosService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private TelefonoServicio: ServiciosTelefonos,
    private ServiciosGenerales: ServiciosGenerales,
    private ServicioTipoPago: ServiciosTipoPago,
    private RServicio: ReglasEvaluacionService,
    private location: Location,
    private Builder: FormBuilder,
    private Dialogo: MatDialog,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {

    this.CrearFormulario();

    // Se cargan los arrays del inicio
    this.ListarVendedor("");
    this.ListarAutorizador("");
    this.ListarTipoPago();
    this.ListarSucursales();
    this.ListarReglas();    

    this.ruta=URLIMAGENES.urlimages;

    this.editar_cronograma = 3;
    this.ListadoCronograma = new CronogramaDataSource();

    this.route.params.subscribe(params => {
      // Verifica si 'params' tiene datos
      console.log(params);

      if(Object.keys(params).length>0){

        this.Cargando.next(true);

        if(params['idcredito']){
          this.id_credito=params['idcredito'];
          this.SeleccionarCredito(this.id_credito);
        }

        if(params['idcreditoeditar']){
          this.id_credito_editar=params['idsalidaeditar'];
          this.SeleccionarCredito(this.id_credito_editar);
        }

      }else{
       this.NuevoCredito();
      }
    })

  }

  ngAfterViewInit(): void {

    if (this.id_credito) {
      this.sort.sortChange
      .pipe(
        tap(() =>{
          this.ObtenerCronograma(this.id_credito, this.sort.active + " " + this.sort.direction)
        })
      ).subscribe();
    }

    if(!this.id_credito){

      fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarVendedor(this.CreditosForm.value.vendedor);
        })
       ).subscribe();
  
       fromEvent(this.AutorizadorAutoComplete.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarAutorizador(this.CreditosForm.value.autorizador);
        })
       ).subscribe();
  
       merge(
        fromEvent(this.FiltroCuota.nativeElement,'keyup'),
        fromEvent(this.FiltroCapital.nativeElement,'keyup')
      ).pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          if (
            // this.FiltroMonto.nativeElement.value &&
            this.FiltroCapital.nativeElement.value &&
            this.FiltroCuota.nativeElement.value &&
            this.CreditosForm.value.fecha_pago
          ) {
            this.CrearCronograma()
          }
        })
      ).subscribe()
    }

  }

  CrearFormulario(){
    this.CreditosForm = this.Builder.group({
      id_cliente :[{value: null, disabled: false},[
        Validators.required
      ]],
      cliente :[{value: null, disabled: false},[
      ]],
      cargo :[{value: null, disabled: false},[
        Validators.required
      ]],
      trabajo :[{value: null, disabled: false},[
        Validators.required
      ]],
      direccion :[{value: null, disabled: false},[
        Validators.required
      ]],
      telefono :[{value: null, disabled: false},[
        Validators.required
      ]],
      garante :[{value: false, disabled: false},[
      ]],
      fecha_credito: [{value: new Date(), disabled: false},[
        Validators.required
      ]],
      sucursal: [{value: null, disabled: false},[
        Validators.required
      ]],
      codigo: [{value: null, disabled: false},[
        Validators.required
      ]],
      fecha_pago: [{value: moment(new Date()).add(1, 'months').toDate(), disabled: false},[
        Validators.required
      ]],
      ////////
      tipo_pago: [{value: null, disabled: false},[
        Validators.required
      ]],
      interes: [{value: 0, disabled: false},[
        Validators.required,
        Validators.min(1)
      ]],
      capital: [{value: null, disabled: false},[
        Validators.required
      ]],
      cuotas: [{value: null, disabled: false},[
        Validators.required
      ]],
      total: [{value: null, disabled: false},[
        Validators.required
      ]],
      id_vendedor: [{value: null, disabled: false},[
        Validators.required
      ]],
      vendedor: [{value: null, disabled: false},[
      ]],
      id_autorizador: [{value: null, disabled: false},[
        // Validators.required
      ]],
      autorizador: [{value: null, disabled: false},[
      ]],
      observaciones: [{value: "", disabled: false},[
      ]],
      garantes: this.Builder.array([])
    })
  }

  NuevoCredito(){

    this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];

    this.ObtenerNumero();
  }

  ObtenerNumero(){
    this.Servicio.Proximo().subscribe(res=>{

      let codigo_string: string = res.toString();
      let codigo_string_length: number = res.toString().length;

      for( let i = codigo_string_length ; i < 6 ; i++ ){
        codigo_string = "0" + codigo_string;
      }

      this.CreditosForm.get('codigo').setValue(codigo_string);
    })
  }

  SeleccionarCredito(id_credito){
    
    let observacion_corregida : string;
    let codigo_string : string;
    let codigo_largo : number;

    this.Servicio.Seleccionar(id_credito).subscribe(res=>{
      this.Cargando.next(false);
      
      /////////////////////////////////////////////////////////
      // Se da el formato al código
      codigo_string=res.numero.toString();
      codigo_largo=codigo_string.length;

      for(let i = codigo_largo; i < 7; i++){
        codigo_string = "0" + codigo_string;
      }
      
      this.CreditosForm.get('codigo').setValue(codigo_string);
      this.CreditosForm.get('codigo').disable()
      /////////////////////////////////////////////////////////

      this.CreditosForm.get('id_cliente').setValue(res.id_cliente);
      this.CreditosForm.get('fecha_credito').setValue(res.fecha);
      this.CreditosForm.get('cliente').setValue(res.cliente);
      this.CreditosForm.get('cargo').setValue(res.cliente_cargo);
      this.CreditosForm.get('trabajo').setValue(res.cliente_trabajo);
      this.CreditosForm.get('direccion').setValue(res.cliente_direccion);
      this.CreditosForm.get('telefono').setValue(res.cliente_telefono);
      this.CreditosForm.get('fecha_pago').setValue(res.fecha_pago);
      this.CreditosForm.get('interes').setValue(res.interes);
      this.CreditosForm.get('capital').setValue(res.capital);
      this.CreditosForm.get('cuotas').setValue(res.numero_cuotas);
      this.CreditosForm.get('total').setValue(res.total);

      this.CreditosForm.get('vendedor').setValue(res.vendedor);
      this.CreditosForm.get('id_vendedor').setValue(res.id_vendedor);
      this.CreditosForm.get('autorizador').setValue(res.autorizador);
      this.CreditosForm.get('id_autorizador').setValue(res.id_autorizador);

      observacion_corregida = res.observaciones == "" ? "No hay observaciones" : res.observaciones;

      if( this.id_credito ) {

        this.CreditosForm.get('sucursal').setValue(res.sucursal);
        this.CreditosForm.get('tipo_pago').setValue(res.tipo_pago);
        this.CreditosForm.get('observaciones').setValue(observacion_corregida);

        this.ColumnasCronograma= ['numero', 'monto_cuota','fecha_vencimiento', 'monto_interes','monto_pagado', 'fecha_cancelacion', 'monto_pendiente','estado', 'opciones'];
        this.ObtenerCronograma(this.id_credito, "fecha_vencimiento asc");

      }

      if ( this.id_credito_editar ) {

        this.CreditosForm.get('sucursal').setValue(res.id_sucursal);
        this.CreditosForm.get('tipo_pago').setValue(res.id_tipo_pago);
        this.CreditosForm.get('observaciones').setValue(res.observaciones);

        this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
        this.Cronograma = res.cronograma;
        this.ListadoCronograma.AsignarInformacion(this.Cronograma);
      }

    })

  }

  ObtenerCronograma(id_credito, orden){
    this.Servicio.ObtenerCrongrama(id_credito, orden).subscribe(res=>{
      this.Cronograma = res.creditos;
      this.ListadoCronograma.AsignarInformacion(this.Cronograma);
    })
  }

  ListarReglas(){
    this.RServicio.ListarReglas().subscribe(res=>{
      this.Reglas=res;
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CreditosForm.get('id_cliente').setValue(res.id);
        this.ObtenerClientexId(res.id);
        this.ObtenerDireccion(res.id);
        this.ObtenerTelefono(res.id);
        this.VerificarAfiliacion(res.id);
      }
    })
  }

  VerificarAfiliacion(id_cliente){
    this.Servicio.Verificar_Afiliacion(id_cliente).subscribe(res=>{
      // console.log(res);
      if(res['total_pagado']){
        this.VerificarInteres(res['total_pagado']);
      }else{
        this.VerificarInteres(0);
      }
    })
  }

  VerificarInteres(monto){
    this.Servicio.Verificar_Interes(monto).subscribe(res=>{
      // console.log(res);
      this.CreditosForm.get('interes').setValue(res);
    })
  }

  ObtenerClientexId(id_cliente) {

    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        // console.log(res)
        this.CreditosForm.get('cliente').setValue(res.nombre);
        this.CreditosForm.get('cargo').setValue(res.cargo);
        this.CreditosForm.get('trabajo').setValue(res.trabajo);
        this.Cargando.next(false);
      }
    });
  }

  ObtenerDireccion(id_cliente) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm.get('direccion').setValue(res['data'].direcciones[0].direccioncompleta);
      }
    });
  }

  ObtenerTelefono(id_cliente) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
      }
    });
  }

  RemoverCliente(){
    this.CreditosForm.get('id_cliente').setValue(null);
    this.CreditosForm.get('cargo').setValue("");
    this.CreditosForm.get('trabajo').setValue("");
    this.CreditosForm.get('direccion').setValue("");
    this.CreditosForm.get('telefono').setValue("");
  }
  
  EditarContactoCliente(){

    let id_cliente = this.CreditosForm.value.id_cliente ? this.CreditosForm.value.id_cliente : this.id_cliente;

    let VentanaContacto = this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: id_cliente
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      this.ObtenerDireccion(id_cliente);
      this.ObtenerTelefono(id_cliente);
    })
  }

  HayGarante(evento){
    if(evento.checked){
      if(this.id_credito_editar){
        this.AgregarGarante(true)
      }else{
        this.AgregarGarante(false)
      }
    }else{
      if(this.CreditosForm['controls'].garantes['controls'].length>1){
        this.EliminarGarante(1);
        this.EliminarGarante(0);
      }else{
        this.EliminarGarante(0);
      }
      // this.CreditosForm['controls'].garantes['controls'].forEach((item,index)=>{
      //   this.EliminarGarante(index)
      // })
    }
  }

  CrearGarante(bool): FormGroup{
    return this.Builder.group({
      'id_cliente': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'nombre': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'direccion': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'telefono': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'dni_pdf': [{value: null, disabled: false}, [
      ]],
      'cip_pdf': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf': [{value:null, disabled: false}, [
      ]],
      'letra_pdf': [{value: null, disabled: false}, [
      ]],
      'transaccion_pdf': [{value:null, disabled: false}, [
      ]],
      'dni_editar': [{value: bool, disabled: false}, [
      ]],
      'cip_editar': [{value: bool, disabled: false}, [
      ]],
      'planilla_editar': [{value:bool, disabled: false}, [
      ]],
      'letra_editar': [{value: bool, disabled: false}, [
      ]],
      'transaccion_editar': [{value:bool, disabled: false}, [
      ]],
      'dni_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_antiguo': [{value:null, disabled: false}, [
      ]],
      'letra_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'transaccion_pdf_antiguo': [{value:null, disabled: false}, [
      ]],
      'dni_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_nuevo': [{value:null, disabled: false}, [
      ]],
      'letra_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'transaccion_pdf_nuevo': [{value:null, disabled: false}, [
      ]],
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  AgregarGarante(bool):void{
    this.garantes = this.CreditosForm.get('garantes') as FormArray;
    this.garantes.push(this.CrearGarante(bool));
  };

  EliminarGarante(index){
    this.garantes.removeAt(index);
  }

  ListarSucursales(){
    this.ServiciosGenerales.ListarSucursal(null,"").subscribe(res=>{
      this.ListadoSucursales=res
    })
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago().subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoVendedores=res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.CreditosForm.value.vendedor.nombre;
    this.CreditosForm.get('id_vendedor').setValue(this.CreditosForm.value.vendedor.id);
    this.CreditosForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.CreditosForm.get('id_vendedor').setValue(null);
    this.CreditosForm.get('vendedor').setValue("");
  }

  ListarAutorizador(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoAudorizadores=res;
    });
  }

  AutorizadorSeleccionado(){
    let nombre_auorizador= this.CreditosForm.value.autorizador.nombre;
    this.CreditosForm.get('id_autorizador').setValue(this.CreditosForm.value.autorizador.id);
    this.CreditosForm.get('autorizador').setValue(nombre_auorizador);
  }

  RemoverAutorizador(){
    this.CreditosForm.get('id_autorizador').setValue(null);
    this.CreditosForm.get('autorizador').setValue("");
  }

  SubirArchivo(evento, orden){
    if ( orden == 1 ) this.foto = evento.serverResponse.response.body.data;
    if ( orden == 2 ) this.dni = evento.serverResponse.response.body.data;
    if ( orden == 3 ) this.cip = evento.serverResponse.response.body.data;
    if ( orden == 4 ) this.planilla = evento.serverResponse.response.body.data;
    if ( orden == 5 ) this.voucher = evento.serverResponse.response.body.data;
    if ( orden == 6 ) this.recibo = evento.serverResponse.response.body.data;
    if ( orden == 7 ) this.casilla = evento.serverResponse.response.body.data;
    if ( orden == 8 ) this.transaccion = evento.serverResponse.response.body.data;
    if ( orden == 9 ) this.autorizacion = evento.serverResponse.response.body.data;
    if ( orden == 10 ) this.tarjeta = evento.serverResponse.response.body.data;
    if ( orden == 11 ) this.compromiso = evento.serverResponse.response.body.data;
    if ( orden == 12 ) this.letra = evento.serverResponse.response.body.data;
    if ( orden == 13 ) this.ddjj = evento.serverResponse.response.body.data;
  }

  /*Cronograma */
  CrearCronograma(){

    this.CreditosForm.get('total').setValue(+this.CreditosForm.value.capital * ( 1 + +this.CreditosForm.value.cuotas * this.CreditosForm.value.interes / 100 ) )

    this.Cronograma=[];

    let year = moment(this.CreditosForm.value.fecha_pago).year();
    let month = moment(this.CreditosForm.value.fecha_pago).month();
    let day = moment(this.CreditosForm.value.fecha_pago).date();

    let fecha_corregida:Date = new Date(year, month, day);

    let fecha:Date;

    let monto=Math.round((this.CreditosForm.value.total)*100/this.FiltroCuota.nativeElement.value)/100

    for (var i = 1; i<=this.FiltroCuota.nativeElement.value; i++) {

      fecha=moment(fecha_corregida).add(i-1, 'months').toDate();

      this.Cronograma.push({
        numero: i,
        fecha_vencimiento: fecha,
        monto_cuota: monto
      })

    }

    this.CalcularTotalCronograma();
    this.ListadoCronograma.AsignarInformacion(this.Cronograma);

  }

  CalcularTotalCronograma(){
    
    this.total_cronograma_editado=0;
    
    this.Cronograma.forEach((item)=>{
      this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
    })

    this.diferencia=this.CreditosForm.value.total-this.total_cronograma_editado;
  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  Atras(){
    this.location.back()
  }

  Guardar(){
    this.CrearCredito();
  }

  CrearCredito(){

    this.ObtenerNumero();

    let random=(new Date()).getTime()

    return forkJoin(
      this.ServiciosGenerales.RenameFile(this.foto,'FOTO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.dni,'DNI',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.cip,'CIP',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla,'PLANILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher,'VOUCHER',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo,'RECIBO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla,'CASILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion,'TRANSACCION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion,'AUTORIAZACION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta,'TARJETA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso,'COMPROMISO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.letra,'LETRA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj,'DDJJ',random.toString(),"credito"),
    ).subscribe(resultado=>{

      this.Servicio.Crear(
        2,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
        +this.CreditosForm.value.codigo,
        this.CreditosForm.value.id_autorizador,
        this.CreditosForm.value.id_vendedor,
        this.CreditosForm.value.id_cliente,
        this.CreditosForm.value.direccion,
        this.CreditosForm.value.telefono,
        this.CreditosForm.value.cargo,
        this.CreditosForm.value.trabajo,
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.fecha_pago,
        this.CreditosForm.value.interes,
        this.CreditosForm.value.capital,
        this.CreditosForm.value.cuotas,
        this.CreditosForm.value.total,
        resultado[0].mensaje,
        resultado[1].mensaje,
        resultado[2].mensaje,
        resultado[3].mensaje,
        resultado[4].mensaje,
        resultado[5].mensaje,
        resultado[6].mensaje,
        resultado[7].mensaje,
        resultado[8].mensaje,
        resultado[9].mensaje,
        resultado[10].mensaje,
        resultado[11].mensaje,
        resultado[12].mensaje,
        this.CreditosForm.value.observaciones
      ).subscribe(res=>{
        console.log(res)
  
        this.Cronograma.forEach((item)=>{
          this.Servicio.CrearCronograma(
            res['data'],
            item.monto_cuota,
            item.fecha_vencimiento
          ).subscribe()
        })
  
      })
    })

  }

}

export class CronogramaDataSource implements DataSource<any>{

  private Informacion = new BehaviorSubject<any>([])

  constructor(
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  AsignarInformacion(array){
    this.Informacion.next(array);
  }

}