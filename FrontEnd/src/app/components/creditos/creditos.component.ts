import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CreditosService } from './creditos.service';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatDialog, MatSort } from '@angular/material';
import {ServiciosTipoPago} from '../global/tipopago';
import {ClienteService } from '../clientes/clientes.service';
import { forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
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

  public foto_antiguo : string = "";
  public dni_antiguo : string = "";
  public cip_antiguo : string = "";
  public planilla_antiguo : string = "";
  public voucher_antiguo : string = "";
  public recibo_antiguo : string = "";
  public casilla_antiguo : string = "";
  public transaccion_antiguo : string = "";
  public autorizacion_antiguo : string = "";
  public tarjeta_antiguo : string = "";
  public compromiso_antiguo : string = "";
  public letra_antiguo : string = "";
  public ddjj_antiguo : string = "";

  public foto_nuevo : string = "";
  public dni_nuevo : string = "";
  public cip_nuevo : string = "";
  public planilla_nuevo : string = "";
  public voucher_nuevo : string = "";
  public recibo_nuevo : string = "";
  public casilla_nuevo : string = "";
  public transaccion_nuevo : string = "";
  public autorizacion_nuevo : string = "";
  public tarjeta_nuevo : string = "";
  public compromiso_nuevo : string = "";
  public letra_nuevo : string = "";
  public ddjj_nuevo : string = "";

  public foto_editar : boolean = false;
  public dni_editar : boolean = false;
  public cip_editar : boolean = false;
  public planilla_editar : boolean = false;
  public voucher_editar : boolean = false;
  public recibo_editar : boolean = false;
  public casilla_editar : boolean = false;
  public transaccion_editar : boolean = false;
  public autorizacion_editar : boolean = false;
  public tarjeta_editar : boolean = false;
  public compromiso_editar : boolean = false;
  public letra_editar : boolean = false;
  public ddjj_editar : boolean = false;

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
    private route : ActivatedRoute,
    private Notificacion: Notificaciones,
    private router: Router
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
          // this.id_credito=7;
          this.SeleccionarCredito(this.id_credito);
        }

        if(params['idcreditoeditar']){
          this.id_credito_editar=params['idsalidaeditar'];
          // this.id_credito_editar=7;
          this.SeleccionarCredito(this.id_credito_editar);
        }

      }else{
       this.NuevoCredito();
       console.log(this.CreditosForm.value.id_cliente, this.id_credito, this.id_cliente)
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


      res.pdf_foto!="" ? this.foto=URLIMAGENES.carpeta+'credito/'+res.pdf_foto : null;
      res.pdf_dni!="" ? this.dni=URLIMAGENES.carpeta+'credito/'+res.pdf_dni : null;
      res.pdf_cip!="" ? this.cip=URLIMAGENES.carpeta+'credito/'+res.pdf_cip : null;
      res.pdf_planilla!="" ? this.planilla=URLIMAGENES.carpeta+'credito/'+res.pdf_planilla : null;
      res.pdf_voucher!="" ? this.voucher=URLIMAGENES.carpeta+'credito/'+res.pdf_voucher : null;
      res.pdf_recibo!="" ? this.recibo=URLIMAGENES.carpeta+'credito/'+res.pdf_recibo : null;
      res.pdf_casilla!="" ? this.casilla=URLIMAGENES.carpeta+'credito/'+res.pdf_casilla : null;
      res.pdf_transaccion!="" ? this.transaccion=URLIMAGENES.carpeta+'credito/'+res.pdf_transaccion : null;
      res.pdf_autorizacion!="" ? this.autorizacion=URLIMAGENES.carpeta+'credito/'+res.pdf_autorizacion : null;
      res.pdf_tarjeta!="" ? this.tarjeta=URLIMAGENES.carpeta+'credito/'+res.pdf_tarjeta : null;
      res.pdf_compromiso!="" ? this.compromiso=URLIMAGENES.carpeta+'credito/'+res.pdf_compromiso : null;
      res.pdf_letra!="" ? this.letra=URLIMAGENES.carpeta+'credito/'+res.pdf_letra : null;
      res.pdf_ddjj!="" ? this.ddjj=URLIMAGENES.carpeta+'credito/'+res.pdf_ddjj : null;

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

        this.foto_antiguo=res.pdf_foto;
        this.dni_antiguo=res.pdf_dni;
        this.cip_antiguo=res.pdf_cip;
        this.planilla_antiguo=res.pdf_planilla;
        this.voucher_antiguo=res.pdf_voucher;
        this.recibo_antiguo=res.pdf_recibo;
        this.casilla_antiguo=res.pdf_casilla;
        this.transaccion_antiguo=res.pdf_transaccion;
        this.autorizacion_antiguo=res.pdf_autorizacion;
        this.tarjeta_antiguo=res.pdf_tarjeta;
        this.compromiso_antiguo=res.pdf_compromiso;
        this.letra_antiguo=res.pdf_letra;
        this.ddjj_antiguo=res.pdf_ddjj;

        res.pdf_foto!="" ? this.foto_editar=false : this.foto_editar=true;
        res.pdf_dni!="" ? this.dni_editar=false : this.dni_editar=true;
        res.pdf_cip!="" ? this.cip_editar=false : this.cip_editar=true;
        res.pdf_planilla!="" ? this.planilla_editar=false : this.planilla_editar=true;
        res.pdf_voucher!="" ? this.voucher_editar=false : this.voucher_editar=true;
        res.pdf_recibo!="" ? this.recibo_editar=false : this.recibo_editar=true;
        res.pdf_casilla!="" ? this.casilla_editar=false : this.casilla_editar=true;
        res.pdf_transaccion!="" ? this.transaccion_editar=false : this.transaccion_editar=true;
        res.pdf_autorizacion!="" ? this.autorizacion_editar=false : this.autorizacion_editar=true;
        res.pdf_tarjeta!="" ? this.tarjeta_editar=false : this.tarjeta_editar=true;
        res.pdf_compromiso!="" ? this.compromiso_editar=false : this.compromiso_editar=true;
        res.pdf_letra!="" ? this.letra_editar=false : this.letra_editar=true;
        res.pdf_ddjj!="" ? this.ddjj_editar=false : this.ddjj_editar=true;

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

    if(this.id_credito_editar){
      if ( orden == 1 ) this.foto_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 2 ) this.dni_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 3 ) this.cip_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 4 ) this.planilla_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 5 ) this.voucher_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 6 ) this.recibo_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 7 ) this.casilla_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 8 ) this.transaccion_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 9 ) this.autorizacion_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 10 ) this.tarjeta_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 11 ) this.compromiso_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 12 ) this.letra_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 13 ) this.ddjj_nuevo = evento.serverResponse.response.body.data;
    }else{
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
  }

  /*Cronograma */
  CrearCronograma(){

    let total : number = Math.round(+this.CreditosForm.value.capital * ( 1 + +this.CreditosForm.value.cuotas * this.CreditosForm.value.interes / 100 ) *100 ) / 100

    this.CreditosForm.get('total').setValue( total );

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

    console.log(this.diferencia);
    this.diferencia= Math.abs(Math.round((this.CreditosForm.value.total-this.total_cronograma_editado)*100)/100);

  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  AbrirDocumento(url){
    if(url){
      window.open(url, "_blank");
    }
  }

  Atras(){
    this.location.back()
  }

  Guardar(){
    if(this.id_credito_editar){
      this.ActualizarCredito();
    }else{
      this.CrearCredito();
    }
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
  

        setTimeout(()=>{
          this.router.navigate(['/creditos']);
          if(res['codigo']==0){
            this.Notificacion.Snack("Se creó el crédito con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al crear el crédito","");
          }
        }, 300)

      })
    })

  }

  ActualizarCredito(){

    this.ObtenerNumero();

    let random=(new Date()).getTime()

    return forkJoin(
      this.ServiciosGenerales.RenameFile(this.foto_nuevo,'FOTO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo,'DNI',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo,'CIP',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo,'PLANILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher_nuevo,'VOUCHER',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo_nuevo,'RECIBO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla_nuevo,'CASILLA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo,'TRANSACCION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo,'AUTORIAZACION',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta_nuevo,'TARJETA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso_nuevo,'COMPROMISO',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo,'LETRA',random.toString(),"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj_nuevo,'DDJJ',random.toString(),"credito"),
    ).subscribe(resultado=>{

      // console.log(resultado)

      this.Servicio.Actualizar(
        this.id_credito_editar,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
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
        this.foto_editar ? resultado[0].mensaje : this.foto_antiguo,
        this.dni_editar ? resultado[1].mensaje : this.dni_antiguo,
        this.cip_editar ? resultado[2].mensaje : this.cip_antiguo,
        this.planilla_editar ? resultado[3].mensaje : this.planilla_antiguo,
        this.voucher_editar ? resultado[4].mensaje : this.voucher_antiguo,
        this.recibo_editar ? resultado[5].mensaje : this.recibo_antiguo,
        this.casilla_editar ? resultado[6].mensaje : this.casilla_antiguo,
        this.transaccion_editar ? resultado[7].mensaje : this.transaccion_antiguo,
        this.autorizacion_editar ? resultado[8].mensaje : this.autorizacion_antiguo,
        this.tarjeta_editar ? resultado[9].mensaje : this.tarjeta_antiguo,
        this.compromiso_editar ? resultado[10].mensaje : this.compromiso_antiguo,
        this.letra_editar ? resultado[11].mensaje : this.letra_antiguo,
        this.ddjj_editar ? resultado[12].mensaje : this.ddjj_antiguo,
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
  
        setTimeout(()=>{
          this.router.navigate(['/creditos']);
          if(res['codigo']==0){
            this.Notificacion.Snack("Se actualizó el crédito con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al actualizar el crédito","");
          }
        }, 300)

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