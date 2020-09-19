import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VentaService} from './ventas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import {ServiciosTipoDocumento, TipoDocumento} from 'src/app/core/servicios/tipodocumento';
import {ServiciosTipoPago, TipoPago} from 'src/app/core/servicios/tipopago';
import {ClienteService } from '../../modulo-clientes/clientes/clientes.service';
import {ClienteDataSource} from '../../modulo-clientes/clientes/clientes.dataservice';
import { forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {ServiciosTelefonos, Telefono} from 'src/app/core/servicios/telefonos';
import {ServiciosDirecciones, Direccion} from 'src/app/core/servicios/direcciones';
import {ServiciosGenerales, Talonario, Serie} from 'src/app/core/servicios/servicios';
import {VentanaProductosComponent} from './ventana-productos/ventana-productos.component';
import {Location} from '@angular/common';
import {Notificaciones} from 'src/app/core/servicios/notificacion';
import {URLIMAGENES} from 'src/app/core/servicios/url'
import {SeleccionarClienteComponent} from '../../compartido/componentes/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaEmergenteContacto} from '../../compartido/componentes/ventana-emergentecontacto/ventanaemergentecontacto';
import { CreditosService } from "../../modulo-creditos/creditos/creditos.service";
import { SeguimientosService } from "../../modulo-clientes/seguimientos/seguimientos.service";
import { VentanaPagosComponent } from '../../compartido/componentes/ventana-pagos/ventana-pagos.component';
import { VentanaEmergenteClientes } from '../../compartido/componentes/ventana-emergente/ventanaemergente' ;
import { VentanaCrearCobranzaManualComponent } from "../../modulo-cobranzas/cobranza-manual/ventana-crear-cobranza-manual/ventana-crear-cobranza-manual.component";
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Store } from "@ngrx/store";
import { EstadoSesion } from "../../compartido/reducers/permisos.reducer";
import { CobranzaJudicialService } from "../../modulo-cobranzas/cobranza-judicial/cobranza-judicial.service";
import { VentanaConfirmarComponent } from "../../compartido/componentes/ventana-confirmar/ventana-confirmar.component";

import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { VentanaGenerarPagoTransaccionComponent } from "../../compartido/componentes/ventana-generar-pago-transaccion/ventana-generar-pago-transaccion.component";
import { VentanaGenerarPenalidadComponent } from "src/app/compartido/componentes/ventana-generar-penalidad/ventana-generar-penalidad.component";
import { ServiciosVentas } from "src/app/core/servicios/ventas";

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})

export class VentasComponent implements OnInit {

  public Cargando: BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);

  public editar_cronograma:number;
  public ruta:string;
  public ListadoCliente: ClienteDataSource;
  public LstTipoDocumento: TipoDocumento[] = [];
  public Couriers: Array<any> = [];
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
  public garantes: FormArray;
  public Producto:Array<any>;
  public Cronograma: Array<any>;
  public Cronograma_Periodos : Array<any> ;
  public Series: Array<number>;
  public Autorizador: Array<any>;
  public ProductosComprados: Array<any>;
  public Transacciones: Array<any>;
  public talonario:string;
  public venta_canje:number;
  public edicion_productos:Array<any>;
  public edicion_sucursal:number;
  public id_cliente_editar:number;
  public id_talonario_editar:number;
  public talonario_serie_editar:string;
  public total_cronograma_editado:number;
  public diferencia: number;
  public monto_inicial_canje: number;
  public anulacion_observacion: string;
  public anulacion_monto: string;
  public existe_garante:boolean = false;
  public venta_canjeada : boolean ;
  public venta_refinanciada : boolean ;
  public codigo_credito : string ;
  public identificador_documento : string ;

  public foto: string;
  public dni: string;
  public cip: string;
  public contrato: string;
  public transaccion: string;
  public planilla: string;
  public letra: string;
  public autorizacion: string;
  public oficio: string;
  public otros: string;
  public papeles : string = "";

  public foto_nuevo: string;
  public dni_nuevo: string;
  public cip_nuevo: string;
  public contrato_nuevo: string;
  public transaccion_nuevo: string;
  public planilla_nuevo: string;
  public letra_nuevo: string;
  public autorizacion_nuevo: string;
  public oficio_nuevo: string;
  public otros_nuevo: string;
  public papeles_antiguo : string = "";

  public foto_antiguo: string;
  public dni_antiguo: string;
  public cip_antiguo: string;
  public contrato_antiguo: string;
  public transaccion_antiguo: string;
  public planilla_antiguo: string;
  public letra_antiguo: string;
  public autorizacion_antiguo: string;
  public oficio_antiguo: string;
  public otros_antiguo: string;
  public papeles_nuevo : string = "";

  public foto_editar: boolean= false;
  public dni_editar: boolean= false;
  public cip_editar: boolean= false;
  public contrato_editar: boolean= false;
  public transaccion_editar: boolean= false;
  public planilla_editar: boolean= false;
  public letra_editar: boolean= false;
  public autorizacion_editar: boolean= false;
  public oficio_editar: boolean= false;
  public otros_editar: boolean= false;
  public papeles_editar : boolean = false;

  @ViewChild('InputFechaPago', { static: true }) FiltroFecha: ElementRef;
  @ViewChild('InputInicial', { static: true }) FiltroInicial: ElementRef;
  @ViewChild('InputCuota', { static: true }) FiltroCuota: ElementRef;
  @ViewChild('Cliente') ClienteAutoComplete: ElementRef;
  @ViewChild('Vendedor') VendedorAutoComplete: ElementRef;
  @ViewChild('Autorizador') AutorizadorAutoComplete: ElementRef;
  @ViewChildren('InputProducto') FiltroProducto:QueryList<any>;
  @ViewChildren('InputPrecio') FiltroPrecio:QueryList<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public ListadoVentas: VentaDataSource;
  public Columnas: string[];
  public ColumnasCronogramaPeriodo: Array<string> = ["numero", "periodo", "monto_cuota", "monto_pago_manual" ,"total_planilla" ,"total_directo" ,"total_judicial" ] ;

  public id_presupuesto : number ;
  public hay_presupuesto_vendedor : boolean ;

  public permiso : Rol ;
  public id_venta : number ;
  public estado : number ;
  public ListadoProcesos : Array<any> = [] ;
  public numero_procesos : number = 0 ;
  public monto_pagado : number = 0 ;

  public totales_monto_total : number = 0 ;
  public totales_interes_generado : number = 0 ;
  public totales_monto_pagado : number = 0 ;
  public totales_monto_pendiente : number = 0 ;
  public totales_total_cuotas : number = 0 ;
  public totales_total_pendiente : number = 0 ;
  public totales_total_pagadas : number = 0 ;

  public editar_documentos : boolean = false ;
  public cumple_penalidad : number = 1 ;
  public id_tipo_pago : number = 0 ;

  public contrato_pdf_express : string = "" ;

  public cuotas_penalidad : number = 0 ;
  public cuotas_interes : number = 0 ;

  constructor(
    private _store : Store<EstadoSesion> ,
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
    private router: Router,
    private CServicio : CreditosService,
    private SServicio : SeguimientosService,
    private _judiciales : CobranzaJudicialService ,
    private _ventas : ServiciosVentas ,
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.contador = 1;
    this.Series=[];
    this.Cronograma=[];
    this.editar_cronograma=3;

    this.ListadoVentas = new VentaDataSource(this.Servicio);

    this.ruta=URLIMAGENES.urlimages;
    // console.log(this.ruta);

    this.ListarTipoDocumento();
    this.ListarTipoPago();
    this.ListarTalonarioSerie();
    this.ListarSucursales();
    this.ListarCouriers();

    this.Columnas= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
    this.ListarVendedor("");
    this.ListarAutorizador("");

    this.CrearFormulario();

    this.route.params.subscribe(params => {
      if(Object.keys(params).length>0){
        
        // Si hay parámetros, se muestra el indicador de carga de la página.
        this.Cargando.next(true);
  
        // Si es una venta nueva
        if(params['idcliente']){
          this.papeles_editar = true;
          this.idcliente = +params['idcliente'];
          this.ObtenerClientexId(this.idcliente);
          this.ObtenerDireccion(this.idcliente);
          this.ObtenerTelefono(this.idcliente);
          // En caso se trate de un canje de venta
          if (params['idventacanje']) {
            this.venta_canje=+params['idventacanje'];
            this.Servicio.SeleccionarVenta(this.venta_canje).subscribe(res=>{
              this.talonario=res.talonario_serie+" - "+res.talonario_contrato;
              this.monto_inicial_canje=res.monto_inicial;
            })
            // Son las transacciones en el almacén que se tienen que devolver
            this.Servicio.ListarVentaTransacciones(this.venta_canje).subscribe(res=>{
              this.Transacciones=res.transaccion
            })
          }
        }
  
        // Si viene de un presupuesto
        if(params['idpresupuesto']){
          this.id_presupuesto=params['idpresupuesto'];
          this.papeles_editar=true;
          // this.id_presupuesto = 17 ;
          this.NuevoCreditoPresupuesto(this.id_presupuesto);
        }

        // Cuando se ve una venta
        if(params['idventa']){
          this.id_venta = +params['idventa'] ;
          this.idventa = +params['idventa'] ;
          this.Columnas= ['numero','tipo_pago','fecha_vencimiento', 'monto_cuota', 'monto_interes','monto_pagado', 'fecha_cancelacion','estado', 'opciones'];
          // this.idventa=77;
          this.SeleccionarVentaxId(this.idventa);
        }
  
        // Cuando se edita una venta
        if (params['ideditar']) {
          this.id_venta = +params['ideditar'] ;
          this.idventa_editar=+params['ideditar'];
          this.Columnas= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
          this.SeleccionarVentaxId(this.idventa_editar)
        }
      } else {
        this.papeles_editar = true;
      }
    });
  }
  
  ngAfterViewInit() {

    if (!this.idventa) {
      fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          if( this.VentasForm.value.vendedor ){
            this.ListarVendedor(this.VentasForm.value.vendedor);
          }
        })
      ).subscribe();

      fromEvent(this.AutorizadorAutoComplete.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          if( this.VentasForm.value.autorizador ){
            this.ListarAutorizador(this.VentasForm.value.autorizador);
          }
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
                  this.CalcularTotales();
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

  ActualizarObservables() {
    fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        if( this.VentasForm.value.vendedor ){
          this.ListarVendedor(this.VentasForm.value.vendedor);
        }
      })
    ).subscribe();

    fromEvent(this.AutorizadorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        if( this.VentasForm.value.autorizador ){
          this.ListarAutorizador(this.VentasForm.value.autorizador);
        }
      })
    ).subscribe();

    this.FiltroPrecio.changes.subscribe(res=>{
      for (let i in this.FiltroPrecio['_results']) {
        fromEvent(this.FiltroPrecio['_results'][i].nativeElement,'keyup')
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(()=>{
            if (this.FiltroPrecio['_results'][i]) {
              if (this.FiltroPrecio['_results'][i].nativeElement.value) {
                this.CalcularTotales();
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
          this.FiltroInicial.nativeElement.value &&
          this.FiltroCuota.nativeElement.value &&
          this.VentasForm.value.fechapago
        ) {
          this.CrearCronograma()
        }
      })
    ).subscribe() ;
  }
  
  pad(caracter : string, tamano : number): string {
    let s = caracter ;
    for (let index = caracter.length ; index < tamano; index++ ) {
      s = "0" + s ;
    }
    return s;
  }

  SeleccionarVentaxId(id_venta){
    this.ListarProcesos(id_venta) ;
    this.Cargando.next(true) ;

    if (!this.idventa) {
      this.Columnas = ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
    }
    if (this.idventa) {
      this.Columnas= ['numero','tipo_pago','fecha_vencimiento', 'monto_cuota', 'monto_interes','monto_pagado', 'fecha_cancelacion','estado', 'opciones'];
    }

    this.Servicio.SeleccionarVenta(id_venta).subscribe(res=>{
      this.Cargando.next(false);

      this.cumple_penalidad = res.cumple_penalidad ;
      this.id_tipo_pago = res.idtipopago ;
      this.cuotas_penalidad = res.cuotas_penalidad ;
      this.cuotas_interes = res.cuotas_interes ;

      this.talonario=res.talonario_serie+" - "+res.talonario_contrato;

      this.VentasForm.get('id_cliente').setValue(res.id_cliente);
      this.VentasForm.get('cliente').setValue(res.cliente_nombre);

      this.VentasForm.get('dni').setValue( this.pad(res.cliente_dni.toString(),8) );
      this.VentasForm.get('cargo').setValue(res.cliente_cargo_nombre);
      this.VentasForm.get('trabajo').setValue(res.cliente_trabajo);
      this.VentasForm.get('direccion').setValue(res.cliente_direccion);
      this.VentasForm.get('telefono').setValue(res.cliente_telefono);
      this.VentasForm.get('lugar').setValue(res.lugar_venta);
      this.VentasForm.get('fechaventa').setValue(moment(res.fecha).toDate());
      this.VentasForm.get('fechapago').setValue(moment(res.fecha_inicio_pago).toDate());
      this.VentasForm.get('inicial').setValue(res.monto_inicial);
      this.VentasForm.get('cuotas').setValue(res.numero_cuotas);
      this.VentasForm.get('montototal').setValue(res.monto_total);
      this.VentasForm.get('talonario').setValue(res.talonario_serie);
      
      this.VentasForm.get("id_vendedor").setValue(res.id_vendedor);
      this.VentasForm.get("id_autorizador").setValue(res.id_autorizador);
      this.VentasForm.get("vendedor").setValue(res.nombre_vendedor);
      this.VentasForm.get("autorizador").setValue(res.nombre_autorizador);

      // Si la fecha de pago es el último día del mes, se activa el control 'fecha_fin_mes'
      let fecha_pago = this.VentasForm.get('fechapago').value ;
      let ultimo_fecha_pago  = moment(this.VentasForm.get('fechapago').value).endOf('month').toDate() ;
      if ( moment(fecha_pago).isBefore(ultimo_fecha_pago, 'day') ) {
        this.VentasForm.get('fecha_fin_mes').setValue(false) ;
      } else {
        this.VentasForm.get('fecha_fin_mes').setValue(true) ;
      }

      this.anulacion_observacion=res.anulacion_observacion;
      this.anulacion_monto=res.anulacion_monto;
      this.total_cronograma_editado=res.monto_total;
      this.estado = res.estado ;

      this.totales_monto_total = res.monto_total ;
      this.totales_interes_generado = res.interes_generado ;
      this.totales_monto_pagado = res.monto_pagado ;
      this.totales_monto_pendiente = res.monto_pendiente ;
      this.totales_total_cuotas = res.total_cuotas ;
      this.totales_total_pendiente = res.total_pendiente ;
      this.totales_total_pagadas = res.total_pagadas ;

      if( res.id_venta_canje && res.estado==3 ) {
        this.venta_canjeada = true ;
        this.talonario = res.canje_talonario_serie + "-" + res.canje_talonario_contrato ;
      }

      if( res.id_credito_refinanciado ) {
        this.venta_refinanciada = true ;
        this.codigo_credito = res.credito_refinanciado ;
      }

      if(res['garantes'].garantes.length>0){

        this.VentasForm.get('garante').setValue(true);

        res['garantes'].garantes.forEach((item,index)=>{
          this.AgregarGarante(false);
          this.VentasForm['controls'].garantes['controls'][index].get('id_cliente').setValue(item.id_cliente);
          this.VentasForm['controls'].garantes['controls'][index].get('nombre').setValue(item.cliente_nombre);
          this.VentasForm['controls'].garantes['controls'][index].get('direccion').setValue(item.cliente_direccion);
          this.VentasForm['controls'].garantes['controls'][index].get('telefono').setValue(item.cliente_telefono);
        })
      }

      if( res['courier'].id ){
        this.VentasForm.get('papeles').setValue(true);
        this.VentasForm.get('papeles_id').setValue(res['courier'].id);
        this.VentasForm.get('papeles_fecha_envio').setValue(res['courier'].fecha);
        this.VentasForm.get('papeles_courier').setValue(res['courier'].id_courier);
        this.VentasForm.get('papeles_seguimiento').setValue(res['courier'].numero_seguimiento);
        this.VentasForm.get('papeles_observaciones').setValue(res['courier'].observacion);
        res['courier'].foto !="" ? this.papeles=URLIMAGENES.carpeta+'venta/'+res['courier'].foto : null;
      }

      if (this.idventa) {

        this.ActualizarOrdenCronograma(this.idventa,"fecha_vencimiento asc");

        this.VentasForm.get('sucursal').setValue(res.nombre_sucursal);
        this.VentasForm.get('contrato').setValue(res.talonario_contrato);
        this.VentasForm.get('observaciones').setValue(res.observacion=="" ? "No hay observaciones" : res.observacion);
        this.VentasForm.get('tipopago').setValue(res.tipo_pago);
        this.ProductosComprados=res.productos.productos;

        res.foto!="" ? this.foto=URLIMAGENES.carpeta+'venta/'+res.foto : null;
        res.dni_pdf!="" ? this.dni=URLIMAGENES.carpeta+'venta/'+res.dni_pdf : null;
        res.cip_pdf!="" ? this.cip=URLIMAGENES.carpeta+'venta/'+res.cip_pdf : null;
        res.contrato_pdf!="" ? this.contrato=URLIMAGENES.carpeta+'venta/'+res.contrato_pdf : null;
        res.voucher_pdf!="" ? this.transaccion=URLIMAGENES.carpeta+'venta/'+res.voucher_pdf : null;
        res.planilla_pdf!="" ? this.planilla=URLIMAGENES.carpeta+'venta/'+res.planilla_pdf : null;
        res.letra_pdf!="" ? this.letra=URLIMAGENES.carpeta+'venta/'+res.letra_pdf : null;
        res.autorizacion_pdf!="" ? this.autorizacion=URLIMAGENES.carpeta+'venta/'+res.autorizacion_pdf : null;
        res.oficio_pdf!="" ? this.oficio=URLIMAGENES.carpeta+'venta/'+res.oficio_pdf : null;
        res.otros_pdf!="" ? this.otros=URLIMAGENES.carpeta+'venta/'+res.otros_pdf : null;

        if(res['garantes'].garantes.length>0){

          res['garantes'].garantes.forEach((item,index)=>{
  
            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;
            let letra = item.letra_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.letra_pdf : null ;
            let voucher = item.voucher_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.voucher_pdf : null ;
  
            this.VentasForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.VentasForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.VentasForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
            this.VentasForm['controls'].garantes['controls'][index].get('letra_pdf').setValue(letra);
            this.VentasForm['controls'].garantes['controls'][index].get('transaccion_pdf').setValue(voucher);
          })
        }
      }

      if ( this.editar_documentos ) {
        this.foto_antiguo=res.foto;
        res.foto!="" ? this.foto=URLIMAGENES.carpeta+'venta/'+res.foto : null;
        res.foto!="" ? this.foto_editar=false : this.foto_editar=true;

        this.dni_antiguo=res.dni_pdf;
        res.dni_pdf!="" ? this.dni=URLIMAGENES.carpeta+'venta/'+res.dni_pdf : null;
        res.dni_pdf!="" ? this.dni_editar=false : this.dni_editar=true;

        this.cip_antiguo=res.cip_pdf;
        res.cip_pdf!="" ? this.cip=URLIMAGENES.carpeta+'venta/'+res.cip_pdf : null;
        res.cip_pdf!="" ? this.cip_editar=false : this.cip_editar=true;

        this.contrato_antiguo=res.contrato_pdf;
        res.contrato_pdf!="" ? this.contrato=URLIMAGENES.carpeta+'venta/'+res.contrato_pdf : null;
        res.contrato_pdf!="" ? this.contrato_editar=false : this.contrato_editar=true;

        this.transaccion_antiguo=res.voucher_pdf;
        res.voucher_pdf!="" ? this.transaccion=URLIMAGENES.carpeta+'venta/'+res.voucher_pdf : null;
        res.voucher_pdf!="" ? this.transaccion_editar=false : this.transaccion_editar=true;

        this.planilla_antiguo=res.planilla_pdf;
        res.planilla_pdf!="" ? this.planilla=URLIMAGENES.carpeta+'venta/'+res.planilla_pdf : null;
        res.planilla_pdf!="" ? this.planilla_editar=false : this.planilla_editar=true;

        this.letra_antiguo=res.letra_pdf;
        res.letra_pdf!="" ? this.letra=URLIMAGENES.carpeta+'venta/'+res.letra_pdf : null;
        res.letra_pdf!="" ? this.letra_editar=false : this.letra_editar=true;

        this.autorizacion_antiguo=res.autorizacion_pdf;
        res.autorizacion_pdf!="" ? this.autorizacion=URLIMAGENES.carpeta+'venta/'+res.autorizacion_pdf : null;
        res.autorizacion_pdf!="" ? this.autorizacion_editar=false : this.autorizacion_editar=true;

        this.oficio_antiguo=res.oficio_pdf;
        res.oficio_pdf!="" ? this.oficio=URLIMAGENES.carpeta+'venta/'+res.oficio_pdf : null;
        res.oficio_pdf!="" ? this.oficio_editar=false : this.oficio_editar=true;

        this.otros_antiguo=res.otros_pdf;
        res.otros_pdf!="" ? this.otros=URLIMAGENES.carpeta+'venta/'+res.otros_pdf : null;
        res.otros_pdf!="" ? this.otros_editar=false : this.otros_editar=true;
      }

      if (this.idventa_editar) {
        this.CrearCronograma() ;
        
        if( res['courier'].id ){
          this.VentasForm.get('papeles_courier').setValue(res['courier'].id_courier);
          this.papeles_antiguo=res['courier'].foto;
          res['courier'].foto !="" ? this.papeles_editar=false : this.papeles_editar=true;
        }

        this.VentasForm.get('sucursal').setValue(res.id_sucursal);
        this.edicion_sucursal=res.id_sucursal;

        this.id_talonario_editar=res.id_talonario;
        this.talonario_serie_editar=res.talonario_serie;

        this.ListarTalonarioNumero(res.talonario_serie);
        this.talonario_actual={ id:res.id_talonario, serie: res.talonario_serie, numero: res.talonario_contrato };
        this.VentasForm.get('contrato').setValue(res.id_talonario);
        this.VentasForm.get('observaciones').setValue(res.observacion);
        this.VentasForm.get('tipopago').setValue(res.idtipopago);

        // this.Cronograma=res.cronograma.cronograma ;
        // this.CalcularTotalPagado(this.Cronograma) ;
        
        this.ListadoVentas.Informacion.next(this.Cronograma);
        this.edicion_productos=res.productos.productos;

        this.edicion_productos.forEach((item)=>{
          this.Series.push(item.id_serie);
        })

        this.Restaurar_productos(2);

        this.foto_antiguo=res.foto;
        res.foto!="" ? this.foto=URLIMAGENES.carpeta+'venta/'+res.foto : null;
        res.foto!="" ? this.foto_editar=false : this.foto_editar=true;

        this.dni_antiguo=res.dni_pdf;
        res.dni_pdf!="" ? this.dni=URLIMAGENES.carpeta+'venta/'+res.dni_pdf : null;
        res.dni_pdf!="" ? this.dni_editar=false : this.dni_editar=true;

        this.cip_antiguo=res.cip_pdf;
        res.cip_pdf!="" ? this.cip=URLIMAGENES.carpeta+'venta/'+res.cip_pdf : null;
        res.cip_pdf!="" ? this.cip_editar=false : this.cip_editar=true;

        this.contrato_antiguo=res.contrato_pdf;
        res.contrato_pdf!="" ? this.contrato=URLIMAGENES.carpeta+'venta/'+res.contrato_pdf : null;
        res.contrato_pdf!="" ? this.contrato_editar=false : this.contrato_editar=true;

        this.transaccion_antiguo=res.voucher_pdf;
        res.voucher_pdf!="" ? this.transaccion=URLIMAGENES.carpeta+'venta/'+res.voucher_pdf : null;
        res.voucher_pdf!="" ? this.transaccion_editar=false : this.transaccion_editar=true;

        this.planilla_antiguo=res.planilla_pdf;
        res.planilla_pdf!="" ? this.planilla=URLIMAGENES.carpeta+'venta/'+res.planilla_pdf : null;
        res.planilla_pdf!="" ? this.planilla_editar=false : this.planilla_editar=true;

        this.letra_antiguo=res.letra_pdf;
        res.letra_pdf!="" ? this.letra=URLIMAGENES.carpeta+'venta/'+res.letra_pdf : null;
        res.letra_pdf!="" ? this.letra_editar=false : this.letra_editar=true;

        this.autorizacion_antiguo=res.autorizacion_pdf;
        res.autorizacion_pdf!="" ? this.autorizacion=URLIMAGENES.carpeta+'venta/'+res.autorizacion_pdf : null;
        res.autorizacion_pdf!="" ? this.autorizacion_editar=false : this.autorizacion_editar=true;

        this.oficio_antiguo=res.oficio_pdf;
        res.oficio_pdf!="" ? this.oficio=URLIMAGENES.carpeta+'venta/'+res.oficio_pdf : null;
        res.oficio_pdf!="" ? this.oficio_editar=false : this.oficio_editar=true;

        this.otros_antiguo=res.otros_pdf;
        res.otros_pdf!="" ? this.otros=URLIMAGENES.carpeta+'venta/'+res.otros_pdf : null;
        res.otros_pdf!="" ? this.otros_editar=false : this.otros_editar=true;

        if(res['garantes'].garantes.length>0){

          res['garantes'].garantes.forEach((item,index)=>{

            this.VentasForm['controls'].garantes['controls'][index].get('dni_pdf_antiguo').setValue(item.dni_pdf);
            this.VentasForm['controls'].garantes['controls'][index].get('cip_pdf_antiguo').setValue(item.cip_pdf);
            this.VentasForm['controls'].garantes['controls'][index].get('planilla_pdf_antiguo').setValue(item.planilla_pdf);
            this.VentasForm['controls'].garantes['controls'][index].get('letra_pdf_antiguo').setValue(item.letra_pdf);
            this.VentasForm['controls'].garantes['controls'][index].get('transaccion_pdf_antiguo').setValue(item.voucher_pdf);
            
            let dni_editar = item.dni_pdf == "" ? true : false;
            let cip_editar = item.cip_pdf == "" ? true : false;
            let planilla_editar = item.planilla_pdf == "" ? true : false;
            let letra_editar = item.letra_pdf == "" ? true : false;
            let transaccion_editar = item.voucher_pdf == "" ? true : false;

            this.VentasForm['controls'].garantes['controls'][index].get('dni_editar').setValue(dni_editar);
            this.VentasForm['controls'].garantes['controls'][index].get('cip_editar').setValue(cip_editar);
            this.VentasForm['controls'].garantes['controls'][index].get('planilla_editar').setValue(planilla_editar);
            this.VentasForm['controls'].garantes['controls'][index].get('letra_editar').setValue(letra_editar);
            this.VentasForm['controls'].garantes['controls'][index].get('transaccion_editar').setValue(transaccion_editar);

            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;
            let letra = item.letra_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.letra_pdf : null ;
            let voucher = item.voucher_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.voucher_pdf : null ;
  
            this.VentasForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.VentasForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.VentasForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
            this.VentasForm['controls'].garantes['controls'][index].get('letra_pdf').setValue(letra);
            this.VentasForm['controls'].garantes['controls'][index].get('transaccion_pdf').setValue(voucher);

          })
        }
      }

      this.sucursal=res.id_sucursal;
    })
  }

  CrearFormulario(){

    this.VentasForm = this.FormBuilder.group({
      'talonario': [null, [
        Validators.required
      ]],
      'contrato': [null, [
        Validators.required
      ]],
      'id_cliente': [null, [
        Validators.required
      ]],
      'cliente': ["", [
        Validators.required
      ]],
      'dni': ["", [
        Validators.required
      ]],
      'cargo': ["", [
      ]],
      'trabajo': ["", [
      ]],
      'direccion': ["", [
      ]],
      'telefono': ["", [
      ]],
      'garante': [false, [
        Validators.required
      ]],
      'sucursal': [null, [
        Validators.required
      ]],
      'lugar': ["", [
      ]],
      'id_autorizador': [null, [
      ]],
      'autorizador': [null, [
      ]],
      'id_vendedor': [null, [
        // Validators.required
      ]],
      'vendedor': [null, [
        // Validators.required
      ]],
      'fechaventa': [{value: new Date(), disabled: false}, [
        Validators.required
      ]],
      'fechapago': [{value: moment(new Date()).add(1,'months').endOf('month').toDate(), disabled: false}, [
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
      // Refente al envío de papeles
      papeles: [{value: false, disabled: false},[
      ]],
      papeles_id: [{value: false, disabled: false},[
      ]],
      papeles_fecha_envio: [{value: new Date(), disabled: false},[
      ]],
      papeles_courier: [{value: "", disabled: false},[
      ]],
      papeles_seguimiento: [{value: "", disabled: false},[
      ]],
      papeles_observaciones: [{value: "", disabled: false},[
      ]],
      fecha_fin_mes: [{value: true, disabled: false},[
      ]],
      productos: this.FormBuilder.array([]),
      garantes: this.FormBuilder.array([]),
      // 1. Ver cuotas, 2. Ver periodos
      vista_cronograma: [{ value : 2, disabled : false },[
      ]],
    });
  }

  CrearProducto(): FormGroup{
    return this.FormBuilder.group({
      'id_producto': [{value: null, disabled: false}, [
        Validators.required
      ]],
      'nombre': [{value: "", disabled: false}, [
      ]],
      'descripcion': [{value: "", disabled: false}, [
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
    this.productos = this.VentasForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto());
  };

  EliminarProductos(index,producto){
    if (producto.value.estado==1) {
      this.productos.removeAt(index);
      this.Series.splice( this.Series.indexOf(producto.value.id_serie), 1 );
    }
    if (producto.value.estado==2) {
      this.productos['controls'][index].get('descripcion').disable()
      this.productos['controls'][index].get('serie').disable()
      this.productos['controls'][index].get('precio').disable()
      this.productos['controls'][index].get('estado').setValue(3);
    }
    this.CalcularTotales();
  }

  DeseliminarProductos(index){
    this.productos['controls'][index].get('descripcion').enable()
    this.productos['controls'][index].get('serie').enable()
    this.productos['controls'][index].get('precio').enable()
    this.productos['controls'][index].get('estado').setValue(2);
    this.CalcularTotales();
  }

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
    this.garantes = this.VentasForm.get('garantes') as FormArray;
    this.garantes.push(this.CrearGarante(bool));
    // this.VentasForm['controls'].garantes['controls'].forEach((item, index)=>{
    //   console.log(item.dni_editar)
    // })
  };

  EliminarGarante(index){
    this.garantes.removeAt(index);
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

  // Cuando se cambia el orden del cronograma
  ActualizarOrdenCronograma(id, orden){
    this.Cargando.next(true) ;
    this.Servicio.ListarCronograma(id, orden).subscribe(res=>{
      this.Cargando.next(false) ;
      this.Cronograma = res['data'].cronograma ;
      this.CalcularTotalPagado( this.Cronograma ) ;

      if ( this.VentasForm.get('vista_cronograma').value == 1 ) {
        this.ListadoVentas.Informacion.next(this.Cronograma);
      }
    })

    this.Servicio.ListarCrongramaPagosxPeriodo(id).subscribe(res=>{
      this.Cronograma_Periodos = res ;
      if ( this.VentasForm.get('vista_cronograma').value == 2 ) {
        this.ListadoVentas.Informacion.next(this.Cronograma_Periodos);
      }
    })
  }

  // Coloca los productos editados como inicialmente estaban
  Restaurar_productos(estado){

    let i=0;

    this.edicion_productos.forEach((item=>{
      this.AgregarProducto();
      this.VentasForm.get('productos')['controls'][i].get("id_producto").setValue(item.id_producto);
      this.VentasForm.get('productos')['controls'][i].get("descripcion").setValue(item.nombre);
      this.VentasForm.get('productos')['controls'][i].get("id_serie").setValue(item.id_serie);
      this.VentasForm.get('productos')['controls'][i].get("serie").setValue(item.serie);
      this.VentasForm.get('productos')['controls'][i].get("precio").setValue(item.precio);
      this.VentasForm.get('productos')['controls'][i].get("estado").setValue(estado);
      i++;
    }))
  }

  Abrir(enlace){
    console.log(enlace);
    window.open(enlace, '_blank')
  }

  ObtenerClientexId(id_cliente) {
    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        this.VentasForm.get('id_cliente').setValue(res.id);
        this.VentasForm.get('cliente').setValue(res.nombre);
        this.VentasForm.get('dni').setValue(res.dni);
        this.VentasForm.get('cargo').setValue(res.cargo);
        this.VentasForm.get('trabajo').setValue(res.trabajo);
        this.Cargando.next(false);
      }
    });
  }

  /*Cronograma */
  CrearCronograma(){

    this.Cronograma=[];

    let year = moment(this.VentasForm.value.fechapago).year();
    let month = moment(this.VentasForm.value.fechapago).month();
    let day = moment(this.VentasForm.value.fechapago).date();

    let fecha_corregida:Date = new Date(year, month, day);

    let fecha:Date;

    if (this.VentasForm.value.inicial>0) {
      this.Cronograma.push({
        numero:0,
        fecha_vencimiento: this.VentasForm.value.fechaventa,
        monto_cuota:this.VentasForm.value.inicial
      })
    }

    let monto=Math.round((this.VentasForm.value.montototal-this.FiltroInicial.nativeElement.value)*100/this.FiltroCuota.nativeElement.value)/100

    for (var i = 1; i<=this.FiltroCuota.nativeElement.value; i++) {

      fecha=moment(fecha_corregida).add(i-1, 'months').toDate();

      this.Cronograma.push({
        numero: i,
        fecha_vencimiento: fecha,
        monto_cuota: monto
      })

      this.ListadoVentas.AsignarCuotas(this.Cronograma) ;
    }
    
    this.CalcularTotalCronograma()

  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  CalcularTotalCronograma(){
    this.total_cronograma_editado=0;
    this.Cronograma.forEach((item)=>{
      this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
    })
    this.diferencia= Math.abs(Math.round((this.VentasForm.value.montototal-this.total_cronograma_editado)*100)/100);
  }

  TipoPagoSeleccionado(){
    if(!this.id_presupuesto) {
      if (this.VentasForm.value.tipopago==3 && !this.idventa) {
        this.VentasForm.get('cuotas').setValue(1);
        this.VentasForm.get('cuotas').disable();
        this.VentasForm.get('inicial').setValue(0);
        this.VentasForm.get('inicial').disable();
      }else{
        this.VentasForm.get('cuotas').enable();
        this.VentasForm.get('inicial').enable();
      }
      this.CrearCronograma();
    }
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago(2).subscribe( res => {
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
    this.ServiciosGenerales.ListarSucursal(null,"").subscribe(sucursales=>{
      this.Sucursales=sucursales ;
      if ( this.Sucursales.length == 1 ) {
        this.VentasForm.get('sucursal').setValue(this.Sucursales[0].id) ;
        this.sucursal=this.Sucursales[0].id ;
      }
    })
  }

  SucursalSeleccionada(evento){
    this.sucursal=evento.value;
    if(!this.id_presupuesto) {
      this.ResetearProductosFormArray();
      this.BuscarProducto(this.sucursal,"");
      if (this.idventa_editar){
        if (evento.value==this.edicion_sucursal) {
          this.Restaurar_productos(2);
        }else{
          this.Restaurar_productos(3);
        }
      }
    }
  }

  ResetearProductosFormArray(){
    if (this.productos) {
      let productos = this.productos.value ;
      
      productos = productos.filter(elemento => elemento.estado==2 || elemento.estado==3)

      if( productos.length > 0 ) {
        this.productos.setValue(productos) ;
      } else {
        this.productos.reset() ;
        while (this.productos.length !== 0) {
          this.productos.removeAt(0)
        }
      }
    }
  }

  CalcularTotales(){
    this.VentasForm.get('montototal').setValue(0)
    this.VentasForm['controls'].productos['controls'].forEach((item)=>{
      if(item.value.precio && item.value.estado!=3){
        this.VentasForm.get('montototal').setValue(this.VentasForm.value.montototal*1+item.value.precio*1)
      }
    })
    this.CrearCronograma()
  }

  BuscarProducto(sucursal:number, producto:string){
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
        producto.get('id_serie').setValue(res.id_serie) ;
        producto.get('serie').setValue(res.serie) ;
        this.Series.push(res.id_serie) ;
      }
    })
  }

  SeleccionarSeries(){
    // console.log(this.VentasForm['controls'].productos.value) ;
    let Ventana = this.Dialogo.open(VentanaProductosComponent,{
      width: '1200px',
      data: {sucursal: this.sucursal, series: this.Series, productos : this.VentasForm['controls'].productos.value }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Series = [] ;
        this.ResetearProductosFormArray() ;
        res.map( (producto, index) => {
          if ( producto.estado != 2 ) {
            this.AgregarProducto() ;
            this.VentasForm['controls'].productos['controls'][index].get('id_producto').setValue( producto.id_producto );
            this.VentasForm['controls'].productos['controls'][index].get('nombre').setValue( producto.producto );
            this.VentasForm['controls'].productos['controls'][index].get('descripcion').setValue( producto.producto );
            this.VentasForm['controls'].productos['controls'][index].get('id_serie').setValue( producto.id_serie );
            this.VentasForm['controls'].productos['controls'][index].get('serie').setValue( producto.serie );
            this.VentasForm['controls'].productos['controls'][index].get('precio').setValue( producto.precio );
  
            this.Series.push(producto.id_serie) ;
            return producto ;
          }
        } ) ;
        this.CalcularTotales() ;
      }
    })
  }

  ObtenerDireccion(id_cliente) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasForm.get('direccion').setValue(res['data'].direcciones[0].direccioncompleta);
      }
    });
  }

  ObtenerTelefono(id_cliente) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
      }
    });
  }

  ObtenerDireccionGarante(id_cliente, index) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasForm['controls'].garantes['controls'][index].get('direccion').setValue(res['data'].direcciones[0].direccioncompleta)
      }
    });
  }

  ObtenerTelefonoGarante(id_cliente, index) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.VentasForm['controls'].garantes['controls'][index].get('telefono').setValue(res['data'].telefonos[0].tlf_numero)
      }
    });
  }

  ListarTalonarioSerie() {
    this.ServiciosGenerales.ListarSerie().subscribe( res => {
      this.LstSeries = res;
    });
  }

  ListarTalonarioNumero(pserie: string) {
    this.ServiciosGenerales.ListarNumeroTalonario(pserie).subscribe( res => {
      this.LstContrato=res;
      if (this.idventa_editar && this.talonario_serie_editar==pserie) {
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

  VerificarAdjuntoExpress() {
    if ( !this.id_venta ) {
      this._ventas.ListarAdjuntosTalonario(
        this.VentasForm.get('contrato').value
      ).subscribe(res =>{
        this.contrato_pdf_express = res.pdf_contrato ;
      })
    }
  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.LstVendedor=res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.VentasForm.value.vendedor.nombre;
    this.VentasForm.get('id_vendedor').setValue(this.VentasForm.value.vendedor.id);
    this.VentasForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.VentasForm.get('id_vendedor').setValue(null);
    this.VentasForm.get('vendedor').setValue("");
  }

  ListarAutorizador(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.LstVendedor3=res;
    });
  }

  AutorizadorSeleccionado(){
    let nombre_auorizador= this.VentasForm.value.autorizador.nombre;
    this.VentasForm.get('id_autorizador').setValue(this.VentasForm.value.autorizador.id);
    this.VentasForm.get('autorizador').setValue(nombre_auorizador);
  }

  RemoverAutorizador(){
    this.VentasForm.get('id_autorizador').setValue(null);
    this.VentasForm.get('autorizador').setValue("");
  }

  SubirFoto(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.foto=evento.serverResponse.response.body.data;
    }else{
      this.foto_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirDNI(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.dni=evento.serverResponse.response.body.data;
    }else{
      this.dni_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirCIP(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.cip=evento.serverResponse.response.body.data;
    }else{
      this.cip_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirContrato(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.contrato=evento.serverResponse.response.body.data;
    }else{
      this.contrato_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirTransaccion(evento){
    console.log(evento);
    if (!this.idventa_editar && !this.editar_documentos) {
      this.transaccion=evento.serverResponse.response.body.data;
    }else{
      this.transaccion_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirPlanilla(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.planilla=evento.serverResponse.response.body.data;
    }else{
      this.planilla_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirLetra(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.letra=evento.serverResponse.response.body.data;
    }else{
      this.letra_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirAutorizacion(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.autorizacion=evento.serverResponse.response.body.data;
    }else{
      this.autorizacion_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirOficio(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.oficio=evento.serverResponse.response.body.data;
    }else{
      this.oficio_nuevo=evento.serverResponse.response.body.data;
    }
  }

  SubirOtros(evento){
    if (!this.idventa_editar && !this.editar_documentos) {
      this.otros=evento.serverResponse.response.body.data;
    }else{
      this.otros_nuevo=evento.serverResponse.response.body.data;
    }
  }

  Atras(){
    this.location.back()
  }

  EditarContrato(){
    this.contrato_editar=true
  }

  NoEditarContrato(){
    this.contrato_editar=false
  }

  EditarFoto(){
    this.foto_editar=true;
  }

  NoEditarFoto(){
    this.foto_editar=false;
  }

  EditarDni(){
    this.dni_editar=true;
  }

  NoEditarDni(){
    this.dni_editar=false;
  }

  EditarCip(){
    this.cip_editar=true;
  }

  NoEditarCip(){
    this.cip_editar=false;
  }

  EditarTransaccion(){
    this.transaccion_editar=true;
  }

  NoEditarTransaccion(){
    this.transaccion_editar=false;
  }

  EditarPlanilla(){
    this.planilla_editar=true;
  }

  NoEditarPlanilla(){
    this.planilla_editar=false;
  }

  EditarEditar(){
    this.letra_editar=true;
  }

  NoEditarEditar(){
    this.letra_editar=false;
  }

  EditarAutorizacion(){
    this.autorizacion_editar=true;
  }

  NoEditarAutorizacion(){
    this.autorizacion_editar=false;
  }

  EditarOficio(){
    this.oficio_editar=true;
  }

  NoEditarOficio(){
    this.oficio_editar=false;
  }


  EditarOtros(){
    this.otros_editar=true;
  }

  NoEditarOtros(){
    this.otros_editar=false;
  }

  SubirDNIAval(evento, index){
    if (!this.idventa_editar) {
      this.VentasForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasForm['controls'].garantes['controls'][index].get('dni_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirCIPAval(evento, index){
    if (!this.idventa_editar) {
      this.VentasForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasForm['controls'].garantes['controls'][index].get('cip_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirPlanillaAval(evento, index){
    if (!this.idventa_editar) {
      this.VentasForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasForm['controls'].garantes['controls'][index].get('planilla_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirLetraAval(evento, index){
    if (!this.idventa_editar) {
      this.VentasForm['controls'].garantes['controls'][index].get('letra_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasForm['controls'].garantes['controls'][index].get('letra_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirTransaccionAval(evento, index){
    if (!this.idventa_editar) {
      this.VentasForm['controls'].garantes['controls'][index].get('transaccion_pdf').setValue(evento.serverResponse.response.body.data);
    }else{
      this.VentasForm['controls'].garantes['controls'][index].get('transaccion_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  SubirPapeles(evento){
    if(this.idventa_editar){
      this.papeles_nuevo = evento.serverResponse.response.body.data;
    }else{
      this.papeles = evento.serverResponse.response.body.data;
    }
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
    if(url){
      window.open(url, "_blank");
    }
  }

  VerDetallePagos(cronograma){
    let Ventana = this.Dialogo.open(VentanaPagosComponent,{
      width: '900px',
      data: { tipo: 2 , cuota : cronograma.id_cronograma }
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.VentasForm.get('id_cliente').setValue(res.id);
        this.ObtenerClientexId(res.id);
        this.ObtenerDireccion(res.id);
        this.ObtenerTelefono(res.id);
      }
    })
  }

  RemoverCliente(){
    this.VentasForm.get('id_cliente').setValue(null);
    this.VentasForm.get('dni').setValue("");
    this.VentasForm.get('cargo').setValue("");
    this.VentasForm.get('trabajo').setValue("");
    this.VentasForm.get('direccion').setValue("");
    this.VentasForm.get('telefono').setValue("");
  }
  
  EditarCliente(){
    let id_cliente : number = this.VentasForm.value.id_cliente ;
    let VentanaClientes = this.Dialogo.open(VentanaEmergenteClientes, {
      width: '1200px',
      maxHeight : '80vh' ,
      data: {id: id_cliente, confirmar: false},
    });
    VentanaClientes.afterClosed().subscribe (res => {
      this.ObtenerClientexId(id_cliente)
    });
  }

  EditarContactoCliente(){
    let id_cliente = this.VentasForm.value.id_cliente ? this.VentasForm.value.id_cliente : this.idcliente;

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
      if(this.idventa_editar){
        this.AgregarGarante(true)
      }else{
        this.AgregarGarante(false)
      }
    }else{
      if(this.VentasForm['controls'].garantes['controls'].length>1){
        this.EliminarGarante(1);
        this.EliminarGarante(0);
      }else{
        this.EliminarGarante(0);
      }
      // this.VentasForm['controls'].garantes['controls'].forEach((item,index)=>{
      //   this.EliminarGarante(index)
      // })
    }
  }

  SeleccionarGarante(index){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px",
      data: {cliente : this.VentasForm.value.id_cliente}
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.VentasForm['controls'].garantes['controls'][index].get('id_cliente').setValue(res.id)
        this.VentasForm['controls'].garantes['controls'][index].get('nombre').setValue(res.nombre)
        this.ObtenerDireccionGarante(res.id,index);
        this.ObtenerTelefonoGarante(res.id,index);
      }
    })

  }

  EditarContactoGarante(id_cliente, index){
    let VentanaContacto = this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: id_cliente
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      this.ObtenerDireccionGarante(id_cliente,index);
      this.ObtenerTelefonoGarante(id_cliente,index);
    })
  }

  ListarCouriers(){
    this.ServiciosGenerales.ListarCourier("",1,50).subscribe(res=>{
      this.Couriers = res['data'].courier
    })
  }

  HayPapeles(evento){
    this.VentasForm.get('papeles').setValue(evento.checked)
  }

  NuevoCreditoPresupuesto(id){
    // this.NuevoCredito();
    this.CServicio.SeleccionarPresupuesto(id).subscribe(res=>{
      // console.log(res);
      this.idcliente=res.id_cliente;
      this.VentasForm.get('id_cliente').setValue(res.id);
      this.ObtenerClientexId(res.id_cliente);
      this.ObtenerDireccion(res.id_cliente);
      this.ObtenerTelefono(res.id_cliente);
      this.VentasForm.get('cuotas').setValue(res.cuotas);
      this.VentasForm.get('montototal').setValue(res.total);

      this.Cronograma=res.cronograma;
      this.ListadoVentas.Informacion.next(this.Cronograma)
      this.CalcularTotalCronograma();

      this.CrearCronograma() ;

      this.ProductosComprados=res.productos;

      if(res.id_vendedor){
        this.hay_presupuesto_vendedor=true;
        this.VentasForm.get('id_vendedor').setValue(res.id_vendedor);
        this.VentasForm.get('vendedor').setValue(res.vendedor);
      }

      this.QuitarValidacionProductos();
      this.diferencia=0;

      this.VentasForm.get('fechapago').setValue( moment(res.cronograma[0].fecha_vencimiento).toDate() );
    })
  }

  QuitarValidacionProductos(){
    this.VentasForm['controls'].productos['controls'][0].get('id_producto').setValue(1000);
    this.VentasForm['controls'].productos['controls'][0].get('id_serie').setValue(1000);
    this.VentasForm['controls'].productos['controls'][0].get('precio').setValue(1000);
  }

  CrearidentificadorDocumento(evento){
    let contrato = this.LstContrato.filter(e=>e.id == evento.value)[0].numero ;
    this.identificador_documento = this.VentasForm.value.talonario + "-" + contrato ;
  }

  CambiarTipoVista( tipo : string ){
    if( tipo == 'ver' ) {
      this.idventa = this.id_venta ;
      this.idventa_editar = null ;
      this.editar_documentos = false ;
      this.Columnas= ['numero','tipo_pago','fecha_vencimiento', 'monto_cuota', 'monto_interes','monto_pagado', 'fecha_cancelacion','estado', 'opciones'];
    }
    if( tipo == 'editar_documentos' ) {
      this.idventa = this.id_venta ;
      this.idventa_editar = null ;
      this.editar_documentos = true ;
      this.Columnas= ['numero','tipo_pago','fecha_vencimiento', 'monto_cuota', 'monto_interes','monto_pagado', 'fecha_cancelacion','estado', 'opciones'];
    }
    if( tipo == 'editar' ) {
      this.idventa = null ;
      this.idventa_editar = this.id_venta ;
      this.editar_documentos = false ;
      this.Columnas= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
      this.ActualizarObservables() ;
    }
    this.SeleccionarVentaxId(this.id_venta)
  }  

  ListarProcesos( id_venta : number ) {
    this.ListadoProcesos = [] ;
    this._judiciales.ListarProcesosxTransaccion(2, id_venta).subscribe(res=>{
      this.numero_procesos = res.length ;
      this.ListadoProcesos = res ;
    })
  }

  CalcularTotalPagado( cronograma : Array<any> ) {
    this.monto_pagado = cronograma.reduce((acumulador, elemento)=>{
      return acumulador + elemento.monto_pagado*1 ;
    }, 0) ;
  }

  AnularVenta(){
    let transacciones: Array<any> = [];
    
    // Se listan las transacciones que pertenecen a esa venta
    let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
      data: {objeto: "la venta", valor: this.talonario, venta:true}
    })

    Dialogo.afterClosed().subscribe(res=>{
      this.Cargando.next(true) ;
      if (res) {
        if (res.respuesta) {
          this.Servicio.ListarVentaTransacciones(this.id_venta).subscribe(res2=>{
            transacciones=res2.transaccion ;
            this.Servicio.EliminarVenta(this.id_venta, res.comentarios, res.monto).subscribe(respuesta=>{
              this.Cargando.next(false) ;
              transacciones.forEach((item)=>{
                this.Servicio.CrearCanjeTransaccion(item.id,new Date(),"AJUSTE POR ANULACION").subscribe() ;
              })
  
              if (res.monto>0) {
                this.Servicio.CrearVentaCronograma(this.id_venta,2,res.monto,new Date(), 1).subscribe() ;
              }
  
              this.router.navigate(['/ventas','ventas']) ;
            });
          });
        }
      }
    })
  }

  AgregarPagos(){
    let ventana = this.Dialogo.open(VentanaGenerarPagoTransaccionComponent,{
      width: '1200px' ,
      maxHeight: '80vh' ,
      data : { tipo : 2, id_venta : this.idventa, cronograma : this.Cronograma, pendiente : this.totales_monto_pendiente }
    })

    ventana.afterClosed().subscribe( resultado=>{
      if ( resultado === true ) {
        this.Notificacion.Snack("Se crearon los pagos satisfactoriamente","") ;
        this.SeleccionarVentaxId(this.idventa);
      }
    } )
  }
  
  Guardar(formulario){
    this.Cargando.next(true);

    if (this.idventa_editar) {
      this.ActualizarVenta(formulario)
    }else{
      this.GuardarVenta(formulario)
    }
  }

  GuardarVenta(formulario) {
    this.Cargando.next(true) ;
    let random=(new Date()).getTime()
    let identificador = this.identificador_documento ;
    let dni = this.VentasForm.value.dni ;
    let fecha = moment(this.VentasForm.value.fechaventa).format("DD_MM_YYYY") ;

    let carpeta : string = "venta" ;

    return forkJoin([
      this.ServiciosGenerales.RenameFile(this.foto, dni + '_FOTO_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.dni, dni + '_DNI_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.cip, dni + '_CIP_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.contrato, dni + '_CONTRATO_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.transaccion, dni + '_TRANSACCION_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.planilla, dni + '_PLANILLA_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.letra, dni + '_LETRA_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.autorizacion, dni + '_AUTORIZACION_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.oficio, dni + '_OFICIO_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.otros, dni + '_OTROS_' + fecha, identificador, carpeta),
      this.ServiciosGenerales.RenameFile(this.papeles, dni + '_PAPELES_' + fecha, identificador, carpeta)
    ]).subscribe(resultado=>{
      this.Servicio.CrearVenta(
        formulario.value.fechaventa,
        formulario.value.sucursal,
        formulario.value.contrato,
        formulario.value.id_autorizador ? formulario.value.id_autorizador : 0,
        formulario.value.id_cliente,
        formulario.value.direccion,
        formulario.value.telefono,
        formulario.value.cargo,
        formulario.value.trabajo,
        "OFICINA",
        formulario.value.id_vendedor ? formulario.value.id_vendedor : 0,
        1,
        0, // Porque no pertenece a ninguna salida de ventas
        formulario.value.tipopago,
        formulario.value.tipopago==3 ? 0 : formulario.value.inicial,
        formulario.value.tipopago==3 ? 1 :formulario.value.cuotas,
        formulario.value.montototal,
        formulario.value.fechapago,
        resultado[0].mensaje,
        resultado[1].mensaje,
        resultado[2].mensaje,
        this.contrato_pdf_express ? this.contrato_pdf_express : resultado[3].mensaje,
        resultado[4].mensaje,
        resultado[5].mensaje,
        resultado[6].mensaje,
        resultado[7].mensaje,
        resultado[8].mensaje,
        resultado[9].mensaje,
        formulario.value.observaciones,
      ).subscribe(res=>{
        
        // Se crean los productos y se generan los documentos en almacén para cuadrar
        if(!this.id_presupuesto){
          formulario.value.productos.forEach((item)=>{
            this.Servicio.CrearVentaProductos(res['data'],item.id_serie,item.precio).subscribe()
          });
        } else {
          this.ProductosComprados.forEach((item)=>{
            this.Servicio.CrearVentaProductos(res['data'],item.id_serie,item.precio).subscribe(res=>{
              // console.log(res)
            })
          })
        }

        // Se genera el cronograma
        this.Cronograma.forEach((item)=>{
          this.Servicio.CrearVentaCronograma(res['data'],formulario.value.tipopago,item.monto_cuota,item.fecha_vencimiento,1).subscribe()
        });
        
        // Se agregan los datos del courier
        if( this.VentasForm.value.papeles ){
          this.CServicio.CrearCourier(
            res['data'],
            0,
            this.VentasForm.value.papeles_courier,
            this.VentasForm.value.papeles_fecha_envio,
            this.VentasForm.value.papeles_seguimiento,
            this.papeles_editar ? resultado[10].mensaje : this.papeles_antiguo,
            this.VentasForm.value.papeles_observaciones
          ).subscribe();
        }
         
        // Si la transacción es producto de un canje, se devuelven los productos al almacén
        if (this.venta_canje) {
          this.Servicio.CrearCanje( res['data'], this.venta_canje).subscribe();
          this.Transacciones.forEach((item)=>{
            this.Servicio.CrearCanjeTransaccion(item.id,formulario.value.fechaventa,"AJUSTE POR CANJE").subscribe()
          })
        }  

        // Si la venta viene de un presupuesto, el presupuesto cambia de estado
        if(this.id_presupuesto){
          this.CServicio.ActualizarPresupuesto(this.id_presupuesto, 2).subscribe(res=>console.log(res));
        }

        // Si la venta tiene garante, se los agrega
        if( this.VentasForm.value.garante ){

          this.VentasForm['controls'].garantes['controls'].forEach((item, index)=>{
            return forkJoin([
              this.ServiciosGenerales.RenameFile(item.value.dni_pdf,`DNI_GARANTE_+${index+1}`,random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.cip_pdf,`CIP_GARANTE_+${index+1}`,random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.planilla_pdf,`PLANILLA_GARANTE_+${index+1}`,random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.letra_pdf,`LETRA_GARANTE_+${index+1}`,random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.transaccion_pdf,`TRANSACCION_GARANTE_+${index+1}`,random.toString(),"venta"),
            ]).subscribe(response=>{
              this.Servicio.CrearVentaGarante(
                res['data'],
                item.value.id_cliente,
                item.value.direccion,
                item.value.telefono,
                response[0].mensaje,
                response[1].mensaje,
                response[2].mensaje,
                response[3].mensaje,
                response[4].mensaje
              ).subscribe(res=>console.log(res))
            })
          })

        }

        setTimeout(()=>{
          this.Cargando.next(false) ;
          this.router.navigate(['/ventas','ventas']);
  
          if(res['codigo']==0){
            this.Notificacion.Snack("Se agregó la venta con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al crear la venta","");
          }
        }, 300)

      })
    })
  }

  ActualizarVenta(formulario){
    this.Cargando.next(true) ;

    let random=(new Date()).getTime();
    let identificador = random.toString() ;
    let dni = this.VentasForm.value.dni ;
    let fecha = moment(this.VentasForm.value.fechaventa).format("DD_MM_YYYY") ;
    
    forkJoin([
      this.ServiciosGenerales.RenameFile(this.foto_nuevo, dni + '_FOTO_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo, dni + '_DNI_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo, dni + '_CIP_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.contrato_nuevo, dni + '_CONTRATO_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo, dni + '_TRANSACCION_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo, dni + '_PLANILLA_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo, dni + '_LETRA_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo, dni + '_AUTORIZACION_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.oficio_nuevo, dni + '_OFICIO' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.otros_nuevo, dni + '_OTROS_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.papeles_nuevo, dni + '_PAPELES_' + fecha, identificador, "venta")
    ]).subscribe(resultado=>{
      // console.log(resultado)

      // Cuando se actualiza la venta, en el procedimiento
      // se eliminan el cronograma actual y los garantes

      this.Servicio.ActualizarVenta(
        this.idventa_editar,
        formulario.value.fechaventa,
        formulario.value.sucursal,
        formulario.value.contrato,
        formulario.value.id_autorizador ? formulario.value.id_autorizador : 0,
        formulario.value.id_cliente,
        formulario.value.direccion,
        formulario.value.telefono,
        formulario.value.cargo,
        formulario.value.trabajo,
        "OFICINA",
        formulario.value.id_vendedor ? formulario.value.id_vendedor : 0,
        1,
        0, // Porque no pertenece a ninguna salida de ventas
        formulario.value.tipopago,
        formulario.value.tipopago==3 ? 0 : formulario.value.inicial,
        formulario.value.tipopago==3 ? 1 :formulario.value.cuotas,
        formulario.value.montototal,
        formulario.value.fechapago,
        this.foto_editar ? resultado[0].mensaje : this.foto_antiguo,
        this.dni_editar ? resultado[1].mensaje : this.dni_antiguo,
        this.cip_editar ? resultado[2].mensaje : this.cip_antiguo,
        this.contrato_editar ? resultado[3].mensaje : this.contrato_antiguo,
        this.transaccion_editar ? resultado[4].mensaje : this.transaccion_antiguo,
        this.planilla_editar ? resultado[5].mensaje : this.planilla_antiguo,
        this.letra_editar ? resultado[6].mensaje : this.letra_antiguo,
        this.autorizacion_editar ? resultado[7].mensaje : this.autorizacion_antiguo,
        this.oficio_editar ? resultado[8].mensaje : this.oficio_antiguo,
        this.otros_editar ? resultado[9].mensaje : this.otros_antiguo,
        formulario.value.observaciones,
      ).subscribe(res=>{

        if (formulario.value.contrato!=this.id_talonario_editar) {
          this.ServiciosGenerales.ActualizarEstadoTalonario(this.id_talonario_editar,1).subscribe();
        }

        // Se crean los productos en el almacén
        formulario.value.productos.forEach((item)=>{
          // Si es nuevo, se crean transacciones en almacén
          if (item.estado==1) {
            this.Servicio.CrearVentaProductos(res['data'],item.id_serie,item.precio).subscribe()
          }
          // Si el producto ya estaba anteriormente, no se hace nada
          if (item.estado==2) {
          }
          // Si el producto se debe eliminar, se elimina
          if (item.estado==3) {
            this.Servicio.EliminarProductosVenta(this.idventa_editar,item.id_serie).subscribe(res=>{console.log(this.idventa_editar,item.id_serie,res)})
          }
        });

        // Se genera el cronograma
        this.Cronograma.forEach((item)=>{
          // if(item.numero==0){
          //   this.Servicio.CrearVentaCronograma(res['data'],item.monto_cuota,item.fecha_vencimiento,1).subscribe()
          // }else{
            this.Servicio.CrearVentaCronograma(res['data'],formulario.value.tipopago,item.monto_cuota,item.fecha_vencimiento,1).subscribe()
          // }
        });
        
        // Si la venta tiene garante, se los agrega
        if( this.VentasForm.value.garante ){

          this.VentasForm['controls'].garantes['controls'].forEach((item, index)=>{
            return forkJoin([
              this.ServiciosGenerales.RenameFile(item.value.dni_pdf_nuevo,'DNI_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.cip_pdf_nuevo,'CIP_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.planilla_pdf_nuevo,'PLANILLA_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.letra_pdf_nuevo,'LETRA_GARANTE_'+(index+1),random.toString(),"venta"),
              this.ServiciosGenerales.RenameFile(item.value.transaccion_pdf_nuevo,'TRANSACCION_GARANTE_'+(index+1),random.toString(),"venta"),
            ]).subscribe(response=>{
              this.Servicio.CrearVentaGarante(
                res['data'],
                item.value.id_cliente,
                item.value.direccion,
                item.value.telefono,
                item.value.dni_editar ? response[0].mensaje : item.value.dni_pdf_antiguo,
                item.value.cip_editar ? response[1].mensaje : item.value.cip_pdf_antiguo,
                item.value.planilla_editar ? response[2].mensaje : item.value.planilla_pdf_antiguo,
                item.value.letra_editar ? response[3].mensaje : item.value.letra_pdf_antiguo,
                item.value.transaccion_editar ? response[4].mensaje : item.value.transaccion_pdf_antiguo
              ).subscribe(res=>console.log(res))
            })
          })

        }

        // Se actualizan los datos del courier
        if( this.VentasForm.value.papeles ){
          this.SServicio.Actualizar(
            this.VentasForm.value.papeles_id,
            this.VentasForm.value.papeles_courier,
            this.VentasForm.value.papeles_fecha_envio,
            this.VentasForm.value.papeles_seguimiento,
            this.papeles_editar ? resultado[10].mensaje : this.papeles_antiguo,
            this.VentasForm.value.papeles_observaciones
          ).subscribe();
        }

        setTimeout(()=>{
          this.router.navigate(['/ventas','ventas']);
          this.Cargando.next(false) ;
          if(res['codigo']==0){
            this.Notificacion.Snack("Se editó la venta con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al editar la venta","");
          }
        }, 300)

      })
    })
  }

  GuardarNuevosDocumentos(){
    this.Cargando.next(true) ;
    let random=(new Date()).getTime();
    let identificador = random.toString() ;
    let dni = this.VentasForm.value.dni ;
    let fecha = moment(this.VentasForm.value.fechaventa).format("DD_MM_YYYY") ;
    
    forkJoin([
      this.ServiciosGenerales.RenameFile(this.foto_nuevo, dni + '_FOTO_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo, dni + '_DNI_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo, dni + '_CIP_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.contrato_nuevo, dni + '_CONTRATO_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo, dni + '_TRANSACCION_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo, dni + '_PLANILLA_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo, dni + '_LETRA_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo, dni + '_AUTORIZACION_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.oficio_nuevo, dni + '_OFICIO_' + fecha, identificador, "venta"),
      this.ServiciosGenerales.RenameFile(this.otros_nuevo, dni + '_OTROS_' + fecha, identificador, "venta"),
    ]).subscribe(resultado=>{
      this.Servicio.ActualizarVentaDocumentos(
        this.idventa,
        this.foto_editar ? resultado[0].mensaje : this.foto_antiguo,
        this.dni_editar ? resultado[1].mensaje : this.dni_antiguo,
        this.cip_editar ? resultado[2].mensaje : this.cip_antiguo,
        this.contrato_editar ? resultado[3].mensaje : this.contrato_antiguo,
        this.transaccion_editar ? resultado[4].mensaje : this.transaccion_antiguo,
        this.planilla_editar ? resultado[5].mensaje : this.planilla_antiguo,
        this.letra_editar ? resultado[6].mensaje : this.letra_antiguo,
        this.autorizacion_editar ? resultado[7].mensaje : this.autorizacion_antiguo,
        this.oficio_editar ? resultado[8].mensaje : this.oficio_antiguo,
        this.otros_editar ? resultado[9].mensaje : this.otros_antiguo,
      ).subscribe(res=>{
        setTimeout(()=>{
          this.router.navigate(['/ventas','ventas']);
          this.Cargando.next(false) ;
          if(res['codigo']==0){
            this.Notificacion.Snack("Se editó la venta con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al editar la venta","");
          }
        }, 300)
      })
    })
  }

  CorregirFecha( ){
    if ( moment(this.VentasForm.value.fechaventa).isValid() ) {
      let fecha = this.VentasForm.value.fechaventa ;
      this.VentasForm.get('fechapago').setValue( new Date(moment(fecha).endOf('month').toDate()) ) ;
      this.FechaPagoSeleccionada() ;
    }
  }

  CorregirFechaPago() {
    if ( this.VentasForm.get('fecha_fin_mes').value ) {
      let fecha = this.VentasForm.value.fechapago ;
      this.VentasForm.get('fechapago').setValue( new Date(moment(fecha).endOf('month').toDate()) ) ;
      this.FechaPagoSeleccionada() ;
    }
  }

  FechaPagoSeleccionada() {
    let fecha_venta = this.VentasForm.get('fechaventa').value ;
    let fecha_pago = this.VentasForm.get('fechapago').value ;

    let diferencia = moment(fecha_pago).diff(fecha_venta, 'days') ;

    if ( diferencia < 0 ) {
      this.VentasForm.get('fechapago').setErrors({'fecha_adelantada': true}) ;
    } else {
      this.VentasForm.get('fechapago').setErrors(null) ;
    }
    this.CrearCronograma() ;
  }

  RegistrarPago(cronograma){
    let Ventana = this.Dialogo.open(VentanaCrearCobranzaManualComponent,{
      data : { cliente : this.VentasForm.get('id_cliente').value, pendiente : cronograma.monto_pendiente, cronograma : cronograma.id_cronograma, tipo : 2 } ,
      width : '1200px' ,
      maxHeight : '80vh'
    }) ;

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.Notificacion.Snack("Se registró el pago satisfactoriamente", "") ;
        this.ActualizarOrdenCronograma(this.idventa, "fecha_vencimiento asc") ;
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al registrar el pago", "") ;
      }
    })
  }
  
  AnoElegido(ano_normalizado: Moment) {
    let ano_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.VentasForm.value.fechapago ) {
      ano_seleccionado = moment(this.VentasForm.value.fechapago) ;
    } else {
      ano_seleccionado = moment() ;
    }
    ano_seleccionado.year(ano_normalizado.year());
    this.VentasForm.get('fechapago').setValue(ano_seleccionado);
  }

  MesElegido(mes_normalizado: Moment, datepicker: MatDatepicker<Moment>) {
    let mes_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.VentasForm.value.fechapago ) {
      mes_seleccionado = moment(this.VentasForm.value.fechapago) ;
    } else {
      mes_seleccionado = moment() ;
    }

    mes_seleccionado.year(mes_normalizado.year()) ;
    mes_seleccionado.month(mes_normalizado.month()) ;

    this.VentasForm.get('fechapago').setValue(moment(mes_seleccionado).endOf('month').toDate());
    datepicker.close();
    this.FechaPagoSeleccionada() ;
  }

  ImprimirFormulario(){
    console.log(this.VentasForm)
  }

  CambiarVistaCronograma() {
    if ( this.VentasForm.get('vista_cronograma').value == 1 ) {
      this.ListadoVentas.Informacion.next(this.Cronograma);
    } else {
      this.ListadoVentas.Informacion.next(this.Cronograma_Periodos);
    }
  }

  EstablecerPenalidad() {
    let Ventana = this.Dialogo.open(VentanaGenerarPenalidadComponent,{
      data : {
        id_venta : this.id_venta ,
        monto_total : +this.VentasForm.get('montototal').value - +this.VentasForm.get('inicial').value ,
        numero_cuotas : this.VentasForm.get('cuotas').value ,
        tipo_pago : this.id_tipo_pago
      } ,
      width: '900px' ,
      maxHeight: '80vh'
    })
    
    Ventana.afterClosed().subscribe(res =>{
      if ( res ) {
        this.SeleccionarVentaxId(this.id_venta) ;
        this.Notificacion.Snack("Se crearon las cuotas de la penalidad satisfactoriamente","")
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al crear las cuotas de la penalidad","")
      }
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
    // this.Informacion.complete()
  }

  AsignarCuotas(cronograma) {
    this.Informacion.next(cronograma) ;
  }
}
