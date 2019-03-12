// import { VentanaEmergenteArchivos } from './ventana-emergente/ventanaemergente';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, Inject, ViewChildren, QueryList, Optional } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VentaService} from './ventas.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosTipoDocumento, TipoDocumento} from '../global/tipodocumento';
import {ServiciosTipoPago, TipoPago} from '../global/tipopago';
import {ClienteService, Cliente} from '../clientes/clientes.service';
import {ClienteDataSource} from '../clientes/clientes.dataservice';
import {Observable, forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {ServiciosTelefonos, Telefono} from '../global/telefonos';
import {ServiciosDirecciones, Direccion} from '../global/direcciones';
import {ServiciosGenerales, Talonario, Serie, ListarVendedor} from '../global/servicios';
import {VentanaProductosComponent} from './ventana-productos/ventana-productos.component';
import { FileHolder } from 'angular2-image-upload';
import * as moment from 'moment';
import {Location} from '@angular/common';
import {Notificaciones} from '../global/notificacion';
import {URLIMAGENES} from '../global/url'

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  providers: [VentaService, ServiciosTipoDocumento, ServiciosTipoPago, ClienteService,ServiciosTelefonos, ServiciosDirecciones, ServiciosGenerales, Notificaciones]
})

export class VentasComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);

  public ListadoCliente: ClienteDataSource;
  public LstTipoDocumento: TipoDocumento[] = [];
  public LstCliente: Array<any> = [];
  public LstCargo: Array<any> = [];
  public VentasForm: FormGroup;
  public LstTipoPago: TipoPago[] = [];
  public LstContrato: Talonario[] = [];
  public talonario_actual: Talonario;
  public LstVendedor: Array<any> = [];
  public LstVendedor3: Array<any> = [];
  public LstSeries: Serie[] = [];
  public telefono: Telefono;
  public direccion: Direccion;
  public idcliente: number;
  public states: string[] = ['Activo', 'Finalizado', 'Canjeado', 'Anulado'];
  public contador: number;
  public idventa:number;
  public idventa_editar:number;
  public Sucursales: Array<any>;
  public sucursal: number;
  public productos: FormArray;
  public Producto:Array<any>;
  public Cronograma: Array<any>;
  public Series: Array<any>;
  public Autorizador: Array<any>;
  public ProductosComprados: Array<any>;
  public Transacciones: Array<any>;
  public talonario:string;
  public venta_canje:number;

  public dni: string;
  public cip: string;
  public contrato: string;
  public transaccion: string;
  public planilla: string;
  public letra: string;
  public autorizacion: string;

  @ViewChild('InputFechaPago') FiltroFecha: ElementRef;
  @ViewChild('InputInicial') FiltroInicial: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;
  @ViewChild('Cliente') ClienteAutoComplete: ElementRef;
  @ViewChild('Vendedor') VendedorAutoComplete: ElementRef;
  @ViewChild('Autorizador') AutorizadorAutoComplete: ElementRef;
  @ViewChildren('InputProducto') FiltroProducto:QueryList<any>;
  @ViewChildren('InputPrecio') FiltroPrecio:QueryList<any>;
  @ViewChild('CargarDNI') DocumentoDNI: ElementRef;

  public ListadoVentas: VentaDataSource;
  public Columnas: string[];

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
    private route: ActivatedRoute,
    private location: Location,
    private Notificacion: Notificaciones,
    private router: Router
  ) { }

  ngOnInit() {

    this.Cargando.next(true);

    this.contador = 1;
    this.Series=[];

    this.ListarTipoDocumento();
    this.ListarTipoPago();
    this.ListarTalonarioSerie();
    this.ListarSucursales();

    this.route.params.subscribe(params => {
      // Si es una venta nueva
      if(params['idcliente']){
        this.ListarVendedor("");
        this.ListarAutorizador("");
        this.idcliente = +params['idcliente'];
        this.ObtenerClientexId(this.idcliente);
        // En caso se trate de un canje de venta
        if (params['idventacanje']) {
          this.venta_canje=+params['idventacanje'];
          this.Servicio.SeleccionarVenta(this.venta_canje).subscribe(res=>{
            this.talonario=res.talonario_serie+" - "+res.talonario_contrato;
          })
          // Son las transacciones en el almacén que se tienen que devolver
          this.Servicio.ListarVentaTransacciones(this.venta_canje).subscribe(res=>{
            this.Transacciones=res.transaccion
          })
        }
      }
      // Cuando se ve una venta
      if(params['idventa']){
        this.ListadoVentas = new VentaDataSource(this.Servicio);
        this.Columnas= ['numero', 'monto_cuota','fecha_vencimiento', 'monto_pagado', 'fecha_cancelacion', 'estado', 'opciones'];
        this.idventa = +params['idventa'];
        this.SeleccionarVentaxId(this.idventa);
      }
      // Cuando se edita una venta
      if (params['ideditar']) {
        this.idventa_editar=params['ideditar'];
        this.SeleccionarVentaxId(this.idventa_editar)
      }
   });

    this.ListarClientes('', '', '', this.ClienteAutoComplete.nativeElement.value , '', 1, 10);

    this.CrearFormulario();
  }

  CrearFormulario(){

    this.VentasForm = this.FormBuilder.group({
      'talonario': [null, [
        Validators.required
      ]],
      'contrato': [null, [
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
      'sucursal': [null, [
        Validators.required
      ]],
      'lugar': [null, [
        Validators.required
      ]],
      'id_telefono': [null, [
      ]],
      'telefono': [null, [
      ]],
      'autorizador': [null, [
      ]],
      'vendedor': [null, [
        Validators.required
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
      'inicial': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'observaciones': ["", [
      ]],
      productos: this.FormBuilder.array([this.CrearProducto()]),
    });
  }

  CrearProducto(): FormGroup{
    return this.FormBuilder.group({
      'id_producto': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'descripcion': [{value: null, disabled: false}, [
      ]],
      'id_serie': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'serie': [{value: null, disabled: false}, [
      ]],
      'precio': [{value:null, disabled: false}, [
        Validators.required,
        Validators.min(1),
        Validators.pattern ('[0-9- ]+')
      ]],
    })
  }

  AgregarProducto():void{
    this.productos = this.VentasForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto());
  };

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {

    if (!this.idventa) {
      fromEvent(this.ClienteAutoComplete.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarClientes('', '', '', '', this.ClienteAutoComplete.nativeElement.value , 1, 5);
        })
       ).subscribe();

       fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarVendedor(this.VentasForm.value.vendedor);
        })
       ).subscribe();

       fromEvent(this.AutorizadorAutoComplete.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarAutorizador(this.VentasForm.value.autorizador);
        })
       ).subscribe();

      this.FiltroProducto.changes.subscribe(res=>{
        for (let i in this.FiltroProducto['_results']) {
          fromEvent(this.FiltroProducto['_results'][i].nativeElement,'keyup')
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(()=>{
              if (this.FiltroProducto['_results'][i]) {
                if (this.FiltroProducto['_results'][i].nativeElement.value) {
                  this.BuscarProducto(this.sucursal,this.FiltroProducto['_results'][i].nativeElement.value)
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
                  // this.VentasForm.get('montototal').setValue(0);
                  this.CalcularTotales();
                  // if (this.productos) {
                  //   this.productos.value.forEach((item)=>{
                  //     this.VentasForm.get('montototal').setValue(this.VentasForm.value.montototal+item.precio);
                  //   })
                  // } else {
                  //   this.VentasForm.get('montototal').setValue(this.FiltroPrecio['_results'][i].nativeElement.value)
                  // }
                  this.CrearCronograma()
                }
              }
            })
          ).subscribe()
        }
      })

      merge(
        fromEvent(this.FiltroInicial.nativeElement,'keyup'),
        fromEvent(this.FiltroCuota.nativeElement,'keyup')
      ).pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          if (
            // this.FiltroMonto.nativeElement.value &&
            this.FiltroInicial.nativeElement.value &&
            this.FiltroCuota.nativeElement.value &&
            this.VentasForm.value.fechapago
          ) {
            this.CrearCronograma()
          }
        })
      ).subscribe()
    }
  }

  displayCliente(cliente?: any): string | undefined {
    if (cliente) {
      return (cliente.nombre) ;
    }
  }

  displayVendedor(vendedor?: any): string | undefined {
    return vendedor ? vendedor.nombre : undefined;
  }

  displayFn(producto) {
    if (producto){
      return producto.nombre 
    }else{
      return ""
    }
  }

  SeleccionarVentaxId(id_venta){
    this.Servicio.SeleccionarVenta(id_venta).subscribe(res=>{

      this.ObtenerClientexId(res.id_cliente);
      this.VentasForm.get('cargo').setValue(res.cliente_cargo_nombre);
      this.VentasForm.get('trabajo').setValue(res.cliente_trabajo);
      this.VentasForm.get('domicilio').setValue(res.cliente_direccion_nombre);
      this.VentasForm.get('telefono').setValue(res.cliente_telefono_numero);
      this.VentasForm.get('tipodoc').setValue(res.documento);
      this.VentasForm.get('lugar').setValue(res.lugar_venta);
      this.VentasForm.get('fechaventa').setValue(res.fecha);
      this.VentasForm.get('fechapago').setValue(res.fecha_inicio_pago);
      this.VentasForm.get('inicial').setValue(res.monto_inicial);
      this.VentasForm.get('cuotas').setValue(res.numero_cuotas);
      this.VentasForm.get('montototal').setValue(res.monto_total);
      this.VentasForm.get('talonario').setValue(res.talonario_serie);

      if (this.idventa_editar) {

        this.ServiciosGenerales.ListarVendedor("",res.nombre_vendedor,"",1,5).subscribe( res => {
          this.VentasForm.get('vendedor').setValue(res[0]);
        });
        
        this.ServiciosGenerales.ListarVendedor("",res.nombre_autorizador,"",1,5).subscribe( res => {
          this.VentasForm.get('autorizador').setValue(res[0]);
        });

        this.VentasForm.get('sucursal').setValue(res.id_sucursal);        
        this.ListarTalonarioNumero(res.talonario_serie);
        this.talonario_actual={ id:res.id_talonario, serie: res.talonario_serie, numero: res.talonario_contrato };
        this.VentasForm.get('contrato').setValue(res.id_talonario);
        this.VentasForm.get('observaciones').setValue(res.observacion);
        this.VentasForm.get('tipopago').setValue(res.idtipopago);
        this.CrearCronograma();

        let i=0;

        res.productos.productos.forEach((item=>{
          this.VentasForm.get('productos')['controls'][i].get("id_producto").setValue(item.id_producto);
          this.VentasForm.get('productos')['controls'][i].get("descripcion").setValue(item.nombre);
          this.VentasForm.get('productos')['controls'][i].get("id_serie").setValue(item.id_serie);
          this.VentasForm.get('productos')['controls'][i].get("serie").setValue(item.serie);
          this.VentasForm.get('productos')['controls'][i].get("precio").setValue(item.precio);
          i++;
          this.AgregarProducto();
          if (i==res.productos.productos.length) {
            this.productos.removeAt(i);
          }
        }))
      }

      if (this.idventa) {

        this.ListadoVentas.Informacion.next(res.cronograma.cronograma);
        this.VentasForm.get('sucursal').setValue(res.nombre_sucursal);
        this.VentasForm.get("vendedor").setValue(res.nombre_vendedor);
        this.VentasForm.get("autorizador").setValue(res.nombre_autorizador);
        this.VentasForm.get('contrato').setValue(res.talonario_contrato);
        this.VentasForm.get('observaciones').setValue(res.observacion=="" ? "No hay observaciones" : res.observacion);
        this.VentasForm.get('tipopago').setValue(res.tipo_pago);
        this.ProductosComprados=res.productos.productos;

        this.talonario=res.talonario_serie+" - "+res.talonario_contrato;

        res.dni_pdf!="" ? this.dni=URLIMAGENES.urlimages+'venta/'+res.dni_pdf : null;
        res.cip_pdf!="" ? this.cip=URLIMAGENES.urlimages+'venta/'+res.cip_pdf : null;
        res.contrato_pdf!="" ? this.contrato=URLIMAGENES.urlimages+'venta/'+res.contrato_pdf : null;
        res.voucher_pdf!="" ? this.transaccion=URLIMAGENES.urlimages+'venta/'+res.voucher_pdf : null;
        res.planilla_pdf!="" ? this.planilla=URLIMAGENES.urlimages+'venta/'+res.planilla_pdf : null;
        res.letra_pdf!="" ? this.letra=URLIMAGENES.urlimages+'venta/'+res.letra_pdf : null;
        res.autorizacion_pdf!="" ? this.autorizacion=URLIMAGENES.urlimages+'venta/'+res.autorizacion_pdf : null;
      }

      this.Cargando.next(false);

      this.sucursal=res.id_sucursal;


    })
  }

  Abrir(enlace){
    console.log(enlace);
    window.open(enlace, '_blank')
  }

  ObtenerClientexId(id_cliente) {
    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        // console.log(res)
        this.VentasForm.get('cliente').setValue(res);
        if (!this.idventa) {
          this.VentasForm.get('cargo').setValue(res.cargo);
          this.VentasForm.get('trabajo').setValue(res.trabajo);
          this.idcliente =res.id;
          this.ObtenerDireccion();
          this.ObtenerTelefono();  
        }
        this.Cargando.next(false);
      }
    });
  }

  /*Cronograma */
  CrearCronograma() {
    
    this.Cronograma=[];
    let fecha:Date = new Date(this.VentasForm.value.fechapago);

    let monto=Math.round((this.VentasForm.value.montototal-this.FiltroInicial.nativeElement.value)*100/this.FiltroCuota.nativeElement.value)/100

    for (var i = 1; i<=this.FiltroCuota.nativeElement.value; i++) {

      fecha=moment(this.VentasForm.value.fechapago).add(i-1, 'months').toDate();

      this.Cronograma.push({
        numero: i,
        fecha: fecha,
        monto: monto
      })

    }
  }

  TipoPagoSeleccionado(){
    if (this.VentasForm.value.tipopago==3 && !this.idventa) {
      this.VentasForm.get('cuotas').setValue(1);
      this.VentasForm.get('cuotas').disable();
      this.VentasForm.get('inicial').setValue(0);
      this.VentasForm.get('inicial').disable();
    }else{
      this.VentasForm.get('cuotas').enable();
      this.VentasForm.get('inicial').enable();
    }
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago().subscribe( res => {
      this.LstTipoPago = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.LstTipoPago.push ( res[i] );
      }
   });
  }

  ListarTipoDocumento() {
    this.ServicioTipoDocumento.ListarTipoDocumento().subscribe( res => {
      this.LstTipoDocumento = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
         this.LstTipoDocumento.push(res[i]);
       }
    });
  }

  ListarSucursales(){
    this.ServiciosGenerales.ListarSucursal(null,"").subscribe(res=>{
      this.Sucursales=res
    })
  }

  SucursalSeleccionada(evento){
    this.sucursal=evento.value;
    this.ResetearProductosFormArray();
    this.BuscarProducto(this.sucursal,"");
    this.VentasForm.get('autorizador').setValue(null)
  }

  ResetearProductosFormArray(){
    if (this.productos) {
      this.productos.reset()
      while (this.productos.length !== 1) {
        this.productos.removeAt(0)
      }
    }
  }

  CalcularTotales(){
    this.VentasForm.get('montototal').setValue(0)
    this.VentasForm['controls'].productos['controls'].forEach((item)=>{
      this.VentasForm.get('montototal').setValue(this.VentasForm.value.montototal*1+item.value.precio*1)
    })
    this.CrearCronograma()
  }

  BuscarProducto(
    sucursal:number,
    producto:string
  ){
    this.ServiciosGenerales.ListarProductoEnSucursal(sucursal, producto).subscribe(res=>{
      this.Producto=res;
    })
  }

  ProductoSeleccionado(form,event){
    form.get('id_producto').setValue(event.option.value.id);
    form.get('descripcion').setValue(event.option.value.nombre);
    form.get('precio').setValue(event.option.value.precio);
    this.CalcularTotales()
  }

  SeleccionarSerie(producto){

    let Ventana = this.Dialogo.open(VentanaProductosComponent,{
      width: '1200px',
      data: {sucursal: this.sucursal, producto: producto.value.id_producto, series: this.Series}
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        producto.get('id_serie').setValue(res.id_serie);
        producto.get('serie').setValue(res.serie);
        this.Series.push(res.id_serie)
      }
    })
    
  }

  EliminarProductos(index,producto){
    this.productos.removeAt(index);
    this.Series.splice( this.Series.indexOf(producto.value.id_serie), 1 );
    this.CalcularTotales();
  }

  ListarClientes(inst: string, sede: string, subsede: string, dni: string, nombre: string, prpagina: number, prtotal: number) {
    this.ClienteServicio.Listado(inst, sede, subsede, '','',dni, nombre, prpagina, prtotal).subscribe( res => {
      this.LstCliente = res['data'].clientes;
    });
  }

  ObtenerDireccion() {
    if (this.idcliente) {
        this.DireccionServicio.ListarDireccion( this.idcliente, '1',1,20).subscribe(res => {
          if (res) {
            this.VentasForm.get('id_direccion').setValue(res['data'].direcciones[0].id);
            this.VentasForm.get('domicilio').setValue(res['data'].direcciones[0].direccioncompleta);
          }
        });
    }
  }

  ObtenerTelefono() {
    if (this.idcliente) {
        this.TelefonoServicio.ListarTelefono( this.idcliente , '1',1,20).subscribe(res => {
          if (res) {
            this.VentasForm.get('id_telefono').setValue(res['data'].telefonos[0].id);
            this.VentasForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
          }
        });
    }
  }

  ListarTalonarioSerie() {
    this.ServiciosGenerales.ListarSerie().subscribe( res => {
      this.LstSeries = res;
    });
  }

  ListarTalonarioNumero(pserie: string) {
    this.ServiciosGenerales.ListarNumeroTalonario(pserie).subscribe( res => {
      this.LstContrato=res;
      if (this.idventa_editar) {
        this.LstContrato.push(this.talonario_actual);
      }
   });
  }

  SeleccionarTalonarioNumero(id){
    this.ServiciosGenerales.SeleccionarTalonario(id).subscribe(res=>{
      this.LstContrato=[res]
      // console.log(this.LstContrato)
    })
  }

  SerieSeleccionada(event) {
    this.ListarTalonarioNumero(event.value);
    this.VentasForm.get('contrato').setValue('');
  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.LstVendedor=res;
    });
  }

  ListarAutorizador(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.LstVendedor3=res;
    });
  }

  SubirDNI(evento){
    this.dni=evento.serverResponse.response._body;
  }

  SubirCIP(evento){
    this.cip=evento.serverResponse.response._body;
  }

  SubirContrato(evento){
    this.contrato=evento.serverResponse.response._body;
  }

  SubirTransaccion(evento){
    this.transaccion=evento.serverResponse.response._body;
  }

  SubirPlanilla(evento){
    this.planilla=evento.serverResponse.response._body;
  }

  SubirLetra(evento){
    this.letra=evento.serverResponse.response._body;
  }

  SubirAutorizacion(evento){
    this.autorizacion=evento.serverResponse.response._body;
  }

  Atras(){
    this.location.back()
  }

  ResetearFormArray(formArray){
    if (formArray) {
      formArray.reset();
      while (formArray.length !== 1) {
        formArray.removeAt(0);
      }
    }
  }

  AbrirDocumento(url){
    window.open(url, "_blank");
  }

  GrabarVenta(formulario) {

    let random=(new Date()).getTime()

    return forkJoin(
      this.ServiciosGenerales.RenameFile(this.dni,'DNI',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.cip,'CIP',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.contrato,'CONTRATO',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.transaccion,'TRANSACCION',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.planilla,'PLANILLA',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.letra,'LETRA',random.toString(),"venta"),
      this.ServiciosGenerales.RenameFile(this.autorizacion,'AUTORIZACION',random.toString(),"venta")
    ).subscribe(resultado=>{
      console.log(resultado)    
      this.Servicio.CrearVenta(
        formulario.value.fechaventa,
        formulario.value.sucursal,
        formulario.value.contrato,
        formulario.value.autorizador.id,
        this.idcliente,
        formulario.value.id_direccion,
        formulario.value.id_telefono,
        formulario.value.cargo,
        formulario.value.lugar,
        formulario.value.vendedor.id,
        1,
        formulario.value.tipodoc,
        formulario.value.tipopago,
        formulario.value.tipopago==3 ? 0 : formulario.value.inicial,
        formulario.value.tipopago==3 ? 1 :formulario.value.cuotas,
        formulario.value.montototal,
        formulario.value.fechapago,
        resultado[0].mensaje,
        resultado[1].mensaje,
        resultado[2].mensaje,
        resultado[3].mensaje,
        resultado[4].mensaje,
        resultado[5].mensaje,
        resultado[6].mensaje,
        formulario.value.observaciones,
      ).subscribe(res=>{
        formulario.value.productos.forEach((item)=>{
          this.Servicio.CrearVentaProductos(res['data'],item.id_serie,item.precio).subscribe()
        });

        // No se genera cronograma cuando el pago es al contado
        if (formulario.value.tipopago==3) { 
          this.Servicio.CrearVentaCronograma(res['data'],formulario.value.montototal,formulario.value.fechapago,2).subscribe()
        }else{
          this.Cronograma.forEach((item)=>{
            this.Servicio.CrearVentaCronograma(res['data'],item.monto,item.fecha,1).subscribe()
          });
        }
        
        this.Servicio.CrearComisionVendedor(res['data'], formulario.value.vendedor.id, formulario.value.montototal).subscribe();
         
        // Si la transacción es producto de un canje, se devuelven los productos al almacén
        if (this.venta_canje) {
          this.Servicio.CrearCanje( res['data'], this.venta_canje).subscribe();
          this.Transacciones.forEach((item)=>{
            this.Servicio.CrearCanjeTransaccion(item.id,formulario.value.fechaventa).subscribe()
          })
        }  

        this.router.navigate(['ventas'])
        this.Notificacion.Snack("Se agregó la venta con éxito!","");
      })
    })
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

  // CargarInformacion(
  //   ruc:string,
  //   nombre:string
  // ){
  //   this.Servicio.ListarEmpresa(ruc,nombre).subscribe(res=>{
  //     this.Informacion.next(res)
  //   })
  // }

}
