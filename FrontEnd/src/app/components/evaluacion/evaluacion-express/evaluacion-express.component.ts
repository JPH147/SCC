import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EvaluacionCoutasDataSource } from '../evaluacion-cuotas/evaluacion-cuotas.component';
import { merge, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EvaluacionService } from '../evaluacion.service';
import * as moment from 'moment';
import { ServiciosGenerales } from '../../global/servicios';
import {saveAs} from 'file-saver';
import { ClienteService } from '../../clientes/clientes.service';
import { ServiciosDirecciones } from '../../global/direcciones';
import { ServiciosTelefonos } from '../../global/telefonos';
import { Notificaciones } from '../../global/notificacion';

@Component({
  selector: 'app-evaluacion-express',
  templateUrl: './evaluacion-express.component.html',
  styleUrls: ['./evaluacion-express.component.scss'],
  providers: [ClienteService, ServiciosDirecciones, ServiciosTelefonos]
})

export class EvaluacionExpressComponent implements OnInit {

  @ViewChild('InputCapital') FiltroCapital : ElementRef ;
  @ViewChild('InputCuotas') FiltroCuotas : ElementRef ;
  @ViewChild('InputInteres') FiltroInteres : ElementRef ;
  @ViewChild('InputAporte') FiltroAporte : ElementRef ;
  @ViewChild('InputVendedor') VendedorAutoComplete : ElementRef;

  public capital : number ;
  public cuotas : number ;
  public interes : number ;
  public aporte : number ;
  public prestamo : number ;
  public fecha_prestamo : Date ;
  public interes_por_dia : boolean ;
  public interes_diario : number ;
  public fecha_inicio : Date ;
  public cronograma : Array<any> = [];
  public Columnas: string[] = ['numero','fecha','monto','aporte','total'] ;
  public ListadoCronograma : EvaluacionCoutasDataSource ;
  public correcto : boolean = false ;
  public InformacionForm : FormGroup ;
  public ddjj : string ;
  public autorizacion : string ;
  public compromiso : string ;
  public transaccion : string ;
  public tarjeta : string ;
  public generados : boolean ;
  public ExpressForm : FormGroup;
  public ListadoVendedores : Array<any>;
  public numero_cuotas_estandar : number ;
  public cuota_estandar : number ;
  public nueva_infomacion : boolean = false ;

  public informacion_cooperativa : any;
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
  public dias_contrato_premura : number ;
  public presidente_nombre : string ;
  public presidente_dni : string ;
  public presidente_direccion : string ;

  constructor(
    private Builder : FormBuilder ,
    private ServiciosGenerales : ServiciosGenerales,
    private ClienteServicios: ClienteService,
    private ServicioDireccion: ServiciosDirecciones,
    private ServicioTelefono: ServiciosTelefonos,
    private Servicios : EvaluacionService,
    private Notificacion: Notificaciones
  ) { }

  ngOnInit() {
    this.ListadoCronograma = new EvaluacionCoutasDataSource;
    this.CrearFormulario();
    this.ObtenerDatosCooperativa();
    this.ListarVendedor("");
    
    this.capital = 0;
    this.cuotas = 0;
    this.interes = 15;
    this.aporte = 20;
    this.prestamo = 0;
    this.interes_por_dia=false;
    this.interes_diario=0;
    this.fecha_prestamo=new Date();
    this.fecha_inicio=moment(new Date()).add(1,'month').toDate();

    this.InformacionForm = this.Builder.group({});
  }

  ngAfterViewInit(): void {
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

    merge(
      fromEvent(this.FiltroInteres.nativeElement, 'keyup'),
      fromEvent(this.FiltroAporte.nativeElement, 'keyup')
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.CalcularPagos();
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
    this.ExpressForm = this.Builder.group({
      lugar : [ "Ate Vitarte",[Validators.required] ],
      id_vendedor : [ null,[Validators.required] ],
      vendedor_dni : [ "",[] ],
      vendedor : [ "",[] ],
      fecha_letras : [ new Date(),[Validators.required] ],
    })
  }

  ObtenerDatosCooperativa(){
    let i = 0;
    this.Servicios.ObtenerInformacion().subscribe(res=>{
      this.informacion_cooperativa=res;
      this.cooperativa_nombre=this.informacion_cooperativa['cooperativa'].find(e => e.parametro=="nombre").valor;
      this.penalidad_porcentaje=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_porcentaje").valor;
      this.penalidad_maxima_cuota=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_cuota_maxima").valor;
      this.contrato_dias_premura=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="transaccion_contrato_dias_premura").valor;
      this.dias_contrato_premura = this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="transaccion_contrato_dias_premura").valor;
      this.cooperativa_cuenta_banco=this.informacion_cooperativa['cuenta'].banco;
      this.cooperativa_cuenta_numero=this.informacion_cooperativa['cuenta'].cuenta;
      this.cooperativa_contacto=this.informacion_cooperativa['contacto'];
      let array_comodin = this.informacion_cooperativa['direccion_transaccion'].filter(e=>e.id_tipo==2);
      this.cooperativa_direccion_1=array_comodin[0].direccion;
      this.cooperativa_direccion_2=array_comodin[1].direccion;
      this.cooperativa_direccion_3=array_comodin[2].direccion;
      this.cooperativa_direccion_4=array_comodin[3].direccion;

      this.informacion_cooperativa['direccion_transaccion'].forEach((item,index)=>{
        if(item.id_tipo=1) {
          this.cooperativa_direccion=item.direccion;
        }
      });
      this.presidente_nombre = this.informacion_cooperativa['presidente'].nombre;
      this.presidente_dni = this.informacion_cooperativa['presidente'].documento;
      this.presidente_direccion = this.informacion_cooperativa['presidente'].direccion;
    })
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

  CalcularInteresDiario(){
    if (this.interes_por_dia) {
      let interes = this.capital*this.interes/100;
      this.interes_diario=Math.round( interes * (1-(moment(this.fecha_prestamo).date()/moment(this.fecha_prestamo).daysInMonth()) )*10)/10;
    } else {
      this.interes_diario=0;
    }
  }

  ObtenerCliente(evento){
    this.nueva_infomacion = true ;
    this.InformacionForm = evento;
  }

  CalcularPagos(){

    // this.EvaluarRegla();
    // this.CalcularInteresDiario();
    // this.CambioModoPago()
    let aporte : number ;
    if(this.interes==0) {
      aporte = 0;
    } else {
      aporte = this.aporte;
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
    this.numero_cuotas_estandar = numero_cuotas ;
    this.cuota_estandar = total/numero_cuotas ;
    // Se reemplazó numero_cuotas por (mes_pago - mes_credito)

    // Si el crédito es antes de quincena, se paga a fin de mes los intereses truncados
    if( this.interes_por_dia ){
      let fecha_1 = moment(this.fecha_prestamo).endOf('month');
      this.cronograma.push({
        numero: 0,
        fecha: fecha_1,
        fecha_formato: moment(fecha).locale('es').format('LL'),
        monto: interes_truncado,
        capital : 0,
        interes : interes_truncado,
        aporte: aporte,
        total: interes_truncado+aporte ,
        total_acumulado : interes_truncado + aporte
      })
    }

    // Se pagan los intereses mientras no se cancele el crédito
    if( numero_cuotas > 1){
      for( i; i<numero_cuotas; i++){
        fecha=moment(new Date(ano_credito, mes_credito, dia_pago)).add(i, 'months').toDate();
        this.cronograma.push({
          numero: i,
          fecha: fecha,
          fecha_formato: moment(fecha).locale('es').format('LL'),
          monto: interes,
          capital : 0,
          interes : interes,
          aporte: aporte,
          total: interes + aporte,
          total_acumulado : interes + aporte
        })
      }
    };

    let monto_acumulado : number = 0;
    // Se calcula el monto de las cuotas normales
    let monto : number = ( (total)/this.cuotas ) ;

    for (let j = 1; j<=this.cuotas; j++) {
      fecha=moment(fecha_corregida).add(j-1, 'months').toDate();
      this.cronograma.push({
        numero: i+j-1,
        fecha: fecha,
        fecha_formato: moment(fecha).locale('es').format('LL'),
        monto: monto,
        capital : monto-interes,
        interes : interes,
        aporte: aporte,
        total: monto+ aporte,
        total_acumulado : monto + aporte
      })
    }

    this.prestamo = Math.round(
      +this.cronograma.reduce( (acumulador, item)=>{
        return ( acumulador + item.monto ) ;
      },0 )
    * 100 ) / 100;

    this.ListadoCronograma.CargarInformacion(this.cronograma);
    // console.log(this.cronograma);

  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoVendedores=res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.ExpressForm.value.vendedor.nombre;
    this.ExpressForm.get('id_vendedor').setValue(this.ExpressForm.value.vendedor.id);
    this.ExpressForm.get('vendedor_dni').setValue(this.ExpressForm.value.vendedor.dni);
    this.ExpressForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.ExpressForm.get('id_vendedor').setValue(null);
    this.ExpressForm.get('vendedor').setValue("");
    this.ExpressForm.get('vendedor_dni').setValue("");
    this.ListarVendedor("");
  }

  // Se debe utilizar cuando se escribe la dirección en el formulario.
  // Esto no se debe ejecutar cuando la dirección viene de la BBDD.
  CrearDireccionCompleta() : string {
    let direccion :string = this.InformacionForm.value.direccion_nombre ;
    direccion = direccion[0].toUpperCase() + direccion.slice(1);
    
    let distrito : string = this.InformacionForm.value.direccion_distrito_nombre ;
    distrito = distrito[0].toUpperCase() + distrito.slice(1);
    
    let provincia : string = this.InformacionForm.value.direccion_provincia ;
    provincia = provincia[0].toUpperCase() + provincia.slice(1);
    
    let departamento : string = this.InformacionForm.value.direccion_departamento ;
    departamento = departamento[0].toUpperCase() + departamento.slice(1);
    
    let direccion_completa : string = direccion + ", distrito de " + distrito + ", provincia de " + provincia + " del departamento de " + departamento ;
    return direccion_completa ;
  }

  Print(){
    console.log("Express",this.ExpressForm);
    console.log("Informacion",this.InformacionForm);
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

    if( this.nueva_infomacion && this.InformacionForm.value.cliente_nuevo ){
      this.CrearCliente(this.InformacionForm);
      this.nueva_infomacion = false ;
    }

    this.GenerarDDJJ("DDJJ_"+ahora);
    this.GenerarCompromiso("Compromiso_"+ahora);

    if(this.InformacionForm.value.email && this.InformacionForm.value.codigo){
      this.GenerarAutorizacion("Autorizacion_"+ahora);
    }

    if(this.InformacionForm.value.cuenta_numero){
      this.GenerarTarjeta("Tarjeta_"+ahora);
    }

    if(this.InformacionForm.value.email && this.InformacionForm.value.casilla){
      this.GenerarTransaccion("Transaccion_"+ahora);
    }

  }

  GenerarDDJJ(nombre_archivo){
    this.Servicios.GenerarDDJJ(
      this.InformacionForm.value.plantilla_ddjj,
      nombre_archivo,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.direccion_distrito_nombre,
      this.InformacionForm.value.direccion_completa,
      this.ExpressForm.value.lugar,
      this.ExpressForm.value.fecha_letras
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.generados=true;
        this.ddjj=res['data'];
      }
    })
  }

  GenerarAutorizacion(nombre_archivo){
    this.Servicios.GenerarAutorizacion(
      this.InformacionForm.value.plantilla_autorizacion,
      nombre_archivo,
      this.cooperativa_nombre,
      "1",
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.cargo_estado,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      this.InformacionForm.value.codigo,
      this.InformacionForm.value.direccion_completa,
      this.InformacionForm.value.telefono_tipo_nombre,
      this.InformacionForm.value.telefono_numero,
      this.InformacionForm.value.email,
      this.InformacionForm.value.subsede_nombre,
      this.aporte,
      this.cuota_estandar,
      this.numero_cuotas_estandar,
      this.ExpressForm.value.lugar,
      this.ExpressForm.value.fecha_letras
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.generados=true;
        this.autorizacion=res['data'];
      }
    })
  }

  GenerarTransaccion(nombre_archivo){
    let direccion_completa : string ;

    if( !this.InformacionForm.value.direccion_completa ) {
      direccion_completa = this.CrearDireccionCompleta();
    }

    this.Servicios.GenerarTransaccion(
      this.InformacionForm.value.plantilla_transaccion,
      nombre_archivo,
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
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.cargo_estado_nombre, 
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      true,
      this.InformacionForm.value.direccion_completa ? this.InformacionForm.value.direccion_completa : direccion_completa,
      this.InformacionForm.value.casilla,
      this.InformacionForm.value.subsede_nombre,
      this.ExpressForm.value.fecha_letras,
      this.dias_contrato_premura,
      Math.round(this.prestamo*100)/100,
      Math.round(this.cuota_estandar*100)/100,
      this.cuotas,
      this.penalidad_porcentaje,
      this.penalidad_maxima_cuota,
      this.InformacionForm.value.cuenta_banco_nombre,
      this.InformacionForm.value.cuenta_numero,
      this.InformacionForm.value.email,
      this.InformacionForm.value.telefono_numero,
      this.ExpressForm.value.lugar,
      this.ExpressForm.value.vendedor,
      this.ExpressForm.value.vendedor_dni,
      this.cronograma,
      1,
      [],
      "0",
      "0",
    ).subscribe(res=>{
      // console.log(res);
      this.generados=true;
      this.transaccion=res['data'];
    })
  }

  GenerarCompromiso(nombre_archivo){
    this.Servicios.GenerarCompromiso(
      this.InformacionForm.value.plantilla_compromiso,
      nombre_archivo,
      this.cooperativa_nombre,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.cooperativa_contacto,
      this.InformacionForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.compromiso=res['data'];
      }
    })
  }

  GenerarTarjeta(nombre_archivo){
    this.Servicios.GenerarTarjeta(
      this.InformacionForm.value.plantilla_tarjeta,
      nombre_archivo,
      this.InformacionForm.value.nombre,
      this.InformacionForm.value.dni,
      this.InformacionForm.value.cip,
      this.InformacionForm.value.codigo,
      this.InformacionForm.value.cargo_estado,
      this.InformacionForm.value.direccion_completa,
      this.InformacionForm.value.direccion_provincia,
      this.InformacionForm.value.cargo_nombre,
      this.InformacionForm.value.cuenta_numero,
      this.ExpressForm.value.lugar,
      this.InformacionForm.value.telefono_numero,
      20, // El monto de la afiliación
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.tarjeta=res['data'];
      }
    })
  }

  AbrirArchivo(nombre_archivo){
    this.Servicios.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      saveAs(res, nombre_archivo+'.docx');
    })
  }

  CrearCliente(formulario) {
    //console.log(formulario.value.subsede);
    this.ClienteServicios.Agregar(
      formulario.value.subsede,
      formulario.value.cargo_estado,
      formulario.value.codigo,
      formulario.value.dni,
      formulario.value.nombre,
      formulario.value.cip,
      formulario.value.email,
      formulario.value.casilla,
      0,
      "",
      0,
      0,
      "",
      20,
      5
    ).subscribe(res =>{
      // this.ClientesForm.reset();
      // console.log(res)

      if(res['codigo']==0){
        this.Notificacion.Snack("Se creó el cliente satisfactoriamente.","")
      } else {
        this.Notificacion.Snack("Ocurrió un error al crear al cliente.","")
      }

      if(this.InformacionForm.value.cuenta_numero){
        this.ClienteServicios.CrearCuenta(res['data'], this.InformacionForm.value.cuenta_banco, this.InformacionForm.value.cuenta_numero, "").subscribe(resultado=>{
          // console.log(resultado)
        })
      }

      this.ServicioTelefono.CrearTelefono(res['data'], this.InformacionForm.value.telefono_numero, this.InformacionForm.value.telefono_tipo).subscribe(resultado=>{
        // console.log(resultado)
      })

      this.ServicioDireccion.CrearDireccion(res['data'], this.InformacionForm.value.direccion_nombre, this.InformacionForm.value.direccion_distrito).subscribe(resultado=>{
        // console.log(resultado)
      })
    });
  }

}

