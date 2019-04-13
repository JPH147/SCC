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
@Component({
  selector: 'app-ventas-salida',
  templateUrl: './ventas-salida.component.html',
  styleUrls: ['./ventas-salida.component.scss'],
  providers: [VentaService, ServiciosTipoDocumento, ServiciosTipoPago, ClienteService,ServiciosTelefonos, ServiciosDirecciones, ServiciosGenerales, Notificaciones]
})
export class VentasSalidaComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(true);
  public id_venta: number;
  public productos: FormArray;
  public Productos:Array<any>;
  public Cronograma: Array<any>;
  public VentasSalidaForm:FormGroup;
  public ListadoVentas: VentaDataSource;
  public Columnas: string[];

  @ViewChild('InputInicial') FiltroInicial: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;

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

    this.id_venta=50;

    // this.route.params.subscribe(params => {
    //   if(params['idventa']){
        this.Columnas= ['numero', 'monto_cuota','fecha_vencimiento', 'monto_interes','monto_pagado', 'fecha_cancelacion', 'monto_pendiente','estado', 'opciones'];
    //     this.id_venta = +params['idventa'];
        this.SeleccionarVentaxId(this.id_venta);
    //   }
    // })
    this.CrearFormulario();
    this.ListadoVentas = new VentaDataSource(this.Servicio)
  }

  CrearFormulario(){

    this.VentasSalidaForm = this.FormBuilder.group({
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
      'pecosa': [null, [
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
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  AgregarProducto():void{
    this.productos = this.VentasSalidaForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto());
  };

  SeleccionarVentaxId(id_venta){

    let cuota_0;

    this.Servicio.SeleccionarVentaSalida(id_venta).subscribe(res=>{
      
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
      this.VentasSalidaForm.get('tipopago').setValue(res.tipo_pago);
      
      this.Productos=res.productos.productos

      // this.anulacion_observacion=res.anulacion_observacion;
      // this.anulacion_monto=res.anulacion_monto;

      //   this.ServiciosGenerales.ListarVendedor("",res.nombre_vendedor,"",1,5).subscribe( res => {
      //     this.VentasSalidaForm.get('vendedor').setValue(res[0]);
      //   });
        
      //   this.ServiciosGenerales.ListarVendedor("",res.nombre_autorizador,"",1,5).subscribe( res => {
      //     this.VentasSalidaForm.get('autorizador').setValue(res[0]);
      //   });

      //   this.VentasSalidaForm.get('sucursal').setValue(res.id_sucursal);
      //   this.edicion_sucursal=res.id_sucursal;

      //   this.id_talonario_editar=res.id_talonario;
      //   this.talonario_serie_editar=res.talonario_serie;

      //   this.ListarTalonarioNumero(res.talonario_serie);
      //   this.talonario_actual={ id:res.id_talonario, serie: res.talonario_serie, numero: res.talonario_contrato };
      //   this.VentasSalidaForm.get('contrato').setValue(res.id_talonario);
      //   this.VentasSalidaForm.get('observaciones').setValue(res.observacion);
      //   this.VentasSalidaForm.get('tipopago').setValue(res.idtipopago);

        this.Cronograma=res.cronograma.cronograma;

        if (this.VentasSalidaForm.value.inicial>0) {
          cuota_0={
            numero:0,
            fecha_vencimiento:this.VentasSalidaForm.value.fechaventa,
            monto_cuota:this.VentasSalidaForm.value.inicial,
            monto_interes: 0,
            monto_pagado:this.VentasSalidaForm.value.inicial,
            fecha_cancelacion:this.VentasSalidaForm.value.fechaventa,
            monto_pendiente:0
          }
        }

        this.Cronograma.splice(0,0,cuota_0);

        this.ListadoVentas.Informacion.next(this.Cronograma);
        console.log(this.Cronograma)

      //   this.edicion_productos=res.productos.productos;

      //   this.edicion_productos.forEach((item)=>{
      //     this.Series.push(item.id_serie);
      //   })

      //   this.Restaurar_productos(2);

      //   this.foto_antiguo=res.foto;
      //   res.foto!="" ? this.foto=URLIMAGENES.urlimages+'venta/'+res.foto : null;
      //   res.foto!="" ? this.foto_editar=false : this.foto_editar=true;

      //   this.dni_antiguo=res.dni_pdf;
      //   res.dni_pdf!="" ? this.dni=URLIMAGENES.urlimages+'venta/'+res.dni_pdf : null;
      //   res.dni_pdf!="" ? this.dni_editar=false : this.dni_editar=true;

      //   this.cip_antiguo=res.cip_pdf;
      //   res.cip_pdf!="" ? this.cip=URLIMAGENES.urlimages+'venta/'+res.cip_pdf : null;
      //   res.cip_pdf!="" ? this.cip_editar=false : this.cip_editar=true;

      //   this.contrato_antiguo=res.contrato_pdf;
      //   res.contrato_pdf!="" ? this.contrato=URLIMAGENES.urlimages+'venta/'+res.contrato_pdf : null;
      //   res.contrato_pdf!="" ? this.contrato_editar=false : this.contrato_editar=true;

      //   this.transaccion_antiguo=res.voucher_pdf;
      //   res.voucher_pdf!="" ? this.transaccion=URLIMAGENES.urlimages+'venta/'+res.voucher_pdf : null;
      //   res.voucher_pdf!="" ? this.transaccion_editar=false : this.transaccion_editar=true;

      //   this.planilla_antiguo=res.planilla_pdf;
      //   res.planilla_pdf!="" ? this.planilla=URLIMAGENES.urlimages+'venta/'+res.planilla_pdf : null;
      //   res.planilla_pdf!="" ? this.planilla_editar=false : this.planilla_editar=true;

      //   this.letra_antiguo=res.letra_pdf;
      //   res.letra_pdf!="" ? this.letra=URLIMAGENES.urlimages+'venta/'+res.letra_pdf : null;
      //   res.letra_pdf!="" ? this.letra_editar=false : this.letra_editar=true;

      //   this.autorizacion_antiguo=res.autorizacion_pdf;
      //   res.autorizacion_pdf!="" ? this.autorizacion=URLIMAGENES.urlimages+'venta/'+res.autorizacion_pdf : null;
      //   res.autorizacion_pdf!="" ? this.autorizacion_editar=false : this.autorizacion_editar=true;

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


  // CalcularTotalCronograma(){
  //   this.total_cronograma_editado=0;
  //   this.Cronograma.forEach((item)=>{
  //     this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
  //   })
  // }

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

