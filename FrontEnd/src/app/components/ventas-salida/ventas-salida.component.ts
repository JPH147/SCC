import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, Inject, ViewChildren, QueryList, Optional } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VentaService} from '../ventas/ventas.service';
import { MatDialog, MatSort } from '@angular/material';
import {ServiciosTipoDocumento, TipoDocumento} from '../global/tipodocumento';
import {ServiciosTipoPago, TipoPago} from '../global/tipopago';
import {ClienteService } from '../clientes/clientes.service';
import {ClienteDataSource} from '../clientes/clientes.dataservice';
import {Observable, forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {ServiciosTelefonos, Telefono} from '../global/telefonos';
import {ServiciosDirecciones, Direccion} from '../global/direcciones';
import {ServiciosGenerales, Talonario, Serie, ListarVendedor} from '../global/servicios';
// import {VentanaProductosComponent} from './ventana-productos/ventana-productos.component';
import { FileHolder } from 'angular2-image-upload';
import * as moment from 'moment';
import {Location} from '@angular/common';
import {Notificaciones} from '../global/notificacion';
import {URLIMAGENES} from '../global/url'
import {VentanaCronogramaComponent} from '../ventas/ventana-cronograma/ventana-cronograma.component';
import {URL} from '../global/url';
import { SalidaVendedoresService } from "../salida-vendedores/salida-vendedores.service";

@Component({
  selector: 'app-ventas-salida',
  templateUrl: './ventas-salida.component.html',
  styleUrls: ['./ventas-salida.component.scss'],
  providers: [VentaService, ServiciosTipoDocumento, ServiciosTipoPago, ClienteService, ServiciosTelefonos, ServiciosDirecciones, ServiciosGenerales, Notificaciones, SalidaVendedoresService]
})

export class VentasSalidaComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(true);
  public id_venta: number;
  public id_venta_editar: number;
  public id_salida: number;
  public productos: FormArray;
  public garantes: FormArray;
  public Productos:Array<any>;
  public Cronograma: Array<any>;
  public VentasSalidaForm:FormGroup;
  public ListadoVentas: VentaDataSource;
  public Columnas: string[];
  public ruta:string;
  public ProductosComprados: Array<any>;
  public ListadoTipoPago: Array<any>;
  public ListadoProductos: Array<any>;

  @ViewChild('InputInicial') FiltroInicial: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;

  public foto: string;
  public dni: string;
  public cip: string;
  public contrato: string;
  public transaccion: string;
  public planilla: string;
  public letra: string;
  public autorizacion: string;

  public foto_nuevo: string;
  public dni_nuevo: string;
  public cip_nuevo: string;
  public contrato_nuevo: string;
  public transaccion_nuevo: string;
  public planilla_nuevo: string;
  public letra_nuevo: string;
  public autorizacion_nuevo: string;

  public foto_antiguo: string;
  public dni_antiguo: string;
  public cip_antiguo: string;
  public contrato_antiguo: string;
  public transaccion_antiguo: string;
  public planilla_antiguo: string;
  public letra_antiguo: string;
  public autorizacion_antiguo: string;

  public foto_editar: boolean= false;
  public dni_editar: boolean= false;
  public cip_editar: boolean= false;
  public contrato_editar: boolean= false;
  public transaccion_editar: boolean= false;
  public planilla_editar: boolean= false;
  public letra_editar: boolean= false;
  public autorizacion_editar: boolean= false;

  constructor(
    private Servicio: VentaService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private ServiciosGenerales: ServiciosGenerales,
    private TelefonoServicio: ServiciosTelefonos,
    private Dialogo: MatDialog,
    private FormBuilder: FormBuilder,
    private ServicioTipoDocumento: ServiciosTipoDocumento,
    private ServicioTipoPago: ServiciosTipoPago,
    private SServicio: SalidaVendedoresService,
    private route: ActivatedRoute,
    private location: Location,
    private Notificacion: Notificaciones,
    private router: Router
  ) { }

  ngOnInit() {

    this.id_venta_editar=50;
    
    // this.route.params.subscribe(params => {
    //   console.log(params)
    //   if(params['idventa']){
    //     this.Columnas= ['numero', 'monto_cuota','fecha_vencimiento', 'monto_interes','monto_pagado', 'fecha_cancelacion', 'monto_pendiente','estado', 'opciones'];
    //     this.id_venta = +params['idventa'];
    //     this.SeleccionarVentaxId(this.id_venta);
    //   }
    //   if(params['idventaeditar']){
        this.Columnas= ['numero', 'monto_cuota','fecha_vencimiento', 'monto_interes','monto_pagado', 'fecha_cancelacion', 'monto_pendiente','estado', 'opciones'];
        // this.id_venta_editar = +params['idventa'];
        this.SeleccionarVentaxId(this.id_venta_editar);
      // }
    // 
    // })

    this.CrearFormulario();
    this.ListadoVentas = new VentaDataSource(this.Servicio)
  }

  CrearFormulario(){

    this.VentasSalidaForm = this.FormBuilder.group({
      'contrato': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'tipodoc': [6, [
        Validators.required
      ]],
      'cliente': [null, [
        Validators.required
      ]],
      'cargo': [null, [
      ]],
      'trabajo': [null, [
      ]],
      'id_direccion': [null, [
      ]],
      'domicilio': [null, [
      ]],
      'garante': [false, [
        Validators.required
      ]],
      'pecosa': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'lugar': ["", [
        Validators.required
      ]],
      'id_telefono': [null, [
      ]],
      'telefono': [null, [
      ]],
      'fechaventa': [{value: new Date(), disabled: false}, [
        Validators.required
      ]],
      'fechapago': [{value: new Date((new Date()).valueOf() + 1000*60*60*24*30), disabled: false}, [
        Validators.required
      ]],
      'tipopago': [null, [
        Validators.required
      ]],
      'montototal': [0, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'cuotas': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'inicial': [0, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'observaciones': ["", [
      ]],
      productos: this.FormBuilder.array([]),
      garantes: this.FormBuilder.array([]),
    });
  }

  CrearProducto(): FormGroup{
    return this.FormBuilder.group({
      'producto': [{value: null, disabled: false}, [
      ]],
      'precio': [{value:null, disabled: false}, [
        Validators.required,
        Validators.min(1),
        Validators.pattern ('[0-9- ]+')
      ]],
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  AgregarProducto():void{
    this.productos = this.VentasSalidaForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto());
  };

  CrearGarante(bool): FormGroup{
    return this.FormBuilder.group({
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
    this.garantes = this.VentasSalidaForm.get('garantes') as FormArray;
    this.garantes.push(this.CrearGarante(bool));
    // this.VentasForm['controls'].garantes['controls'].forEach((item, index)=>{
    //   console.log(item.dni_editar)
    // })
  };

  EliminarGarante(index){
    this.garantes.removeAt(index);
  }

  SeleccionarVentaxId(id_venta){

    let cuota_0;

    this.Servicio.SeleccionarVentaSalida(id_venta).subscribe(res=>{
      
      this.id_salida = res.id_salida;

      this.VentasSalidaForm.get('cliente').setValue(res.cliente_nombre);
      this.VentasSalidaForm.get('cargo').setValue(res.cliente_cargo_nombre);
      this.VentasSalidaForm.get('trabajo').setValue(res.cliente_trabajo);
      this.VentasSalidaForm.get('domicilio').setValue(res.cliente_direccion_nombre);
      this.VentasSalidaForm.get('telefono').setValue(res.cliente_telefono_numero);
      this.VentasSalidaForm.get('pecosa').setValue(res.pecosa);
      this.VentasSalidaForm.get('lugar').setValue(res.lugar_venta);
      this.VentasSalidaForm.get('fechaventa').setValue(res.fecha);
      this.VentasSalidaForm.get('fechapago').setValue(res.fecha_inicio_pago);
      this.VentasSalidaForm.get('inicial').setValue(res.monto_inicial);
      this.VentasSalidaForm.get('cuotas').setValue(res.numero_cuotas);
      this.VentasSalidaForm.get('montototal').setValue(res.monto_total);
      this.VentasSalidaForm.get('contrato').setValue(res.contrato);
      
      this.Productos=res.productos.productos
      
      this.Cronograma=res.cronograma.cronograma;
      
      this.ListadoVentas.Informacion.next(this.Cronograma);
      
      if(res['garantes'].garantes.length>0){
        
        this.VentasSalidaForm.get('garante').setValue(true);
        
        res['garantes'].garantes.forEach((item,index)=>{
          this.AgregarGarante(false);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('id_cliente').setValue(item.id_cliente);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('nombre').setValue(item.cliente_nombre);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('direccion').setValue(item.cliente_direccion);
          this.VentasSalidaForm['controls'].garantes['controls'][index].get('telefono').setValue(item.cliente_telefono);
        })
      }
      
      if (this.id_venta) {

        // Ajustes visuales
        this.VentasSalidaForm.get('observaciones').setValue(res.observacion=="" ? "No hay observaciones" : res.observacion);

        // Datos diferentes
        this.VentasSalidaForm.get('tipopago').setValue(res.tipo_pago);

        this.ActualizarOrdenCronograma(this.id_venta,"fecha_vencimiento asc");

        this.foto = res.foto!="" ? URLIMAGENES.carpeta+'venta/'+res.foto : null;
        this.dni = res.dni_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.dni_pdf : null;
        this.cip = res.cip_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.cip_pdf : null;
        this.contrato = res.contrato_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.contrato_pdf : null;
        this.transaccion = res.voucher_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.voucher_pdf : null;
        this.planilla = res.planilla_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.planilla_pdf : null;
        this.letra = res.letra_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.letra_pdf : null;
        this.autorizacion = res.autorizacion_pdf!="" ? URLIMAGENES.carpeta+'venta/'+res.autorizacion_pdf : null;

        if(res['garantes'].garantes.length>0){

          res['garantes'].garantes.forEach((item,index)=>{
  
            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;
            let letra = item.letra_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.letra_pdf : null ;
            let voucher = item.voucher_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.voucher_pdf : null ;
  
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('letra_pdf').setValue(letra);
            this.VentasSalidaForm['controls'].garantes['controls'][index].get('transaccion_pdf').setValue(voucher);
          })
        }

      }

      if(this.id_venta_editar){

        // Funciones importantes
        this.ListarTipoPago();
        this.ListarProductos();

        // AJustes visuales        
        this.VentasSalidaForm.get('pecosa').disable();
        this.VentasSalidaForm.get('contrato').disable();

        // Datos diferentes
        this.VentasSalidaForm.get('tipopago').setValue(res.idtipopago);

      }
      
      this.Cargando.next(false);
    })

  }

  CrearCronograma(){

    let year = moment(this.VentasSalidaForm.value.fechapago).year();
    let month = moment(this.VentasSalidaForm.value.fechapago).month();

    let fecha_corregida:Date = new Date(year, month-1,27);

    let fecha:Date;

    console.log(year, month, fecha_corregida)

    let monto=Math.round((this.VentasSalidaForm.value.montototal-this.FiltroInicial.nativeElement.value)*100/this.FiltroCuota.nativeElement.value)/100

    for (var i = 1; i<=this.FiltroCuota.nativeElement.value; i++) {

      fecha=moment(fecha_corregida).add(i-1, 'months').toDate();

      if (this.VentasSalidaForm.value.inicial>0) {
        this.Cronograma.push({
          numero:0,
          fecha_vencimiento: this.VentasSalidaForm.value.fechafechaventa,
          monto_cuota:this.VentasSalidaForm.value.inicial
        })
      }

      this.Cronograma.push({
        numero: i,
        fecha_vencimiento: fecha,
        monto_cuota: monto
      })

      this.ListadoVentas.Informacion.next(this.Cronograma);
    }

    // this.CalcularTotalCronograma()

  }

  // Cuando se cambia el orden del cronograma
  ActualizarOrdenCronograma(id, orden){
    this.Servicio.ListarCronograma(id, orden).subscribe(res=>{
      this.ListadoVentas.Informacion.next(res['data'].cronograma);
    })
  }

  SubirFoto(evento){
    // if (!this.idventa_editar) {
    //   this.foto=evento.serverResponse.response.body.data;
    // }else{
    //   this.foto_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  SubirDNI(evento){
    // if (!this.idventa_editar) {
    //   this.dni=evento.serverResponse.response.body.data;
    // }else{
    //   this.dni_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  SubirCIP(evento){
    // if (!this.idventa_editar) {
    //   this.cip=evento.serverResponse.response.body.data;
    // }else{
    //   this.cip_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  SubirContrato(evento){
    // if (!this.idventa_editar) {
    //   this.contrato=evento.serverResponse.response.body.data;
    // }else{
    //   this.contrato_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  SubirTransaccion(evento){
    // if (!this.idventa_editar) {
    //   this.transaccion=evento.serverResponse.response.body.data;
    // }else{
    //   this.transaccion_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  SubirPlanilla(evento){
    // if (!this.idventa_editar) {
    //   this.planilla=evento.serverResponse.response.body.data;
    // }else{
    //   this.planilla_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  SubirLetra(evento){
    // if (!this.idventa_editar) {
    //   this.letra=evento.serverResponse.response.body.data;
    // }else{
    //   this.letra_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  SubirAutorizacion(evento){
    // if (!this.idventa_editar) {
    //   this.autorizacion=evento.serverResponse.response.body.data;
    // }else{
    //   this.autorizacion_nuevo=evento.serverResponse.response.body.data;
    // }
  }

  // CalcularTotalCronograma(){
  //   this.total_cronograma_editado=0;
  //   this.Cronograma.forEach((item)=>{
  //     this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
  //   })
  // }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago().subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  TipoPagoSeleccionado(){
    console.log(this.VentasSalidaForm.value.tipopago);
    if (this.VentasSalidaForm.value.tipopago==3 && !this.id_venta) {
      this.VentasSalidaForm.get('cuotas').setValue(1);
      this.VentasSalidaForm.get('cuotas').disable();
      this.VentasSalidaForm.get('inicial').setValue(0);
      this.VentasSalidaForm.get('inicial').disable();
    }else{
      this.VentasSalidaForm.get('cuotas').enable();
      this.VentasSalidaForm.get('inicial').enable();
    }
  }

  ListarProductos(){
    this.SServicio.ListarSalidaProductos(this.id_salida,1).subscribe(res=>{
      // console.log(res['data'].productos);
      this.ListadoProductos=res['data'].productos;
    })
  }

  DesactivarProducto(producto){
    producto['eliminar'] = true;
    this.CalcularTotales();
  }

  ActivarProducto(producto){
    producto['eliminar'] = false;
    this.CalcularTotales();
  }
  
  EliminarProducto(index){
    this.productos.removeAt(index);
    this.CalcularTotales();
  }

  ProductoSeleccionado(evento, index){
    this.VentasSalidaForm['controls'].productos['controls'][index].get('precio').setValue(evento.value.precio_minimo)
  }

  CalcularTotales(){
    
    let total_productos_antiguos: number = 0;
    let total_productos_nuevos: number = 0;

    this.Productos.forEach((item)=>{
      if(!item.eliminar){
        total_productos_antiguos = total_productos_antiguos + item.precio*1;
        console.log(item);
      }
    })

    this.VentasSalidaForm['controls'].productos['controls'].forEach((item)=>{
      console.log(item);
      total_productos_nuevos = total_productos_nuevos + item.value.precio*1;
    })

    this.VentasSalidaForm.get('montototal').setValue(total_productos_antiguos+ total_productos_nuevos);

  }

  AbrirDocumento(url){
    if(url){
      window.open(url, "_blank");
    }
  }

  VerDetallePagos(cronograma){
    let Ventana = this.Dialogo.open(VentanaCronogramaComponent,{
      width: '900px',
      data: {numero: cronograma.numero, id:cronograma.id_cronograma}
    })
  }

  Atras(){
    this.location.back()
  }

}

export class VentaDataSource implements DataSource<any>{

  public Informacion = new BehaviorSubject<any>([])

  constructor(
    private Servicio: VentaService
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(id_venta, orden){
    this.Servicio.ListarCronograma(id_venta, orden).subscribe(res=>{
      this.Informacion.next(res['data'].cronograma);
    })
  }

}

