import { VentanaEmergenteArchivos } from './ventana-emergente/ventanaemergente';
import { Component, OnInit, ViewChild, ElementRef, Inject, ViewChildren, QueryList } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VentaService} from './ventas.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosTipoDocumento, TipoDocumento} from '../global/tipodocumento';
import {ServiciosTipoPago, TipoPago} from '../global/tipopago';
import {ClienteService, Cliente} from '../clientes/clientes.service';
import {ClienteDataSource} from '../clientes/clientes.dataservice';
import {Observable, forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./ventas.component.css'],
  providers: [VentaService, ServiciosTipoDocumento, ServiciosTipoPago, ClienteService,ServiciosTelefonos, ServiciosDirecciones, ServiciosGenerales, Notificaciones]
})

export class VentasComponent implements OnInit {
  public ListadoCliente: ClienteDataSource;
  public LstTipoDocumento: TipoDocumento[] = [];
  public LstCliente: Array<any> = [];
  public LstCargo: Array<any> = [];
  public VentasForm: FormGroup;
  public LstTipoPago: TipoPago[] = [];
  public LstContrato: Talonario[] = [];
  public LstVendedor: ListarVendedor[] = [];
  public LstSeries: Serie[] = [];
  public telefono: Telefono;
  public direccion: Direccion;
  public idcliente: number;
  private sub: any;
  public states: string[] = ['Activo', 'Finalizado', 'Canjeado', 'Anulado'];
  public contador: number;
  public idventa:number;
  public Sucursales: Array<any>;
  public sucursal: number;
  public productos: FormArray;
  public Producto:Array<any>;
  public Cronograma: Array<any>;

  public dni: string;
  public cip: string;
  public contrato: string;
  public transaccion: string;
  public planilla: string;
  public letra: string;
  public autorizacion: string;

  @ViewChild('InputFechaPago') FiltroFecha: ElementRef;
  @ViewChild('InputMontoTotal') FiltroMonto: ElementRef;
  @ViewChild('InputInicial') FiltroInicial: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;
  @ViewChild('Cliente') ClienteAutoComplete: ElementRef;
  @ViewChild('Vendedor') VendedorAutoComplete: ElementRef;
  @ViewChildren('InputProducto') FiltroProducto:QueryList<any>;

  @ViewChild('CargarDNI') DocumentoDNI: ElementRef;

  constructor(
    private Servicio: VentaService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private ServiciosGenerales: ServiciosGenerales,
    private TelefonoServicio: ServiciosTelefonos,
    public  Dialogo: MatDialog,
    private FormBuilder: FormBuilder,
    private ServicioTipoDocumento: ServiciosTipoDocumento,
    private ServicioTipoPago: ServiciosTipoPago,
    private route: ActivatedRoute,
    private location: Location,
    private Notificacion: Notificaciones,
  ) { }

  ngOnInit() {

    this.contador = 1;
    this.ListarTipoDocumento();
    this.ListarTipoPago();

    this.sub = this.route.params.subscribe(params => {
      if(params['id']){
        this.idcliente = +params['id']
        this.ObtenerClientexId(this.idcliente);
      }
     if(params['idventa']){
       console.log("here!")
       this.idventa = +params['idventa'];
       this.SeleccionarVentaxId(this.idventa);
     }
      // console.log(params)
   });
  
    this.ObtenerDireccion();
    this.ObtenerTelefono();
    this.ListarVendedor(this.VendedorAutoComplete.nativeElement.value);
    this.ListarTalonarioSerie();
    this.ListarSucursales();
    this.ListarClientes('', '', '', this.ClienteAutoComplete.nativeElement.value , '', 1, 10);
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
      'domicilio': [null, [
      ]],
      'sucursal': [null, [
        Validators.required
      ]],
      'lugar': [null, [
        Validators.required
      ]],
      'telefono': [null, [
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
      'montototal': [null, [
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
      'observaciones': [null, [
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

    fromEvent(this.ClienteAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        //console.log(this.VentasForm.value.cliente)
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

    merge(
      fromEvent(this.FiltroMonto.nativeElement,'keyup'),
      fromEvent(this.FiltroInicial.nativeElement,'keyup'),
      fromEvent(this.FiltroCuota.nativeElement,'keyup')
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if (
          this.FiltroMonto.nativeElement.value &&
          this.FiltroInicial.nativeElement.value &&
          this.FiltroCuota.nativeElement.value &&
          this.VentasForm.value.fechapago
        ) {
          this.CrearCronograma()
        }
      })
    ).subscribe()

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
      console.log(res)
      this.ObtenerClientexId(res.id_cliente);
      this.VentasForm.get('sucursal').setValue(res.id_sucursal);
      this.VentasForm.get('tipodoc').setValue(res.documento);
      this.VentasForm.get('lugar').setValue(res.lugar_venta);
      this.VentasForm.get('vendedor').setValue(this.LstVendedor.find(e=>e.id=res.id_vendedor));
      this.VentasForm.get('fechaventa').setValue(res.fecha);
      this.VentasForm.get('fechapago').setValue(res.fecha_inicio_pago);
      this.VentasForm.get('tipopago').setValue(res.idtipopago);
      this.VentasForm.get('inicial').setValue(res.monto_inicial);
      this.VentasForm.get('cuotas').setValue(res.numero_cuotas);
      this.VentasForm.get('montototal').setValue(res.monto_total);
      this.VentasForm.get('observaciones').setValue(res.observacion);

      this.VentasForm.get('talonario').setValue(res.talonario_serie);
      this.SeleccionarTalonarioNumero(res.id_talonario);
      this.VentasForm.get('contrato').setValue(res.id_talonario);

      this.CrearCronograma();

      this.sucursal=res.id_sucursal;
      
      for (let i in res.productos.productos) {
        this.CrearProducto();
        this.VentasForm['controls'].productos['controls'][i].get('id_producto').setValue(res.productos.productos[i].id_producto);
        this.VentasForm['controls'].productos['controls'][i].get('descripcion').setValue(res.productos.productos[i]);
        this.VentasForm['controls'].productos['controls'][i].get('id_serie').setValue(res.productos.productos[i].id_serie);
        this.VentasForm['controls'].productos['controls'][i].get('serie').setValue(res.productos.productos[i].serie);
        this.VentasForm['controls'].productos['controls'][i].get('precio').setValue(res.productos.productos[i].precio);
      }

      this.VentasForm.disable()

      res.dni_pdf!="" ? this.dni=URLIMAGENES.urlimages+'venta/'+res.dni_pdf : null;
      res.cip_pdf!="" ? this.cip=URLIMAGENES.urlimages+'venta/'+res.cip_pdf : null;
      res.contrato_pdf!="" ? this.contrato=URLIMAGENES.urlimages+'venta/'+res.contrato_pdf : null;
      res.transaccion_pdf!="" ? this.transaccion=URLIMAGENES.urlimages+'venta/'+res.voucher_pdf : null;
      res.planilla_pdf!="" ? this.planilla=URLIMAGENES.urlimages+'venta/'+res.planilla_pdf : null;
      res.letra_pdf!="" ? this.letra=URLIMAGENES.urlimages+'venta/'+res.letra_pdf : null;
      res.autorizacion_pdf!="" ? this.autorizacion=URLIMAGENES.urlimages+'venta/'+res.autorizacion_pdf : null;

    })
  }

  Abrir(enlace){
    console.log(enlace);
    window.open(enlace, '_blank')
  }

  ObtenerClientexId(id_cliente) {
    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        this.VentasForm.get('cliente').setValue(res);
        this.VentasForm.get('cargo').setValue(res.cargo);
        this.VentasForm.get('trabajo').setValue(res.trabajo);
        this.VentasForm.get('cliente').disable();
        this.VentasForm.get('cargo').disable();
        this.VentasForm.get('trabajo').disable();

        this.idcliente =res.id;
        this.ObtenerDireccion();
        this.ObtenerTelefono();  
      }
    });
  }

  /*Cronograma */
  CrearCronograma() {
    
    this.Cronograma=[];
    let fecha:Date = new Date(this.VentasForm.value.fechapago);

    let monto=Math.round((this.FiltroMonto.nativeElement.value-this.FiltroInicial.nativeElement.value)*100/this.FiltroCuota.nativeElement.value)/100

    for (var i = 1; i<=this.FiltroCuota.nativeElement.value; i++) {

      fecha=moment(fecha).add(1, 'months').toDate();

      this.Cronograma.push({
        numero: i,
        fecha: fecha,
        monto: monto
      })

    }
  }

  ClienteSeleccionado(evento){
   // console.log(evento.option.value)
    this.VentasForm.get('cargo').setValue(evento.option.value.cargo);
    this.VentasForm.get('cargo').disable();
    this.VentasForm.get('trabajo').setValue(evento.option.value.trabajo);
    this.VentasForm.get('trabajo').disable();
   /// console.log(evento.option.value)
    this.idcliente = evento.option.value.id
   
     // this.ObtenerClientexId();
    this.ObtenerDireccion();
    this.ObtenerTelefono();  

    // this.VentasForm.get('domicilio').setValue(evento.option.value.domicilio);
    this.VentasForm.get('domicilio').disable();
    // this.VentasForm.get('telefono').setValue(evento.option.value.telefono);
    this.VentasForm.get('telefono').disable();
    
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
  }

  ResetearProductosFormArray(){
    if (this.productos) {
      this.productos.reset()
      while (this.productos.length !== 1) {
        this.productos.removeAt(0)
      }
    }
  }

  BuscarProducto(
    sucursal:number,
    producto:string
  ){
    this.ServiciosGenerales.ListarProductoEnSucursal(sucursal, producto).subscribe(res=>{
      this.Producto=res
    })
  }

  ProductoSeleccionado(form,event){
    // console.log(form,event.option.value)
    form.get('id_producto').setValue(event.option.value.id);
    form.get("descripcion").disable()
    form.get('precio').setValue(event.option.value.precio);
  }

  SeleccionarSerie(producto){

    let Ventana = this.Dialogo.open(VentanaProductosComponent,{
      width: '1200px',
      data: {sucursal: this.sucursal, producto: producto.value.id_producto}
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        producto.get('id_serie').setValue(res.id_serie);
        producto.get('serie').setValue(res.serie);
        producto.get('serie').disable()
      }
    })
    
  }

  EliminarProductos(index,producto){
    this.productos.removeAt(index)
  }

  ListarClientes(inst: string, sede: string, subsede: string, dni: string, nombre: string, prpagina: number, prtotal: number) {
    this.ClienteServicio.Listado(inst, sede, subsede, '','',dni, nombre, prpagina, prtotal).subscribe( res => {
      this.LstCliente = res['data'].clientes;
    });
  }

  ObtenerDireccion() {
    if (this.idcliente) {
        this.DireccionServicio.ListarDireccion( this.idcliente.toString() , '1').subscribe(res => {
          if (res) {
            this.VentasForm.get('domicilio').setValue(res[0].direccioncompleta);
          }
          this.VentasForm.get('domicilio').disable();
        });
    }
  }

  ObtenerTelefono() {
    if (this.idcliente) {
        this.TelefonoServicio.ListarTelefono( this.idcliente , '1').subscribe(res => {
          if (res) {
            this.VentasForm.get('telefono').setValue(res[0].tlf_numero);
          }
          this.VentasForm.get('telefono').disable();
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
      this.LstContrato=res
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
    this.ServiciosGenerales.ListarVendedor(nombre).subscribe( res => {
      // console.log(res);
      this.LstVendedor=res;
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

 /* Agregar documentos */
 // Agregar() {
 //    let VentanaAdjuntos = this.Dialogo.open(VentanaEmergenteArchivos, {
 //      width: '800px',
 //      data: {dni:this.dni}
 //    });

 //    VentanaAdjuntos.afterClosed().subscribe(res=>{
 //      console.log(res)
 //      if (res) {
 //        this.dni=res.dni;
 //      }
      
 //    })

 //  }

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

  Reset(){
    // this.VentasForm.reset();
    // this.dni="";
    // this.cip="";
    // this.contrato="";
    // this.transaccion="";
    // this.planilla="";
    // this.letra="";
    // this.autorizacion="";
    // this.VentasForm.get('tipodoc').setValue(6);
    // this.VentasForm.get('fechaventa').setValue(new Date());
    // this.VentasForm.get('fechapago').setValue(moment(new Date()).add(1,'months'));
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
    ).subscribe(resultado=>
      this.Servicio.CrearVenta(
        formulario.value.fechaventa,
        formulario.value.sucursal,
        formulario.value.contrato,
        formulario.value.cliente.id,
        formulario.value.lugar,
        formulario.value.vendedor.id,
        1,
        formulario.value.tipodoc,
        formulario.value.tipopago,
        formulario.value.inicial,
        formulario.value.cuotas,
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
        }),
        this.ResetearFormArray(this.productos);
        this.Cronograma.forEach((item)=>{
          this.Servicio.CrearVentaCronograma(res['data'],item.monto,item.fecha).subscribe()
        })
        this.Cronograma=[];
        this.Atras();
        this.Notificacion.Snack("Se agregó la venta con éxito!","");
      })
    )


  }

}