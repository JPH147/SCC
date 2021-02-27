import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { CreditosService } from './creditos.service';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ServiciosTipoPago } from 'src/app/core/servicios/tipopago';
import { ClienteService  } from '../../modulo-clientes/clientes/clientes.service';
import { forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosTelefonos } from 'src/app/core/servicios/telefonos';
import { ServiciosDirecciones } from 'src/app/core/servicios/direcciones';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { Location } from '@angular/common';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { URLIMAGENES } from 'src/app/core/servicios/url';
import { SeleccionarClienteComponent } from '../../compartido/componentes/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaEmergenteContacto} from '../../compartido/componentes/ventana-emergentecontacto/ventanaemergentecontacto';
import { ReglasEvaluacionService } from '../../modulo-maestro/reglas-evaluacion/reglas-evaluacion.service';
import { SeguimientosService } from '../../modulo-clientes/seguimientos/seguimientos.service';
import { RefinanciamientoService } from '../refinanciamiento/refinanciamiento.service';
import { VentanaPagosComponent } from '../../compartido/componentes/ventana-pagos/ventana-pagos.component';
import { VentanaEmergenteClientes } from '../../compartido/componentes/ventana-emergente/ventanaemergente' ;
import { VentanaCrearCobranzaManualComponent } from '../../modulo-cobranzas/cobranza-manual/ventana-crear-cobranza-manual/ventana-crear-cobranza-manual.component';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Store } from '@ngrx/store';
import { CobranzaJudicialService } from '../../modulo-cobranzas/cobranza-judicial/cobranza-judicial.service';
import { VentanaConfirmarComponent } from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaGenerarPagoTransaccionComponent } from '../../compartido/componentes/ventana-generar-pago-transaccion/ventana-generar-pago-transaccion.component';

import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { VentanaGenerarPenalidadComponent } from 'src/app/compartido/componentes/ventana-generar-penalidad/ventana-generar-penalidad.component';
import { VentanaGenerarInteresComponent } from 'src/app/compartido/componentes/ventana-generar-interes/ventana-generar-interes.component';
import { VentanaLiquidacionComponent } from 'src/app/compartido/componentes/ventana-liquidacion/ventana-liquidacion.component';
import { SeleccionarVendedorComponent } from 'src/app/compartido/componentes/seleccionar-vendedor/seleccionar-vendedor.component';
import { VentanaGenerarPagoTransaccionUnitariaComponent } from 'src/app/compartido/componentes/ventana-generar-pago-transaccion-unitaria/ventana-generar-pago-transaccion-unitaria.component';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss'],
})
export class CreditosComponent implements OnInit, AfterViewInit {

  public Hoy : Date = new Date();
  public Cargando = new BehaviorSubject<boolean>(false);
  public CreditosForm: FormGroup
  public id_credito: number;
  public id_presupuesto: number;
  public id_credito_editar: number;
  public id_cliente: number;
  public id_tipo : number;
  public garantes: FormArray;
  public vendedoresForm: FormArray;
  public editar_cronograma:number;
  public Reglas : Array<any>;
  public Couriers : Array<any>;
  public ruta: string;
  public numero_afiliacion : number;
  public cliente_afiliado : boolean;
  public numero_cuotas: number;
  public monto_cuota: number;
  public Tipos : Array<any> ;
  public total_cronograma : number; // No necesariamente es el mismo que el total del formulario por los intereses diarios
  public cliente_refinanciado : number ;
  public refinancimiento_total : number ;
  public refinanciamiento_transacciones : Array<any> ;
  public InformacionRefinanciamiento : any = {} ;
  public credito_refinanciado : boolean ;
  public codigo_credito : string ;

  public ListadoCronograma: CronogramaDataSource;
  public ListadoCronogramaAntiguo: CronogramaAntiguoDataSource;

  public ColumnasCronograma: Array<string>;
  public ColumnasCronogramaPeriodo: Array<string> = ["numero", "periodo", "monto_cuota" ,"total_planilla" ,"total_directo", "identificador_directo" ,"total_judicial", 'opciones' ] ;
  public Cronograma: Array<any> = [];
  public Cronograma_Periodos: Array<any> = [];
  public total_cronograma_editado: number;
  public diferencia: number;
  public hay_presupuesto_vendedor : boolean;

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
  public oficio : string = "";
  public otros : string = "";
  public papeles : string = "";

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
  public oficio_antiguo : string = "";
  public otros_antiguo : string = "";
  public papeles_antiguo : string = "";

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
  public oficio_nuevo : string = "";
  public otros_nuevo : string = "";
  public papeles_nuevo : string = "";

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
  public oficio_editar : boolean = false;
  public otros_editar : boolean = false;
  public papeles_editar : boolean = false;

  @ViewChild('InputCapital', { static: true }) FiltroCapital: ElementRef;
  @ViewChild('InputCuota', { static: true }) FiltroCuota: ElementRef;
  @ViewChild('InputInteres', { static: true }) FiltroInteres: ElementRef;
  // @ViewChild('Vendedor', { static: false }) VendedorAutoComplete : ElementRef;
  // @ViewChild('Autorizador', { static: false }) AutorizadorAutoComplete: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public ListadoVendedores: Array<any>;
  public ListadoAudorizadores: Array<any>;
  public ListadoSucursales: Array<any>;
  public ListadoTipoPago: Array<any>;

  public permiso : Rol ;
  public id_credito_estandar : number ;
  public estado : number ;
  public ListadoProcesos : Array<any> = [] ;
  public numero_procesos : number = 0 ;
  public monto_pagado : number = 0 ;

  public totales_monto_total : number ;
  public totales_interes_generado : number ;
  public totales_monto_pagado : number ;
  public totales_monto_pendiente : number ;
  public totales_total_cuotas : number ;
  public totales_total_pendiente : number ;
  public totales_total_pagadas : number ;

  public editar_documentos : boolean = false ;
  public cumple_penalidad : number = 1 ;
  public id_tipo_pago : number = 0 ;

  public cuotas_penalidad : number = 0 ;
  public cuotas_interes : number = 0 ;
  public editar_penalidad : boolean = false ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Servicio: CreditosService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private TelefonoServicio: ServiciosTelefonos,
    private ServiciosGenerales: ServiciosGenerales,
    private ServicioTipoPago: ServiciosTipoPago,
    private RServicio: ReglasEvaluacionService,
    private RfServicio : RefinanciamientoService,
    private SServicio : SeguimientosService,
    private location: Location,
    private Builder: FormBuilder,
    private Dialogo: MatDialog,
    private route : ActivatedRoute,
    private Notificacion: Notificaciones,
    private router: Router,
    private changeDetector : ChangeDetectorRef ,
    private _judiciales : CobranzaJudicialService ,
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.CrearFormulario();

    // Se cargan los arrays del inicio
    this.ListarVendedor("");
    this.ListarAutorizador("");
    this.ListarTipoPago();
    this.ListarSucursales();
    this.ListarReglas();
    this.ListarCouriers();
    this.ListarTiposCredito();

    this.id_tipo=2;

    this.ruta=URLIMAGENES.urlimages;

    this.editar_cronograma = 3;
    this.ListadoCronograma = new CronogramaDataSource();
    this.ListadoCronogramaAntiguo = new CronogramaAntiguoDataSource(this.Servicio) ;

    this.cliente_afiliado = true;
    this.numero_cuotas = 1;
    this.monto_cuota = 20;

    this.route.params.subscribe(params => {
      // Verifica si 'params' tiene datos
      if(Object.keys(params).length>0){

        this.Cargando.next(true);

        if(params['idpresupuesto']){
          // console.log(params)
          this.id_presupuesto=params['idpresupuesto'];
          this.NuevoCreditoPresupuesto(this.id_presupuesto);
        }

        if(params['idcliente']){
          this.NuevoCredito();
          this.id_cliente = +params['idcliente'] ;
          this.CreditosForm.get('id_cliente').setValue(this.id_cliente);
          this.ObtenerClientexId(this.id_cliente);
          this.ObtenerDireccion(this.id_cliente);
          this.ObtenerTelefono(this.id_cliente);
          this.VerificarAfiliacion(this.id_cliente, true);
        }

        if(params['idcredito']){
          this.id_credito_estandar = +params['idcredito'] ;
          this.id_credito=params['idcredito'];
          // this.id_credito=12;
          this.SeleccionarCredito(this.id_credito);
        }

        if(params['idcreditoeditar']){
          this.id_credito_estandar = +params['idcreditoeditar'] ;
          this.id_credito_editar=params['idcreditoeditar'];
          // this.id_credito_editar=12;
          this.SeleccionarCredito(this.id_credito_editar);
        }

        if(params['idclienterefinanciado']){
          this.route.paramMap
          .pipe(map(() => {
            // console.log(window.history.state)
            let data = window.history.state ;
            this.InformacionRefinanciamiento.id_vendedor = data.id_vendedor ;
            this.InformacionRefinanciamiento.vendedor = data.vendedor ;
            this.InformacionRefinanciamiento.capital = data.capital ;
            this.InformacionRefinanciamiento.cronograma = data.cronograma ;
            this.InformacionRefinanciamiento.cuotas = data.cuotas ;
            this.InformacionRefinanciamiento.interes = data.interes ;
            this.InformacionRefinanciamiento.total = data.total ;
            this.InformacionRefinanciamiento.fecha_credito = data.fecha_prestamo ;
            this.InformacionRefinanciamiento.fecha_inicio = data.fecha_inicio ;
            this.InformacionRefinanciamiento.aval = data.aval ;
            this.InformacionRefinanciamiento.aval_nombre = data.aval_nombre ;
            this.refinanciamiento_transacciones = data.transacciones ;
            this.cliente_refinanciado = params['idclienterefinanciado'];
            this.NuevoCreditoRefinanciamiento(this.cliente_refinanciado);
          })).subscribe()
        }

      }else{
       this.NuevoCredito();
      }
    })
  }

  ngAfterViewInit(): void {
    if(!this.id_credito && !this.id_presupuesto){

      merge(
        fromEvent(this.FiltroCuota.nativeElement,'keyup') ,
        fromEvent(this.FiltroCapital.nativeElement,'keyup') ,
        fromEvent(this.FiltroInteres.nativeElement,'keyup') ,
        this.CreditosForm.get('interes_diario_monto').valueChanges
      ).pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          if (
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

  ActualizarObservables() {
    merge(
      fromEvent(this.FiltroCuota.nativeElement,'keyup') ,
      fromEvent(this.FiltroCapital.nativeElement,'keyup') ,
      fromEvent(this.FiltroInteres.nativeElement,'keyup') ,
      this.CreditosForm.get('interes_diario_monto').valueChanges
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if (
          this.FiltroCapital.nativeElement.value &&
          this.FiltroCuota.nativeElement.value &&
          this.CreditosForm.value.fecha_pago
        ) {
          this.CrearCronograma()
        }
      })
    ).subscribe()
  }

  pad(caracter : string, tamano : number): string {
    let s = caracter ;
    for (let index = caracter.length ; index < tamano; index++ ) {
      s = "0" + s ;
    }
    return s;
  }

  CrearFormulario(){
    this.CreditosForm = this.Builder.group({
      id_acreedor :[{value: 0, disabled: true},[
      ]],
      id_cliente :[{value: null, disabled: false},[
        Validators.required
      ]],
      cliente :[{value: null, disabled: false},[
      ]],
      dni :[{value: null, disabled: false},[
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
      // Sobre la afiliación
      afiliacion_tiempo :[{value: null, disabled: false},[
      ]],
      afiliacion_monto :[{value: null, disabled: false},[
        Validators.pattern ('[0-9- ]+')
      ]],
      afiliacion_tipo_pago :[{value: 1, disabled: false},[
      ]],
      afiliacion_fecha_afiliacion :[{value: moment(new Date()), disabled: false},[
      ]],
      afiliacion_fecha_vencimiento :[{value: moment(new Date()).endOf('month').toDate(), disabled: false},[
      ]],
      ///////////////////////////////////////////////////////////////
      garante :[{value: false, disabled: false},[
      ]],
      fecha_credito: [{value: new Date(), disabled: false},[
        Validators.required
      ]],
      sucursal: [{value: null, disabled: false},[
        Validators.required
      ]],
      codigo: [{value: null, disabled: false},[ // Es lo que se muestra en la vista {{numero_afiliacion + numero_credito}}
        Validators.required
      ]],
      numero: [{value: null, disabled: false},[ // Es el número del crédito
      ]],
      interes_diario: [{value: (moment(new Date()).date()>15 ? false : true), disabled: false},[
      ]],
      interes_diario_monto: [{value: 0, disabled: false},[ // Es el número del crédito
      ]],
      fecha_pago: [{value: moment(new Date()).endOf('month').toDate(), disabled: false},[
        Validators.required,
      ]],
      ////////
      tipo_credito: [{value: null, disabled: false},[
        Validators.required
      ]],
      tipo_pago: [{value: null, disabled: false},[
        Validators.required
      ]],
      interes: [{value: 0, disabled: false},[
        Validators.required,
        Validators.min(0)
      ]],
      capital: [{value: null, disabled: false},[
        Validators.required
      ]],
      cuotas: [{value: null, disabled: false},[
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]],
      total: [{value: null, disabled: false},[
        Validators.required
      ]],
      id_vendedor: [{value: null, disabled: false},[
      ]],
      vendedor: [{value: null, disabled: false},[
      ]],
      id_autorizador: [{value: null, disabled: false},[
      ]],
      autorizador: [{value: null, disabled: false},[
      ]],
      observaciones: [{value: "", disabled: false},[
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
      fecha_fin_mes: [{ value : true, disabled : false },[
      ]],
      garantes: this.Builder.array([]),
      vendedoresForm: this.Builder.array([]),
      // 1. Ver cuotas, 2. Ver periodos
      vista_cronograma: [{ value : 2, disabled : false },[
      ]],
      deuda_hasta_hoy: [{ value : null, disabled : false },[
      ]],
      monto_limite_penalidad: [{ value : null, disabled : false },[
      ]],
      monto_penalidad: [{ value : null, disabled : false },[
      ]],
      adicional_penalidad: [{ value : null, disabled : false },[
      ]],
      // Sobre los intereses y penalidades
      estado_penalidad: [{ value : null, disabled : false },[
      ]],
      estado_interes: [{ value : null, disabled : false },[
      ]],
      pagado_interes: [{ value : null, disabled : false },[
      ]],
      // Para saber si el crédito ya ha sido cancelado
      id_liquidacion: [{ value : null, disabled : false },[
      ]],
      pagado: [{ value : null, disabled : false },[
      ]],
      agregar_afiliacion : [{ value : true , disabled : false }, [
      ]],
    }) ;

    this.vendedoresForm = this.CreditosForm.get('vendedoresForm') as FormArray;
  }

  CrearVendedor(): FormGroup{
    return this.Builder.group({
      id_vendedor: [{value: null, disabled: false}, [
        Validators.required
      ]],
      vendedor_nombre: [{value: null, disabled: false}, [
        Validators.required
      ]],
      estado: [{value:1, disabled: false}, [
      ]],
    }) ;
  }

  AgregarVendedor():void{
    this.vendedoresForm.push(this.CrearVendedor());
  };

  EliminarVendedor(index){
    this.vendedoresForm.removeAt(index);
  }

  ResetearVendedoresFormArray(){
    while (this.vendedoresForm.length !== 0) {
      this.vendedoresForm.removeAt(0) ;
    }
  }

  NuevoCredito(){
    this.changeDetector.detectChanges();
    this.papeles_editar=true;
    this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
    this.CreditosForm.get('id_acreedor').enable() ;
  }

  NuevoCreditoPresupuesto(id){
    this.NuevoCredito();
    this.id_cliente=id;
    this.CreditosForm.get('id_cliente').setValue(id);
    this.ObtenerClientexId(id);
    this.ObtenerDireccion(id);
    this.ObtenerTelefono(id);
    this.VerificarAfiliacion(id, true);
    this.Servicio.SeleccionarPresupuesto(id).subscribe(res=>{
      this.CreditosForm.get('capital').setValue(res.capital);
      this.CreditosForm.get('cuotas').setValue(res.cuotas);
      this.CreditosForm.get('total').setValue(res.total);

      this.Cronograma=res.cronograma;
      this.ListadoCronograma.AsignarInformacion(this.Cronograma);
      this.CalcularTotalCronograma();

      if(res.id_vendedor){
        this.hay_presupuesto_vendedor=true;
        this.CreditosForm.get('id_vendedor').setValue(res.id_vendedor);
        this.CreditosForm.get('vendedor').setValue(res.vendedor);
      }

      if(res.garantes.length>0){
        this.CreditosForm.get('garante').setValue(true);
        res.garantes.forEach((item)=>{
          this.AgregarGarante(false);
          this.CreditosForm['controls'].garantes['controls'][0].get('id_cliente').setValue(item.id_cliente)
          this.CreditosForm['controls'].garantes['controls'][0].get('nombre').setValue(item.cliente)
          this.ObtenerDireccionGarante(item.id_cliente,0);
          this.ObtenerTelefonoGarante(item.id_cliente,0);
        })

      }

      this.CreditosForm.get('fecha_pago').setValue( moment(res.cronograma[0].fecha_vencimiento).toDate() );
      this.CreditosForm.get('interes_diario').disable();
    })
  }

  NuevoCreditoRefinanciamiento(id){
    this.NuevoCredito();
    this.id_cliente=id;
    this.CreditosForm.get('id_cliente').setValue(id);
    this.Servicio.Verificar_Afiliacion(this.id_cliente).subscribe(res=>{
      if(res['codigo_afiliacion']){
        this.numero_afiliacion=res['codigo_afiliacion'];
        this.ObtenerNumero(this.id_cliente);
        this.cliente_afiliado=true;
      }
    }) ;

    this.ObtenerClientexId(this.id_cliente);
    this.ObtenerDireccion(this.id_cliente);
    this.ObtenerTelefono(this.id_cliente);

    this.CreditosForm.get('capital').setValue(this.InformacionRefinanciamiento.capital);
    this.CreditosForm.get('interes').setValue(this.InformacionRefinanciamiento.interes);
    this.CreditosForm.get('cuotas').setValue(this.InformacionRefinanciamiento.cuotas);
    this.CreditosForm.get('total').setValue(this.InformacionRefinanciamiento.total);
    this.CreditosForm.get('interes_diario').disable();

    this.CreditosForm.get('fecha_credito').setValue(this.InformacionRefinanciamiento.fecha_credito) ;
    this.CreditosForm.get('fecha_pago').setValue(this.InformacionRefinanciamiento.fecha_inicio) ;

    this.CreditosForm.get('id_vendedor').setValue(this.InformacionRefinanciamiento.id_vendedor);
    this.CreditosForm.get('vendedor').setValue(this.InformacionRefinanciamiento.vendedor);

    if( this.InformacionRefinanciamiento.aval ) {
      this.CreditosForm.get('garante').setValue( true ) ;
      this.AgregarGarante(false);
      this.CreditosForm['controls'].garantes['controls'][0].get('id_cliente').setValue( this.InformacionRefinanciamiento.aval )
      this.CreditosForm['controls'].garantes['controls'][0].get('nombre').setValue( this.InformacionRefinanciamiento.aval_nombre )
      this.ObtenerDireccionGarante( this.InformacionRefinanciamiento.aval , 0 );
      this.ObtenerTelefonoGarante( this.InformacionRefinanciamiento.aval , 0 );
      this.EliminarGarante(1);
    } else {
      this.CreditosForm.get('garante').disable() ;
    }

    this.Cronograma = this.InformacionRefinanciamiento.cronograma ;
    this.ListadoCronograma.AsignarInformacion(this.Cronograma);

    // this.VerificarAfiliacion(this.id_cliente);
  }

  SeleccionarCredito(id_credito) {
    this.Cargando.next(true) ;
    this.ListarProcesos(id_credito) ;
    this.ListarVendedores(id_credito) ;
    let observacion_corregida : string;
    let codigo_string : string;
    let codigo_largo : number;

    this.Servicio.Seleccionar(id_credito).subscribe(res=>{
      this.Cargando.next(false);

      this.CreditosForm.get('id_acreedor').setValue(res.id_acreedor) ;

      this.CreditosForm.get('deuda_hasta_hoy').setValue(res.deuda_hasta_hoy) ;
      this.CreditosForm.get('monto_limite_penalidad').setValue(res.monto_limite_penalidad) ;
      this.CreditosForm.get('monto_penalidad').setValue(res.monto_penalidad) ;
      this.CreditosForm.get('adicional_penalidad').setValue(res.adicional_penalidad) ;

      this.CreditosForm.get('estado_penalidad').setValue(res.estado_penalidad) ;

      if ( this.CreditosForm.get('estado_penalidad').value == 3 ) {
        this.ColumnasCronogramaPeriodo = ["numero", "periodo", "monto_cuota_anterior", "monto_cuota" ,"total_planilla" ,"total_directo", "identificador_directo" ,"total_judicial", 'opciones' ] ;
        this.ConsultarInfomacionAnterior() ;
      } else {
        this.ColumnasCronogramaPeriodo = ["numero", "periodo", "monto_cuota" ,"total_planilla" ,"total_directo", "identificador_directo" ,"total_judicial", 'opciones' ] ;
      }

      this.CreditosForm.get('pagado_interes').setValue(res.pagado_interes) ;
      this.CreditosForm.get('estado_interes').setValue(res.estado_interes) ;

      this.CreditosForm.get('id_liquidacion').setValue(res.id_liquidacion) ;
      this.CreditosForm.get('pagado').setValue(res.pagado) ;

      /////////////////////////////////////////////////////////
      // Se da el formato al código
      codigo_string=res.numero.toString();
      codigo_largo=codigo_string.length;

      for(let i = codigo_largo; i < 3; i++){
        codigo_string = "0" + codigo_string;
      }

      this.id_tipo=res.id_tipo ;
      this.cumple_penalidad = res.cumple_penalidad ;
      this.id_tipo_pago = res.id_tipo_pago ;
      this.cuotas_penalidad = res.cuotas_penalidad ;
      this.cuotas_interes = res.cuotas_interes ;

      if(this.id_tipo==1){
        this.CreditosForm.get('codigo').setValue(res.codigo)
      }else{
        this.CreditosForm.get('codigo').setValue(res.codigo + "-" +codigo_string)
      }
      ////////////////////////////

      this.CreditosForm.get('id_cliente').setValue(res.id_cliente);
      this.CreditosForm.get('fecha_credito').setValue(moment(res.fecha).toDate());
      this.CreditosForm.get('cliente').setValue(res.cliente);
      this.CreditosForm.get('dni').setValue( this.pad(res.cliente_dni.toString(),8) );
      this.CreditosForm.get('cargo').setValue(res.cliente_cargo);
      this.CreditosForm.get('trabajo').setValue(res.cliente_trabajo);
      this.CreditosForm.get('direccion').setValue(res.cliente_direccion);
      this.CreditosForm.get('telefono').setValue(res.cliente_telefono);
      this.CreditosForm.get('fecha_pago').setValue(moment(res.fecha_pago).toDate());
      this.CreditosForm.get('interes_diario_monto').setValue(res.interes_diario);

      // Si la fecha de pago es el último día del mes, se activa el control 'fecha_fin_mes'
      let fecha_pago = this.CreditosForm.get('fecha_pago').value ;
      let ultimo_fecha_pago  = moment(this.CreditosForm.get('fecha_pago').value).endOf('month').toDate() ;
      if ( moment(fecha_pago).isBefore(ultimo_fecha_pago, 'day') ) {
        this.CreditosForm.get('fecha_fin_mes').setValue(false) ;
      } else {
        this.CreditosForm.get('fecha_fin_mes').setValue(true) ;
      }

      if ( this.CreditosForm.get('interes_diario_monto').value > 0 ) {
        this.CreditosForm.get('interes_diario').setValue(true) ;
      }

      this.totales_monto_total = res.monto_total ;
      this.totales_interes_generado = res.interes_generado ;
      this.totales_monto_pagado = res.monto_pagado ;
      this.totales_monto_pendiente = res.monto_pendiente ;
      this.totales_total_cuotas = res.total_cuotas ;
      this.totales_total_pendiente = res.total_pendiente ;
      this.totales_total_pagadas = res.total_pagadas ;

      this.CreditosForm.get('interes').setValue(res.interes);
      this.CreditosForm.get('capital').setValue(res.capital);
      this.CreditosForm.get('cuotas').setValue(res.numero_cuotas);
      this.CreditosForm.get('total').setValue(res.total);

      this.CreditosForm.get('vendedor').setValue(res.id_vendedor >0 ? res.vendedor : null);
      this.CreditosForm.get('id_vendedor').setValue(res.id_vendedor > 0 ? res.id_vendedor : null);
      this.CreditosForm.get('autorizador').setValue(res.id_autorizador> 0 ? res.autorizador : null);
      this.CreditosForm.get('id_autorizador').setValue(res.id_autorizador > 0 ? res.id_autorizador : null);

      this.estado = res.id_estado ;

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
      res.pdf_otros!="" ? this.otros=URLIMAGENES.carpeta+'credito/'+res.pdf_otros : null;
      res.pdf_oficio!="" ? this.oficio=URLIMAGENES.carpeta+'credito/'+res.pdf_oficio : null;

      this.foto_editar = false ;
      this.dni_editar = false ;
      this.cip_editar = false ;
      this.planilla_editar = false ;
      this.voucher_editar = false ;
      this.recibo_editar = false ;
      this.casilla_editar = false ;
      this.transaccion_editar = false ;
      this.autorizacion_editar = false ;
      this.tarjeta_editar = false ;
      this.compromiso_editar = false ;
      this.letra_editar = false ;
      this.ddjj_editar = false ;
      this.oficio_editar = false ;
      this.otros_editar = false ;

      if( res.id_credito_refinanciado ) {
        this.credito_refinanciado = true ;
        this.codigo_credito = res.credito_refinanciado ;
      }

      if(res['garantes'].garantes.length>0){
        this.CreditosForm.get('garante').setValue(true);
        res['garantes'].garantes.forEach((item,index)=>{
          this.AgregarGarante(false);
          this.CreditosForm['controls'].garantes['controls'][index].get('id_cliente').setValue(item.id_cliente);
          this.CreditosForm['controls'].garantes['controls'][index].get('nombre').setValue(item.cliente_nombre);
          this.CreditosForm['controls'].garantes['controls'][index].get('direccion').setValue(item.cliente_direccion);
          this.CreditosForm['controls'].garantes['controls'][index].get('telefono').setValue(item.cliente_telefono);
        })
      }

      if( res['courier'].id ){
        this.CreditosForm.get('papeles').setValue(true);
        this.CreditosForm.get('papeles_id').setValue(res['courier'].id);
        this.CreditosForm.get('papeles_fecha_envio').setValue(res['courier'].fecha);
        this.CreditosForm.get('papeles_courier').setValue(res['courier'].id_courier);
        this.CreditosForm.get('papeles_seguimiento').setValue(res['courier'].numero_seguimiento);
        this.CreditosForm.get('papeles_observaciones').setValue(res['courier'].observacion);
        res['courier'].foto !="" ? this.papeles=URLIMAGENES.carpeta+'credito/'+res['courier'].foto : null;
      }

      if( this.id_credito ) {
        this.CreditosForm.get('id_acreedor').disable() ;
        this.CreditosForm.get('interes_diario').disable();
        this.CreditosForm.get('tipo_credito').setValue(res.tipo);
        this.CreditosForm.get('sucursal').setValue(res.sucursal);
        this.CreditosForm.get('tipo_pago').setValue(res.tipo_pago);
        this.CreditosForm.get('observaciones').setValue(observacion_corregida);

        this.ColumnasCronograma = ['numero', 'tipo_pago','fecha_vencimiento', 'monto', 'interes_generado','monto_pagado','estado', 'opciones'];
        this.ObtenerCronograma(this.id_credito, 0);

        if(res['garantes'].garantes.length>0){
          res['garantes'].garantes.forEach((item,index)=>{
            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;

            this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
          })
        }
      }

      if ( this.editar_documentos ) {
        this.CreditosForm.get('id_acreedor').disable() ;
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
        this.otros_antiguo=res.pdf_otros;
        this.oficio_antiguo=res.pdf_oficio;

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
        res.pdf_oficio!="" ? this.oficio_editar=false : this.oficio_editar=true;
        res.pdf_otros!="" ? this.otros_editar=false : this.otros_editar=true;
      }

      if ( this.id_credito_editar ) {
        this.CreditosForm.get('id_acreedor').enable() ;
        this.CreditosForm.get('interes_diario').enable() ;
        if( res['courier'].id ){
          this.CreditosForm.get('papeles_courier').setValue(res['courier'].id_courier);
          this.papeles_antiguo=res['courier'].foto;
          res['courier'].foto !="" ? this.papeles_editar=false : this.papeles_editar=true;
        }

        if(this.id_tipo==1){
          this.CreditosForm.get('vendedor').clearValidators();
          this.CreditosForm.get('id_vendedor').clearValidators();
          this.CreditosForm.get('autorizador').clearValidators();
          this.CreditosForm.get('id_autorizador').clearValidators();
        }

        this.CreditosForm.get('tipo_credito').setValue(this.id_tipo>1 ? res.id_tipo : res.tipo);
        this.CreditosForm.get('sucursal').setValue(res.id_sucursal);
        this.CreditosForm.get('tipo_pago').setValue(res.id_tipo_pago);
        this.CreditosForm.get('observaciones').setValue(res.observaciones);

        this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
        this.CrearCronograma() ;
        // this.Cronograma = res.cronograma;
        // this.CalcularTotalPagado(this.Cronograma) ;
        // this.ListadoCronograma.AsignarInformacion(this.Cronograma);

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
        this.otros_antiguo=res.pdf_otros;
        this.oficio_antiguo=res.pdf_oficio;

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
        res.pdf_otros!="" ? this.otros_editar=false : this.otros_editar=true;
        res.pdf_oficio!="" ? this.oficio_editar=false : this.oficio_editar=true;

        if(res['garantes'].garantes.length>0){
          res['garantes'].garantes.forEach((item,index)=>{
            this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf_antiguo').setValue(item.dni_pdf);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf_antiguo').setValue(item.cip_pdf);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf_antiguo').setValue(item.planilla_pdf);

            let dni_editar = item.dni_pdf == "" ? true : false;
            let cip_editar = item.cip_pdf == "" ? true : false;
            let planilla_editar = item.planilla_pdf == "" ? true : false;

            this.CreditosForm['controls'].garantes['controls'][index].get('dni_editar').setValue(dni_editar);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_editar').setValue(cip_editar);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_editar').setValue(planilla_editar);

            let dni = item.dni_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.dni_pdf : null ;
            let cip = item.cip_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.cip_pdf : null ;
            let planilla = item.planilla_pdf !="" ? URLIMAGENES.carpeta+'venta/'+ item.planilla_pdf : null ;

            this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(dni);
            this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(cip);
            this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(planilla);
          })
        }
      }
    }) ;
  }

  ObtenerCronograma(id_credito: number, tipo_cuota : number){
    this.Cargando.next(true) ;

    this.Servicio.ObtenerCrongrama(id_credito, tipo_cuota).subscribe(res=>{
      this.Cargando.next(false) ;
      this.Cronograma = res;
      this.CalcularTotalPagado(this.Cronograma) ;
      if ( this.CreditosForm.get('vista_cronograma').value == 1 ) {
        this.ListadoCronograma.AsignarInformacion(this.Cronograma);
      }
    })

    this.Servicio.ObtenerCrongramaPagosxPeriodo(id_credito).subscribe(res=>{
      this.Cronograma_Periodos = res;
      if ( this.CreditosForm.get('vista_cronograma').value == 2 ) {
        this.ListadoCronograma.AsignarInformacion(this.Cronograma_Periodos);
      }
    })
  }

  ListarTiposCredito(){
    this.Servicio.ListarTipos().subscribe(res=>{
      this.Tipos=res
    })
  }

  TipoCreditoSeleccionado(evento){
    if(evento.value==3){
      this.CreditosForm.get('id_vendedor').setValidators([Validators.required]);
      this.CreditosForm.get('id_vendedor').updateValueAndValidity();
    } else {
      this.CreditosForm.get('id_vendedor').clearValidators();
      this.CreditosForm.get('id_vendedor').updateValueAndValidity();
    }
  }

  ListarCouriers(){
    this.ServiciosGenerales.ListarCourier("",1,50).subscribe(res=>{
      this.Couriers = res['data'].courier
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
        // console.log(res)
        this.CreditosForm.get('id_cliente').setValue(res.id);
        this.ObtenerClientexId(res.id);
        this.ObtenerDireccion(res.id);
        this.ObtenerTelefono(res.id);
        this.VerificarAfiliacion(res.id, true);
      }
    })
  }

  VerificarAfiliacion(id_cliente, actualizar_interes : boolean){
    // console.log(id_cliente);
    this.Servicio.Verificar_Afiliacion(id_cliente).subscribe(res=>{
      // console.log(res)
      if(res['codigo_afiliacion']){
        this.numero_afiliacion=res['codigo_afiliacion'];
        if ( actualizar_interes ) {
          this.VerificarInteres(res['total_pagado']);
        }
        this.cliente_afiliado=true;
      }else{
        this.VerificarInteres(0);
        // this.numero_afiliacion=res['codigo_afiliacion'];
        this.cliente_afiliado=false;
      }

      this.VerificarCondicionesAfiliacion(id_cliente);
    })
  }

  VerificarInteres(monto){
    this.Servicio.Verificar_Interes(monto).subscribe(res=>{
      // console.log(res);
      this.CreditosForm.get('interes').setValue(res);
      if( !this.id_presupuesto ){
        this.CrearCronograma();
      }
    })
  }

  VerificarCondicionesAfiliacion(id_cliente){
    this.Servicio.SeleccionarParametros().subscribe(res=>{
      // console.log(res)
      if(!this.cliente_afiliado) this.numero_afiliacion = res.numero;
      this.ObtenerNumero(id_cliente);
      this.CreditosForm.get('afiliacion_tiempo').setValue(res.tiempo)
      // this.numero_cuotas = +res.tiempo*12;
      this.numero_cuotas = 1 ;
      this.CreditosForm.get('afiliacion_monto').setValue(res.monto)
    })
  }

  ObtenerNumero(cliente:number){
    this.Servicio.Proximo(cliente).subscribe(res=>{

      this.CreditosForm.get('numero').setValue(res)

      let codigo_string: string = res.toString();
      let codigo_string_length: number = res.toString().length;

      for( let i = codigo_string_length ; i < 3 ; i++ ){
        codigo_string = "0" + codigo_string;
      }

      this.CreditosForm.get('codigo').setValue(this.numero_afiliacion + "-" + codigo_string);
    })
  }

  ObtenerClientexId(id_cliente) {
    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        this.CreditosForm.get('cliente').setValue(res.nombre);
        this.CreditosForm.get('dni').setValue(res.dni);
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
    this.CreditosForm.get('dni').setValue("");
    this.CreditosForm.get('cargo').setValue("");
    this.CreditosForm.get('trabajo').setValue("");
    this.CreditosForm.get('direccion').setValue("");
    this.CreditosForm.get('telefono').setValue("");

    this.CreditosForm.get('numero').setValue(null)
    this.CreditosForm.get('codigo').setValue(null);
    // this.cliente_afiliado=true;
  }

  EditarCliente(){
    let id_cliente : number = this.CreditosForm.value.id_cliente ;
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
      'dni_editar': [{value: bool, disabled: false}, [
      ]],
      'cip_editar': [{value: bool, disabled: false}, [
      ]],
      'planilla_editar': [{value:bool, disabled: false}, [
      ]],
      'dni_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_antiguo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_antiguo': [{value:null, disabled: false}, [
      ]],
      'dni_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'cip_pdf_nuevo': [{value: null, disabled: false}, [
      ]],
      'planilla_pdf_nuevo': [{value:null, disabled: false}, [
      ]],
      'estado': [{value:1, disabled: false}, [
      ]],
    })
  }

  SeleccionarGarante(index){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px",
      data: { cliente : this.CreditosForm.value.id_cliente }
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CreditosForm['controls'].garantes['controls'][index].get('id_cliente').setValue(res.id)
        this.CreditosForm['controls'].garantes['controls'][index].get('nombre').setValue(res.nombre)
        this.ObtenerDireccionGarante(res.id,index);
        this.ObtenerTelefonoGarante(res.id,index);
      }
    })
  }

  ObtenerDireccionGarante(id_cliente, index) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm['controls'].garantes['controls'][index].get('direccion').setValue(res['data'].direcciones[0].direccioncompleta)
      }
    });
  }

  ObtenerTelefonoGarante(id_cliente, index) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.CreditosForm['controls'].garantes['controls'][index].get('telefono').setValue(res['data'].telefonos[0].tlf_numero)
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
      this.ObtenerTelefonoGarante(id_cliente,index);
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
    this.ServicioTipoPago.ListarTipoPago(1).subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  // Se utiliza para elegir al acreedor del credito
  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,500).subscribe( res => {
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
    this.ListarVendedor("");
  }

  ListarAutorizador(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,50).subscribe( res => {
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
    this.ListarVendedor("");
  }

  SubirArchivo(evento, orden){
    console.log(evento) ;
    if(this.id_credito_editar || this.editar_documentos){
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
      if ( orden == 14 ) this.otros_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 15 ) this.papeles_nuevo = evento.serverResponse.response.body.data;
      if ( orden == 16 ) this.oficio_nuevo = evento.serverResponse.response.body.data;
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
      if ( orden == 14 ) this.otros = evento.serverResponse.response.body.data;
      if ( orden == 15 ) this.papeles = evento.serverResponse.response.body.data;
      if ( orden == 16 ) this.oficio = evento.serverResponse.response.body.data;
    }
  }

  SubirArchivoAval(evento, index, orden){
    if (!this.id_credito_editar) {
      if(orden==1) this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf').setValue(evento.serverResponse.response.body.data);
      if(orden==2) this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf').setValue(evento.serverResponse.response.body.data);
      if(orden==3) this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf').setValue(evento.serverResponse.response.body.data);
    } else {
      if(orden==1) this.CreditosForm['controls'].garantes['controls'][index].get('dni_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
      if(orden==2) this.CreditosForm['controls'].garantes['controls'][index].get('cip_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
      if(orden==3) this.CreditosForm['controls'].garantes['controls'][index].get('planilla_pdf_nuevo').setValue(evento.serverResponse.response.body.data);
    }
  }

  CambioFechaCredito(){
    if(this.id_tipo>1){
      if( moment(this.CreditosForm.value.fecha_credito).date() < 15) {
        this.CreditosForm.get('interes_diario').setValue(true);
      } else {
        this.CreditosForm.get('interes_diario').setValue(false);
      }
      this.CrearCronograma()
    }
  }

  CambiarInteresPorDia(){
    this.CreditosForm.get('interes_diario_monto').setValue(0) ;
    this.CrearCronograma() ;
  }

  /*Cronograma */
  CrearCronograma(){

    if(this.CreditosForm.get('cuotas').valid && this.CreditosForm.value.interes>=0 && !this.cliente_refinanciado){

      this.Cronograma=[];
      let i = 1;

      //Se calcula el monto total y el interés
      let interes : number =  Math.round(+this.CreditosForm.value.capital * (this.CreditosForm.value.interes /100 ) *100 ) / 100;
      let total : number = Math.round(+this.CreditosForm.value.capital * ( 1 + +this.CreditosForm.value.cuotas * this.CreditosForm.value.interes / 100 ) *100 ) / 100
      // this.CreditosForm.get('total').setValue( total );

      // Se calculan las fechas de las cuotas
      let ano_pago = moment(this.CreditosForm.value.fecha_pago).year();
      let mes_pago = moment(this.CreditosForm.value.fecha_pago).month();
      let dia_pago = moment(this.CreditosForm.value.fecha_pago).date();
      let fecha_corregida : Date = new Date(ano_pago, mes_pago, dia_pago);
      let fecha : Date;

      // Se evalúa si el crédito se da antes o después de quincena
      let dia_credito :number = moment(this.CreditosForm.value.fecha_credito).date();
      let mes_credito :number = moment(this.CreditosForm.value.fecha_credito).month();
      let ano_credito :number = moment(this.CreditosForm.value.fecha_credito).year();
      let dias_mes : number = moment(this.CreditosForm.value.fecha_credito).daysInMonth();

      // Se calcula el interés por día
      let interes_truncado : number = 0 ;
      if ( this.CreditosForm.value.interes == 0 ) {
        this.CreditosForm.get('interes_diario_monto').setValue(0) ;
        interes_truncado = 0 ;
      } else {
        if( this.CreditosForm.value.interes_diario ) {
          if ( this.CreditosForm.get('interes_diario_monto').value > 0 ) {
            interes_truncado = this.CreditosForm.get('interes_diario_monto').value ;
          } else {
            interes_truncado = Math.round( ((dias_mes - dia_credito) / dias_mes) * interes * 100 ) / 100 ;
            this.CreditosForm.get('interes_diario_monto').setValue(interes_truncado) ;
          }
        }
      }

      // Si el crédito es antes de quincena, se paga a fin de mes los intereses truncados
      if( this.CreditosForm.value.interes_diario ){
        this.Cronograma.push({
          numero: 0,
          fecha_vencimiento: moment(this.CreditosForm.value.fecha_credito).endOf('month'),
          monto_cuota: interes_truncado,
          interes : interes_truncado,
          capital : 0
        })
      }

      // Se pagan los intereses mientras no se cancele el crédito
      if( mes_pago - mes_credito > 1){
        for( i; i<mes_pago - mes_credito; i++){
          fecha=moment(new Date(ano_credito, mes_credito, dia_pago)).add(i, 'months').toDate();
          this.Cronograma.push({
            numero: i,
            fecha_vencimiento: fecha,
            monto_cuota: interes,
            interes : interes,
            capital : 0
          })
        }
      };

      // Se calcula el monto de las cuotas normales
      let monto : number = Math.round((total)*100/this.FiltroCuota.nativeElement.value)/100
      let nueva_fecha : Date = this.CreditosForm.value.fecha_pago ;
      for (let j = 1; j<=this.FiltroCuota.nativeElement.value; j++) {
        // fecha=moment(fecha_corregida).add(j-1, 'months').toDate();
        let fecha_cronograma = this.AgregarMes(nueva_fecha, j-1) ;

        this.Cronograma.push({
          numero: i+j-1,
          fecha_vencimiento: fecha_cronograma,
          monto_cuota: monto ,
          interes : interes,
          capital : monto-interes
        })
      }

      this.CreditosForm.get('total').setValue(
        this.Cronograma.reduce( (acumulador, item)=>{
          return Math.round( ( acumulador + item.monto_cuota ) * 100 ) / 100
        },0 )
      );

      this.CalcularTotalCronograma();
      this.ListadoCronograma.AsignarInformacion(this.Cronograma);
    }
  }

  AgregarMes(fecha: Date, numero_meses: number) : Date {
    let fecha_corregida : Date ;

    let ultimo_dia : Date = moment(fecha).endOf('month').toDate() ;

    let diferencia = moment(fecha).diff(ultimo_dia, 'days') ;

    if ( diferencia == 0 ) {
      fecha_corregida = moment(fecha).add(numero_meses,'month').endOf('month').toDate() ;
    } else {
      fecha_corregida = moment(fecha).add(numero_meses,'month').toDate() ;
    }

    return fecha_corregida ;
  }

  CalcularTotalCronograma(){

    this.total_cronograma_editado=0;

    this.Cronograma.forEach((item)=>{
      this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
    })
    // console.log(this.Cronograma);
    // console.log(this.diferencia);
    this.diferencia= Math.abs(Math.round((this.CreditosForm.value.total-this.total_cronograma_editado)*100)/100);

  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  HayPapeles(evento){
    this.CreditosForm.get('papeles').setValue(evento.checked)
  }

  AbrirDocumento(url){
    if(url){
      window.open(url, "_blank");
    }
  }

  VerDetallePagos( cronograma ){
    let ventana = this.Dialogo.open(VentanaPagosComponent,{
      width : '900px',
      data: { tipo : 1 , cuota : cronograma.id_cronograma }
    })
  }

  VerDetallePagosPeriodos(periodo){
    let Ventana = this.Dialogo.open(VentanaPagosComponent,{
      width: '900px',
      data: { tipo: 1 , transaccion: this.id_credito_estandar, periodo : periodo }
    })
  }

  Atras(){
    this.location.back()
  }

  FechaAfiliacionSeleccionada(){
    this.CreditosForm.get('fecha_credito').setValue( this.CreditosForm.value.afiliacion_fecha_vencimiento ) ;
    this.CorregirFecha();
  }

  CorregirFecha(){
    if ( moment(this.CreditosForm.value.fecha_credito).isValid() ) {
      let fecha = this.CreditosForm.value.fecha_credito ;
      this.CreditosForm.get('fecha_pago').setValue( new Date(moment(fecha).endOf('month').toDate()) )
      this.CambioFechaCredito() ;
      this.FechaPagoSeleccionada() ;
    }
  }

  CorregirFechaPago() {
    if ( this.CreditosForm.get('fecha_fin_mes').value ) {
      let fecha = this.CreditosForm.value.fecha_pago ;
      this.CreditosForm.get('fecha_pago').setValue( new Date(moment(fecha).endOf('month').toDate()) )
      this.FechaPagoSeleccionada() ;
    }
  }

  FechaPagoSeleccionada() {
    let fecha_credito = this.CreditosForm.get('fecha_credito').value ;
    let fecha_pago = this.CreditosForm.get('fecha_pago').value ;

    let diferencia = moment(fecha_pago).diff(fecha_credito, 'days') ;
    if ( diferencia < 0 ) {
      this.CreditosForm.get('fecha_pago').setErrors({'fecha_adelantada': true}) ;
    } else {
      this.CreditosForm.get('fecha_pago').setErrors(null) ;
    }
    this.CrearCronograma() ;
  }


  CorregirFechaAfiliacion(){
    if ( moment(this.CreditosForm.value.afiliacion_fecha_afiliacion).isValid() ) {
      let fecha = this.CreditosForm.value.afiliacion_fecha_afiliacion ;
      this.CreditosForm.get('afiliacion_fecha_vencimiento').setValue( new Date(moment(fecha).endOf('month').toDate()) )
    }
  }

  FechaPagoAfiliacionSeleccionada() {
    let afiliacion_fecha_afiliacion = this.CreditosForm.get('afiliacion_fecha_afiliacion').value ;
    let fecha_pago = this.CreditosForm.get('afiliacion_fecha_vencimiento').value ;
    if ( fecha_pago < afiliacion_fecha_afiliacion ) {
      this.CreditosForm.get('afiliacion_fecha_vencimiento').setErrors({'fecha_adelantada': true}) ;
    } else {
      this.CreditosForm.get('afiliacion_fecha_vencimiento').setErrors(null) ;
    }
    this.CrearCronograma() ;
  }

  CambiarTipoVista( tipo : string ){
    if( tipo == 'ver' ) {
      this.id_credito = this.id_credito_estandar ;
      this.id_credito_editar = null ;
      this.editar_documentos = false ;
      this.ColumnasCronograma = ['numero', 'tipo_pago','fecha_vencimiento', 'monto', 'interes_generado','monto_pagado','estado', 'opciones'];
    }
    if( tipo == 'editar_documentos' ) {
      this.id_credito = this.id_credito_estandar ;
      this.id_credito_editar = null ;
      this.editar_documentos = true ;
      this.ColumnasCronograma = ['numero', 'tipo_pago','fecha_vencimiento', 'monto', 'interes_generado','monto_pagado','estado', 'opciones'];
    }
    if( tipo == 'editar' ) {
      this.id_credito = null ;
      this.id_credito_editar = this.id_credito_estandar ;
      this.editar_documentos = false ;
      this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];
      this.ActualizarObservables() ;
    }
    this.SeleccionarCredito(this.id_credito_estandar)
  }

  ListarProcesos( id_venta : number ) {
    this.ListadoProcesos = [] ;
    this._judiciales.ListarProcesosxTransaccion(1, id_venta).subscribe(res=>{
      this.numero_procesos = res.length ;
      this.ListadoProcesos = res ;
    })
  }

  CalcularTotalPagado( cronograma : Array<any> ) {
    this.monto_pagado = cronograma.reduce((acumulador, elemento)=>{
      return acumulador + elemento.monto_pagado*1 ;
    }, 0) ;
  }

  AnularCredito(){
    let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
      data: {objeto: "el crédito", valor: this.CreditosForm.getRawValue().codigo }
    })

    Dialogo.afterClosed().subscribe(res=>{
      this.Cargando.next(true) ;
      if (res) {
        this.Servicio.EliminarCredito(this.id_credito_estandar,2, true).subscribe(res=>{
          this.router.navigate(['/creditos','creditos']) ;
        });
      }
    })
  }

  AgregarPagos(){
    let ventana = this.Dialogo.open(VentanaGenerarPagoTransaccionComponent,{
      width: '1200px' ,
      maxHeight: '80vh' ,
      data : {
        tipo : 1,
        id_credito : this.id_credito,
        cliente : this.CreditosForm.get('id_cliente').value ,
        cronograma : this.Cronograma,
        cronograma_periodos : this.Cronograma_Periodos,
        pendiente : this.totales_monto_pendiente
      }
    })

    ventana.afterClosed().subscribe( resultado=>{
      if ( resultado === true ) {
        this.Notificacion.Snack("Se crearon los pagos satisfactoriamente","") ;
        this.SeleccionarCredito(this.id_credito) ;
      }
    } )
  }

  AgregarPagosUnitarios(){
    let ventana = this.Dialogo.open(VentanaGenerarPagoTransaccionUnitariaComponent,{
      width: '1200px' ,
      maxHeight: '80vh' ,
      data : {
        tipo : 1,
        id_credito : this.id_credito,
        cliente : this.CreditosForm.get('id_cliente').value ,
        pendiente : this.totales_monto_pendiente
      }
    })

    ventana.afterClosed().subscribe( resultado=>{
      if ( resultado === true ) {
        this.Notificacion.Snack("Se crearán los pagos","") ;
        this.SeleccionarCredito(this.id_credito) ;
      }
    } )
  }

  EliminarPenalidad() {
    let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
      data: {objeto: "la penalidad", valor: '' }
    })

    Dialogo.afterClosed().subscribe(res=>{
      this.Cargando.next(true) ;
      if (res) {
        this.Servicio.EliminarPenalidadNueva(this.id_credito_estandar).subscribe(res=>{
          this.CambiarTipoVista("ver") ;
        });
      }
    })
  }

  Guardar(){
    // console.log(this.Cronograma);
    if(this.id_credito_editar){
      if(this.id_tipo==1){
        this.ActualizarAfiliacion()
      } else {
        this.ActualizarCredito();
      }
    }else{
      this.VerificarAfiliacion(this.CreditosForm.value.id_cliente, false);
      this.CrearCredito();
    }
  }

  CrearAfiliacion( tarjeta: string ) {

    this.Servicio.Crear(
      0,
      1,
      this.CreditosForm.value.sucursal,
      this.CreditosForm.value.afiliacion_fecha_afiliacion,
      this.numero_afiliacion,
      0,
      this.CreditosForm.value.id_autorizador ? this.CreditosForm.value.id_autorizador : 0,
      this.CreditosForm.value.id_vendedor ? this.CreditosForm.value.id_vendedor : 0,
      this.CreditosForm.value.id_cliente,
      this.CreditosForm.value.direccion,
      this.CreditosForm.value.telefono,
      this.CreditosForm.value.cargo,
      this.CreditosForm.value.trabajo,
      this.CreditosForm.value.tipo_pago,
      this.CreditosForm.value.afiliacion_fecha_vencimiento,
      0,
      0,
      this.CreditosForm.value.afiliacion_monto,
      this.numero_cuotas,
      +this.CreditosForm.value.afiliacion_monto * this.numero_cuotas,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      tarjeta,
      "",
      "",
      "",
      "",
      "",
      "",
      this.vendedoresForm.value ,
    ).subscribe(res=>{

      if ( !this.CreditosForm.get('agregar_afiliacion').value ) {
        this.Servicio.EliminarCredito(
          res['data'] ,
          1 ,
          false
        ).subscribe() ;
      }

      this.Servicio.CrearCronogramaAfiliacion(
        res['data'],
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.afiliacion_monto,
        this.numero_cuotas,
        this.CreditosForm.value.afiliacion_fecha_vencimiento
      ).subscribe()
    })
  }

  ActualizarAfiliacion(){

    let random=(new Date()).getTime()

    return forkJoin([
      this.ServiciosGenerales.RenameFile(this.tarjeta_nuevo,'TARJETA',random.toString(),"credito")
    ]).subscribe(resultado=>{

      // console.log(resultado)

      this.Servicio.Actualizar(
        this.id_credito_editar,
        0,
        1,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
        this.CreditosForm.value.id_autorizador ? this.CreditosForm.value.id_autorizador : 0,
        this.CreditosForm.value.id_vendedor ? this.CreditosForm.value.id_vendedor : 0,
        this.CreditosForm.value.id_cliente,
        this.CreditosForm.value.direccion,
        this.CreditosForm.value.telefono,
        this.CreditosForm.value.cargo,
        this.CreditosForm.value.trabajo,
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.fecha_pago,
        0,
        0,
        this.CreditosForm.value.capital,
        this.numero_cuotas,
        this.CreditosForm.value.total * this.numero_cuotas,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        this.tarjeta_editar ? resultado[0].mensaje : this.tarjeta_antiguo,
        "",
        "",
        "",
        "",
        this.CreditosForm.value.observaciones,
        this.vendedoresForm.value
      ).subscribe(res=>{
        this.Servicio.CrearCronogramaAfiliacion(
          res['data'],
          this.CreditosForm.value.tipo_pago,
          this.CreditosForm.value.afiliacion_monto,
          this.numero_cuotas,
          this.CreditosForm.value.fecha_pago
        ).subscribe( resultado =>{
          this.router.navigate(['/creditos','creditos']);
          if(res['codigo']==0){
            this.Notificacion.Snack("Se actualizó la afiliación con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al actualizar la afiliación","");
          }
        })
      })
    })
  }

  CrearCredito(){
    this.Cargando.next(true) ;
    let random=(new Date()).getTime()
    let identificador = this.CreditosForm.value.codigo ;
    let dni = this.CreditosForm.value.dni ;
    let fecha = moment(this.CreditosForm.value.fechaventa).format("DD_MM_YYYY") ;

    return forkJoin([
      this.ServiciosGenerales.RenameFile(this.foto, dni + '_FOTO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.dni, dni + '_DNI_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.cip, dni + '_CIP_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla, dni + '_PLANILLA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher, dni + '_VOUCHER_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo, dni + '_RECIBO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla, dni + '_CASILLA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion, dni + '_TRANSACCION_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion, dni + '_AUTORIZACION_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta, dni + '_TARJETA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso, dni + '_COMPROMISO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.letra, dni + '_LETRA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj, dni + '_DDJJ_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.oficio, dni + '_OFICIO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.otros, dni + '_OTROS_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.papeles, dni + '_PAPELES_' + fecha, identificador ,"credito"),
    ]).subscribe(resultado=>{

      if ( this.cliente_afiliado === false ) {
        this.CrearAfiliacion(
          resultado[9].mensaje ,
        )
      }

      this.Servicio.Crear(
        this.CreditosForm.value.id_acreedor,
        2,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
        this.numero_afiliacion,
        this.CreditosForm.value.numero,
        this.CreditosForm.value.id_autorizador ? this.CreditosForm.value.id_autorizador : 0,
        this.CreditosForm.value.id_vendedor ? this.CreditosForm.value.id_vendedor : 0,
        this.CreditosForm.value.id_cliente,
        this.CreditosForm.value.direccion,
        this.CreditosForm.value.telefono,
        this.CreditosForm.value.cargo,
        this.CreditosForm.value.trabajo,
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.fecha_pago,
        this.CreditosForm.value.interes_diario_monto,
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
        resultado[13].mensaje,
        resultado[14].mensaje,
        this.CreditosForm.value.observaciones ,
        this.vendedoresForm.value ,
      ).subscribe(res=>{

        // Se agrega el cronograma
        this.Cronograma.forEach((item)=>{
          this.Servicio.CrearCronograma(
            res['data'],
            this.CreditosForm.value.tipo_pago,
            item.capital,
            item.interes,
            item.fecha_vencimiento
          ).subscribe()
        })

        // Si viene de un presupuesto, el presupuesto cambia de estado
        if(this.id_presupuesto){
          this.Servicio.ActualizarPresupuesto(this.id_presupuesto, 2).subscribe();
        }

        // Si se realiza por un refinanciamiento, se actualizan las transacciones en referencia
        if(this.cliente_refinanciado){
          this.refinanciamiento_transacciones.forEach((item)=>{
            this.RfServicio.ActualizarTransacciones(
              res['data'],
              item.tipo,
              item.id
            ).subscribe()
          })
        }

        // Si el crédito tiene garante, se los agrega
        if( this.CreditosForm.value.garante ){
          this.CreditosForm['controls'].garantes['controls'].forEach((item, index)=>{
            return forkJoin([
              this.ServiciosGenerales.RenameFile(item.value.dni_pdf,`DNI_GARANTE_+${index+1}`,random.toString(),"credito"),
              this.ServiciosGenerales.RenameFile(item.value.cip_pdf,`CIP_GARANTE_+${index+1}`,random.toString(),"credito"),
              this.ServiciosGenerales.RenameFile(item.value.planilla_pdf,`PLANILLA_GARANTE_+${index+1}`,random.toString(),"credito"),
            ]).subscribe(response=>{
              this.Servicio.CrearGarante(
                res['data'],
                item.value.id_cliente,
                item.value.telefono,
                item.value.direccion,
                response[0].mensaje,
                response[1].mensaje,
                response[2].mensaje,
              ).subscribe(res=>console.log(res))
            })
          })
        }

        // Se agregan los datos del courier
        if( this.CreditosForm.value.papeles ){
          this.Servicio.CrearCourier(
            0,
            res['data'],
            this.CreditosForm.value.papeles_courier,
            this.CreditosForm.value.papeles_fecha_envio,
            this.CreditosForm.value.papeles_seguimiento,
            resultado[15].mensaje,
            this.CreditosForm.value.papeles_observaciones
          ).subscribe();
        }

        setTimeout(()=>{
          this.router.navigate(['/creditos','creditos']);
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
    this.Cargando.next(true) ;
    let random=(new Date()).getTime() ;
    let identificador = random.toString() ;
    let dni = this.CreditosForm.value.dni ;
    let fecha = moment(this.CreditosForm.value.fechaventa).format("DD_MM_YYYY") ;

    return forkJoin([
      this.ServiciosGenerales.RenameFile(this.foto_nuevo, dni + '_FOTO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo, dni + '_DNI_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo, dni + '_CIP_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo, dni + '_PLANILLA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher_nuevo, dni + '_VOUCHER_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo_nuevo, dni + '_RECIBO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla_nuevo, dni + '_CASILLA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo, dni + '_TRANSACCION_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo, dni + '_AUTORIZACION_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta_nuevo, dni + '_TARJETA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso_nuevo, dni + '_COMPROMISO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo, dni + '_LETRA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj_nuevo, dni + '_DDJJ_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.oficio_nuevo, dni + '_OTROS_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.otros_nuevo, dni + '_OTROS_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.papeles_nuevo, dni + '_PAPELES_' + fecha, identificador ,"credito"),
    ]).subscribe(resultado=>{
      this.Servicio.Actualizar(
        this.id_credito_editar,
        this.CreditosForm.value.id_acreedor,
        2 ,
        this.CreditosForm.value.sucursal,
        this.CreditosForm.value.fecha_credito,
        this.CreditosForm.value.id_autorizador ? this.CreditosForm.value.id_autorizador : 0,
        this.CreditosForm.value.id_vendedor ? this.CreditosForm.value.id_vendedor : 0,
        this.CreditosForm.value.id_cliente,
        this.CreditosForm.value.direccion,
        this.CreditosForm.value.telefono,
        this.CreditosForm.value.cargo,
        this.CreditosForm.value.trabajo,
        this.CreditosForm.value.tipo_pago,
        this.CreditosForm.value.fecha_pago,
        this.CreditosForm.value.interes_diario_monto,
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
        this.oficio_editar ? resultado[13].mensaje : this.oficio_antiguo,
        this.otros_editar ? resultado[14].mensaje : this.otros_antiguo,
        this.CreditosForm.value.observaciones,
        this.vendedoresForm.value
      ).subscribe(res=>{
        // console.log(res)

        if(res['codigo']==0){

          // console.log(this.Cronograma);
          this.Cronograma.forEach((item)=>{
            this.Servicio.CrearCronograma(
              res['data'],
              this.CreditosForm.value.tipo_pago,
              item.monto_cuota,
              0,
              item.fecha_vencimiento
            ).subscribe()
          })

          // Si el crédito tiene garante, se los agrega
          if( this.CreditosForm.value.garante ){
            this.CreditosForm['controls'].garantes['controls'].forEach((item, index)=>{
              return forkJoin([
                this.ServiciosGenerales.RenameFile(item.value.dni_pdf_nuevo,`DNI_GARANTE_+${index+1}`,random.toString(),"credito"),
                this.ServiciosGenerales.RenameFile(item.value.cip_pdf_nuevo,`CIP_GARANTE_+${index+1}`,random.toString(),"credito"),
                this.ServiciosGenerales.RenameFile(item.value.planilla_pdf_nuevo,`PLANILLA_GARANTE_+${index+1}`,random.toString(),"credito"),
              ]).subscribe(response=>{
                this.Servicio.CrearGarante(
                  res['data'],
                  item.value.id_cliente,
                  item.value.direccion,
                  item.value.telefono,
                  item.value.dni_editar ? response[0].mensaje : item.value.dni_pdf_antiguo,
                  item.value.cip_editar ? response[1].mensaje : item.value.cip_pdf_antiguo,
                  item.value.planilla_editar ? response[2].mensaje : item.value.planilla_pdf_antiguo,
                ).subscribe(res=>console.log(res))
              })
            })
          }

          // Se actualizan los datos del courier
          if( this.CreditosForm.value.papeles ){
            this.SServicio.Actualizar(
              this.CreditosForm.value.papeles_id,
              this.CreditosForm.value.papeles_courier,
              this.CreditosForm.value.papeles_fecha_envio,
              this.CreditosForm.value.papeles_seguimiento,
              this.papeles_editar ? resultado[15].mensaje : this.papeles_antiguo,
              this.CreditosForm.value.papeles_observaciones
            ).subscribe();
          }

          // Si el crédito es refinanciado, se actualizan los documentos que se refinanciaron
          if(this.cliente_refinanciado){
            this.refinanciamiento_transacciones.forEach((item)=>{
              this.RfServicio.ActualizarTransacciones(
                res['data'],
                item.tipo,
                item.id
              ).subscribe()
            })
          }
        }

        setTimeout(()=>{
          this.router.navigate(['/creditos','creditos']);
          if(res['codigo']==0){
            this.Notificacion.Snack("Se actualizó el crédito con éxito!","");
          }else{
            this.Notificacion.Snack("Ocurrió un error al actualizar el crédito","");
          }
        }, 300)

      })
    })

  }

  GuardarNuevosDocumentos(){
    this.Cargando.next(true) ;
    let random=(new Date()).getTime() ;
    let identificador = random.toString() ;
    let dni = this.CreditosForm.value.dni ;
    let fecha = moment(this.CreditosForm.value.fechaventa).format("DD_MM_YYYY") ;

    return forkJoin([
      this.ServiciosGenerales.RenameFile(this.foto_nuevo, dni + '_FOTO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo, dni + '_DNI_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo, dni + '_CIP_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo, dni + '_PLANILLA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher_nuevo, dni + '_VOUCHER_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo_nuevo, dni + '_RECIBO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla_nuevo, dni + '_CASILLA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo, dni + '_TRANSACCION_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo, dni + '_AUTORIAZACION_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta_nuevo, dni + '_TARJETA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso_nuevo, dni + '_COMPROMISO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo, dni + '_LETRA_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj_nuevo, dni + '_DDJJ_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.oficio_nuevo, dni + '_OFICIO_' + fecha, identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.otros_nuevo, dni + '_OTROS_' + fecha, identificador ,"credito"),
    ]).subscribe(resultado=>{
      // console.log(resultado) ;
      this.Servicio.ActualizarDocumentos(
        this.id_credito,
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
        this.oficio_editar ? resultado[13].mensaje : this.oficio_antiguo,
        this.otros_editar ? resultado[14].mensaje : this.otros_antiguo
      ).subscribe(res=>{
        // setTimeout(()=>{
          // this.router.navigate(['/creditos','creditos']);
          this.CambiarTipoVista( 'ver' ) ;
          // if(res['codigo']==0){
            this.Notificacion.Snack("Se actualizaron las imagenes!","") ;
          // }else{
          //   this.Notificacion.Snack("Ocurrió un error al actualizar el crédito","");
          // }
        // }, 300)
      })
    })

  }

  RegistrarPago(cronograma){
    let Ventana = this.Dialogo.open(VentanaCrearCobranzaManualComponent,{
      data : { cliente : this.CreditosForm.get('id_cliente').value, pendiente : cronograma.monto_pendiente, cronograma : cronograma.id_cronograma, tipo : 1 } ,
      width : '1200px' ,
      maxHeight : '80vh'
    }) ;

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.Notificacion.Snack("Se registró el pago satisfactoriamente", "") ;
        this.ObtenerCronograma(this.id_credito, 0) ;
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al registrar el pago", "") ;
      }
    })
  }

  AnoElegido(ano_normalizado: Moment) {
    let ano_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.CreditosForm.value.fecha_pago ) {
      ano_seleccionado = moment(this.CreditosForm.value.fecha_pago) ;
    } else {
      ano_seleccionado = moment() ;
    }
    ano_seleccionado.year(ano_normalizado.year());
    this.CreditosForm.get('fecha_pago').setValue(ano_seleccionado);
  }

  MesElegido(mes_normalizado: Moment, datepicker: MatDatepicker<Moment>) {
    let mes_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.CreditosForm.value.fecha_pago ) {
      mes_seleccionado = moment(this.CreditosForm.value.fecha_pago) ;
    } else {
      mes_seleccionado = moment() ;
    }

    mes_seleccionado.year(mes_normalizado.year()) ;
    mes_seleccionado.month(mes_normalizado.month());

    this.CreditosForm.get('fecha_pago').setValue(moment(mes_seleccionado).endOf('month').toDate());
    datepicker.close();
    this.FechaPagoSeleccionada() ;
  }

  AnoElegido2(ano_normalizado: Moment) {
    let ano_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.CreditosForm.value.afiliacion_fecha_vencimiento ) {
      ano_seleccionado = moment(this.CreditosForm.value.afiliacion_fecha_vencimiento) ;
    } else {
      ano_seleccionado = moment() ;
    }
    ano_seleccionado.year(ano_normalizado.year());
    this.CreditosForm.get('afiliacion_fecha_vencimiento').setValue(ano_seleccionado);
  }

  MesElegido2(mes_normalizado: Moment, datepicker: MatDatepicker<Moment>) {
    let mes_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.CreditosForm.value.afiliacion_fecha_vencimiento ) {
      mes_seleccionado = moment(this.CreditosForm.value.afiliacion_fecha_vencimiento) ;
    } else {
      mes_seleccionado = moment() ;
    }
    mes_seleccionado.month(mes_normalizado.month());
    this.CreditosForm.get('afiliacion_fecha_vencimiento').setValue(moment(mes_seleccionado).endOf('month').toDate());
    datepicker.close();
    this.FechaPagoAfiliacionSeleccionada() ;
  }

  Imprimir(){
    let identificador = new Date().getTime().toString() ;
    console.log({
      foto: this.foto + this.foto_nuevo ,
      dni: this.dni + this.dni_nuevo ,
      cip: this.cip + this.cip_nuevo ,
      planilla: this.planilla + this.planilla_nuevo ,
      voucher: this.voucher + this.voucher_nuevo ,
      recibo: this.recibo + this.recibo_nuevo ,
      casilla: this.casilla + this.casilla_nuevo ,
      transaccion: this.transaccion + this.transaccion_nuevo ,
      autorizacion: this.autorizacion + this.autorizacion_nuevo ,
      tarjeta: this.tarjeta + this.tarjeta_nuevo ,
      compromiso: this.compromiso + this.compromiso_nuevo ,
      letra: this.letra + this.letra_nuevo ,
      ddjj: this.ddjj + this.ddjj_nuevo ,
      oficio: this.oficio + this.oficio_nuevo ,
      otros: this.otros + this.otros_nuevo ,
      papeles: this.papeles + this.papeles_nuevo ,
    })
    return forkJoin([
      this.ServiciosGenerales.RenameFile(this.foto_nuevo, "JP" + '_FOTO_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.dni_nuevo, "JP" + '_DNI_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.cip_nuevo, "JP" + '_CIP_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.planilla_nuevo, "JP" + '_PLANILLA_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.voucher_nuevo, "JP" + '_VOUCHER_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.recibo_nuevo, "JP" + '_RECIBO_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.casilla_nuevo, "JP" + '_CASILLA_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.transaccion_nuevo, "JP" + '_TRANSACCION_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.autorizacion_nuevo, "JP" + '_AUTORIZACION_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.tarjeta_nuevo, "JP" + '_TARJETA_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.compromiso_nuevo, "JP" + '_COMPROMISO_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.letra_nuevo, "JP" + '_LETRA_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.ddjj_nuevo, "JP" + '_DDJJ_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.oficio_nuevo, "JP" + '_OFICIO_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.otros_nuevo, "JP" + '_OTROS_' + "fecha", identificador ,"credito"),
      this.ServiciosGenerales.RenameFile(this.papeles_nuevo, "JP" + '_PAPELES_' + "fecha", identificador ,"credito"),
    ]).subscribe(resultado=>{
      console.log(resultado) ;
    })
  }

  CambiarVistaCronograma() {
    if ( this.CreditosForm.get('vista_cronograma').value == 1 ) {
      this.ListadoCronograma.AsignarInformacion(this.Cronograma);
    } else {
      this.ListadoCronograma.AsignarInformacion(this.Cronograma_Periodos);
    }
  }

  EstablecerPenalidad(forzar : boolean) {
    let Ventana = this.Dialogo.open(VentanaGenerarPenalidadComponent, {
      data : {
        id_credito : this.id_credito_estandar ,
        monto_total : this.CreditosForm.get('total').value - +this.CreditosForm.get('interes_diario_monto').value  ,
        numero_cuotas : this.CreditosForm.get('cuotas').value ,
        tipo_pago : this.id_tipo_pago ,
        forzar : forzar
      } ,
      width: '900px' ,
      maxHeight: '80vh'
    })

    Ventana.afterClosed().subscribe(res =>{
      if ( res ) {
        this.SeleccionarCredito(this.id_credito_estandar) ;
        this.Notificacion.Snack("Se crearon las cuotas de la penalidad satisfactoriamente","")
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al crear las cuotas de la penalidad","")
      }
    })
  }

  GenerarInteres() {
    let Ventana = this.Dialogo.open(VentanaGenerarInteresComponent, {
      data : {
        id_credito : this.id_credito_estandar ,
      } ,
      width: '300px' ,
      maxHeight: '80vh'
    })

    Ventana.afterClosed().subscribe(res =>{
      if ( res ) {
        this.SeleccionarCredito(this.id_credito_estandar) ;
        this.Notificacion.Snack("Se generó el interés satisfactoriamente","")
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al generar el interés","")
      }
    })
  }

  EditarIncumplimiento( estado_actual : number ) {
    if ( estado_actual == 1 ) {
      this.editar_penalidad = true ;
    }
    if ( estado_actual == 2 ) {
      this.editar_penalidad = false ;

      this.Cargando.next(true) ;
      forkJoin([
        this.Servicio.ActualizarEstadoPenalidad(
          this.id_credito ,
          this.CreditosForm.get('estado_penalidad').value ,
        ) ,
        this.Servicio.ActualizarEstadoInteres(
          this.id_credito ,
          this.CreditosForm.get('estado_interes').value ,
        )
      ])
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(respuesta =>{
        if ( respuesta ) {
          this.SeleccionarCredito(this.id_credito) ;
          this.Notificacion.Snack("Se actualizaron las condiciones de incumplimiento","")
        }
        if( !respuesta ) {
          this.Notificacion.Snack("Ocurrió un error al actualizar las condiciones","")
        }
      })
    }
  }

  LiquidarCredito() {
    let Ventana = this.Dialogo.open(VentanaLiquidacionComponent, {
      data : { tipo: 1, id_transaccion: this.id_credito } ,
      width : '900px' ,
      maxHeight : '80vh'
    })

    Ventana.afterClosed().subscribe(resultado => {
      if ( resultado ) {
        this.SeleccionarCredito(this.id_credito) ;
        this.Notificacion.Snack("Se generó la liquidación satisfactoriamente","") ;
      }
      if( resultado === false ) {
        this.Notificacion.Snack("Ocurrió un error al generar la liquidación","") ;
      }
    })
  }

  RetirarPenalidad() {
    this.Cargando.next(true) ;

    this.Servicio.EliminarPenalidad(this.id_credito)
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(respuesta =>{
      if ( respuesta ) {
        this.editar_penalidad = false ;
        this.SeleccionarCredito(this.id_credito) ;
        this.Notificacion.Snack("Se retiró la penalidad","") ;
      }
      if( !respuesta ) {
        this.Notificacion.Snack("Ocurrió un error al retirar la penalidad","") ;
      }
    })
  }

  RetirarInteres() {
    this.Cargando.next(true) ;

    this.Servicio.EliminarInteres(this.id_credito)
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(respuesta =>{
      if ( respuesta ) {
        this.editar_penalidad = false ;
        this.SeleccionarCredito(this.id_credito) ;
        this.Notificacion.Snack("Se retiró el interés","") ;
      }
      if( !respuesta ) {
        this.Notificacion.Snack("Ocurrió un error al retirar el interés","") ;
      }
    })
  }

  // Cuando al crédito se le aplicó una penalidad, se ejecuta esta función
  ConsultarInfomacionAnterior() {
    this.ListadoCronogramaAntiguo.CargarInformacion(this.id_credito) ;
  }

  SeleccionarVendedores() {
    let Ventana = this.Dialogo.open(SeleccionarVendedorComponent,{
      width: '1200px',
      data: {vendedores: this.vendedoresForm.value}
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.ResetearVendedoresFormArray() ;
        res.forEach((vendedor, index) => {
          this.AgregarVendedor() ;
          this.vendedoresForm.controls[index].get('id_vendedor').setValue( vendedor.id );
          this.vendedoresForm.controls[index].get('vendedor_nombre').setValue( vendedor.nombre );
        } ) ;
      }
    })
  }

  ListarVendedores(id_credito){
    this.ResetearVendedoresFormArray() ;
    this.Servicio.ListarCreditoVendedores(id_credito)
    .subscribe(resultado => {
      resultado.forEach((item, index) => {
        this.AgregarVendedor() ;
        this.vendedoresForm.controls[index].get('id_vendedor').setValue( item.id_vendedor );
        this.vendedoresForm.controls[index].get('vendedor_nombre').setValue( item.vendedor_nombre );
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
  }

  AsignarInformacion(array){
    this.Informacion.next(array);
  }
}

export class CronogramaAntiguoDataSource implements DataSource<any>{
  private Informacion = new BehaviorSubject<any>([])

  public totales_monto_total : number = 0 ;
  public totales_total_cuotas : number = 0 ;
  public totales_monto_pagado : number = 0 ;
  public totales_total_pagadas : number = 0 ;
  public totales_monto_pendiente : number = 0 ;
  public totales_total_pendiente : number = 0 ;
  public totales_interes_generado : number = 0 ;

  constructor(
    private _creditos : CreditosService ,
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable() ;
  }

  disconnect(){
  }

  CargarInformacion(
    id_credito : number
  ){
    this._creditos.ObtenerCrongrama(id_credito, 2)
    .subscribe(resultado =>{
      this.Informacion.next(resultado) ;
    }) ;

    this._creditos.ListarCronogramaResumen(id_credito, 2).subscribe(resultado => {
      this.totales_monto_total = resultado.monto_total ;
      this.totales_interes_generado = resultado.interes ;
      this.totales_monto_pagado = resultado.monto_pagado ;
      this.totales_total_pagadas = resultado.total_pagadas ;
      this.totales_total_cuotas = resultado.total_cuotas ;
      this.totales_monto_pendiente = resultado.monto_pendiente ;
      this.totales_total_pendiente = resultado.total_pendiente ;
    })
  }
}
