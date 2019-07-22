import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable , fromEvent } from 'rxjs';
import { debounceTime , distinctUntilChanged , tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EvaluacionService } from '../evaluacion.service';
import { ServiciosDirecciones } from '../../global/direcciones';
import { ServiciosTelefonos } from '../../global/telefonos';
import { ClienteService } from '../../clientes/clientes.service';
import { ServiciosGenerales } from '../../global/servicios';
import { TrabajadoresService } from '../../trabajadores/trabajadores.service';
import { VentanaEmergenteContacto} from '../../clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import { VentanaEmergenteClientes } from '../../clientes/ventana-emergente/ventanaemergente';
import {Notificaciones} from '../../global/notificacion';
import * as moment from 'moment';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-evaluacion-archivos',
  templateUrl: './evaluacion-archivos.component.html',
  styleUrls: ['./evaluacion-archivos.component.scss'],
  providers : [ EvaluacionService , ServiciosDirecciones , ServiciosTelefonos , ClienteService , ServiciosGenerales , TrabajadoresService ]
})

export class EvaluacionArchivosComponent implements OnInit , AfterViewInit{

  @Input() informacion_venta: Observable<any>;
  @Output() ActualizarCliente = new EventEmitter();

  @ViewChild('InputVendedor') VendedorAutoComplete : ElementRef;
  @ViewChild('InputTrabajador') TrabajadorAutoComplete : ElementRef;

  public EvaluacionArchivosForm : FormGroup;
  public cliente_afiliado : boolean = false;
  public generados : boolean = false;
  public ddjj : string ;
  public autorizacion : string ;
  public compromiso : string ;
  public transaccion : string ;
  public tarjeta : string ;
  public ListadoVendedores : Array<any>;
  public ListadoTrabajadores : Array<any>;
  public cronograma : Array<any>;
  public productos : Array<any> = [];
  public productos_generar : Array<any> = [];

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

  public presidente_nombre : string ;
  public presidente_dni : string ;
  public presidente_direccion : string ;
  public direccion_cliente : string;
  public distrito_cliente : string;

  constructor(
    private Builder : FormBuilder,
    private Dialogo : MatDialog,
    private router : Router,
    private Servicios : EvaluacionService,
    private DServicios : ServiciosDirecciones,
    private TServicios: ServiciosTelefonos,
    private CServicios : ClienteService,
    private ServiciosGenerales : ServiciosGenerales,
    private TraabajadoresServicios : TrabajadoresService,
    private Notificacion: Notificaciones
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.CrearFormulario();
    this.ActualizarInformacion();
    this.ObtenerDatosCooperativa();

    this.ListarVendedor("");
    this.ListarTrabajador("");
  }

  ngAfterViewInit(){
    fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarVendedor(this.VendedorAutoComplete.nativeElement.value);
      })
     ).subscribe();

     fromEvent(this.TrabajadorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarTrabajador(this.TrabajadorAutoComplete.nativeElement.value);
      })
     ).subscribe();
  }

  ObtenerDatosCooperativa(){
    let i = 0;
    this.Servicios.ObtenerInformacion().subscribe(res=>{
      this.informacion_cooperativa=res;
      // console.log(this.informacion_cooperativa)
      this.cooperativa_nombre=this.informacion_cooperativa['cooperativa'].find(e => e.parametro=="nombre").valor;
      this.penalidad_porcentaje=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_porcentaje").valor;
      this.penalidad_maxima_cuota=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_cuota_maxima").valor;
      this.contrato_dias_premura=this.informacion_cooperativa['cooperativa_configuracion'].find(e => e.parametro=="transaccion_contrato_dias_premura").valor;
      this.cooperativa_cuenta_banco=this.informacion_cooperativa['cuenta'].cuenta;
      this.cooperativa_cuenta_numero=this.informacion_cooperativa['cuenta'].banco;
      this.cooperativa_contacto=this.informacion_cooperativa['contacto'];
      this.informacion_cooperativa['direccion_transaccion'].forEach((item)=>{
        if(item.id_tipo=1) {
          this.cooperativa_direccion=item.direccion;
        }
        if(item.id_tipo=2){
          i++;
          if(i==1){
            this.cooperativa_direccion_1=item.direccion;            
          }
          if(i==2){
            this.cooperativa_direccion_2=item.direccion;
          }
        }
      });
      this.presidente_nombre = this.informacion_cooperativa['presidente'].nombre;
      this.presidente_dni = this.informacion_cooperativa['presidente'].documento;
      this.presidente_direccion = this.informacion_cooperativa['presidente'].direccion;
    })
  }

  CrearFormulario(){
    this.EvaluacionArchivosForm = this.Builder.group({
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
    })
  }

  ActualizarInformacion(){
    this.informacion_venta.subscribe(res=>{
      console.log(res);
      this.EvaluacionArchivosForm.get('fecha_letras').setValue(res.fecha);
      if(res.cliente){
        this.cliente_afiliado=res['afiliado'];
        if(res.cliente.id) {
          this.EvaluacionArchivosForm.get('id_cliente').setValue(res.cliente.id);
          this.ObtenerDireccion(res.cliente.id);
          this.ObtenerTelefono(res.cliente.id);
          this.ObtenerNumeroCelular(res.cliente.id);
          this.ObtenerCuenta(res.cliente.id);
        }
        this.EvaluacionArchivosForm.get('plantilla_ddjj').setValue(res.cliente.plantilla_ddjj)
        this.EvaluacionArchivosForm.get('plantilla_autorizacion').setValue(res.cliente.plantilla_autorizacion)
        this.EvaluacionArchivosForm.get('plantilla_compromiso').setValue(res.cliente.plantilla_compromiso)
        this.EvaluacionArchivosForm.get('plantilla_transaccion').setValue(res.cliente.plantilla_transaccion)
        this.EvaluacionArchivosForm.get('plantilla_tarjeta').setValue(res.cliente.plantilla_tarjeta)
        this.EvaluacionArchivosForm.get('nombre').setValue(res.cliente.nombre)
        this.EvaluacionArchivosForm.get('dni').setValue(res.cliente.dni)
        this.EvaluacionArchivosForm.get('trabajo').setValue(res.cliente.trabajo)
        this.EvaluacionArchivosForm.get('cargo_estado').setValue(res.cliente.cargo_estado)
        this.EvaluacionArchivosForm.get('cip').setValue(res.cliente.cip)
        this.EvaluacionArchivosForm.get('codigo').setValue(res.cliente.codigo)
        this.EvaluacionArchivosForm.get('casilla').setValue(res.cliente.casilla)
        this.EvaluacionArchivosForm.get('email').setValue(res.cliente.email)
        this.EvaluacionArchivosForm.get('subsede').setValue(res.cliente.subsede)
        this.EvaluacionArchivosForm.get('cargo').setValue(res.cargo_nombre + " " +res.cargo_estado);
        this.EvaluacionArchivosForm.get('interes').setValue(res.interes);
        this.EvaluacionArchivosForm.get('capital').setValue(res.capital);
        this.EvaluacionArchivosForm.get('total').setValue(res.total);
        this.EvaluacionArchivosForm.get('monto_asociado').setValue(res.aporte);
        this.EvaluacionArchivosForm.get('monto_cuota').setValue(res.cronograma[0].total);
        this.EvaluacionArchivosForm.get('numero_cuotas').setValue(res.cuotas);
        this.EvaluacionArchivosForm.get('tipo').setValue(res.venta+1);
        this.cronograma=res.cronograma;
        this.productos=res.productos;
        this.GenerarInputProductos();
      }
    })
  }

  EditarCliente(){

    let VentanaClientes;

    this.CServicios.Seleccionar(this.EvaluacionArchivosForm.value.id_cliente).subscribe(res => {
      VentanaClientes= this.Dialogo.open(VentanaEmergenteClientes, {
        width: '1000px',
        data: {objeto: res, id: this.EvaluacionArchivosForm.value.id_cliente},
      });

      VentanaClientes.afterClosed().subscribe (res => {
        console.log(res);
        if(res){
          // console.log(1);
          this.ActualizarCliente.emit();
        }
      });

    });
  }

  EditarClienteContacto(){

    let VentanaContacto= this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1000px',
      data: this.EvaluacionArchivosForm.value.id_cliente
    });

    VentanaContacto.afterClosed().subscribe (res => {
      console.log(res);
      if(res){
        console.log(1);
        this.ActualizarCliente.emit();
      }
    });
  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
      this.ListadoVendedores=res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.EvaluacionArchivosForm.value.vendedor.nombre;
    this.EvaluacionArchivosForm.get('id_vendedor').setValue(this.EvaluacionArchivosForm.value.vendedor.id);
    this.EvaluacionArchivosForm.get('vendedor_dni').setValue(this.EvaluacionArchivosForm.value.vendedor.dni);
    this.EvaluacionArchivosForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.EvaluacionArchivosForm.get('id_vendedor').setValue(null);
    this.EvaluacionArchivosForm.get('vendedor').setValue("");
    this.EvaluacionArchivosForm.get('vendedor_dni').setValue("");
    this.ListarVendedor("");
  }

  ListarTrabajador(nombre: string) {
    this.TraabajadoresServicios.Listar("",nombre,1,1,5).subscribe( res => {
      if(res['codigo']==0){
        this.ListadoTrabajadores=res['data'].trabajadores;
      } else {
        this.ListadoTrabajadores=[];
      }
    });
  }

  TrabajadorSeleccionado(){
    let nombre_trabajador= this.EvaluacionArchivosForm.value.trabajador.nombre;
    this.EvaluacionArchivosForm.get('id_trabajador').setValue(this.EvaluacionArchivosForm.value.trabajador.id);
    this.EvaluacionArchivosForm.get('trabajador_cargo').setValue(this.EvaluacionArchivosForm.value.trabajador.cargo);
    this.EvaluacionArchivosForm.get('trabajador_documento').setValue(this.EvaluacionArchivosForm.value.trabajador.documento);
    this.EvaluacionArchivosForm.get('trabajador').setValue(nombre_trabajador);
  }
  
  RemoverTrabajador(){
    this.EvaluacionArchivosForm.get('id_trabajador').setValue(null);
    this.EvaluacionArchivosForm.get('trabajador').setValue("");
    this.EvaluacionArchivosForm.get('trabajador_cargo').setValue("");
    this.EvaluacionArchivosForm.get('trabajador_documento').setValue("");
    this.ListarTrabajador("");
  }

  ObtenerDireccion(id) {
    this.DServicios.ListarDireccion( id, '1',1,1).subscribe(res => {
      // console.log(res);
      if(res['codigo']==0){
        if (res['data']) {
          this.distrito_cliente = res['data'].direcciones[0].distrito;
          this.direccion_cliente = res['data'].direcciones[0].direccion_formateada;

          this.EvaluacionArchivosForm.get('direccion_resumen').setValue(res['data'].direcciones[0].direccion);
          this.EvaluacionArchivosForm.get('provincia').setValue(res['data'].direcciones[0].provincia);

          this.EvaluacionArchivosForm.get('considerar_direccion_cliente').setValue(true);
          this.EvaluacionArchivosForm.get('distrito').setValue(this.distrito_cliente);
          this.EvaluacionArchivosForm.get('direccion').setValue(this.direccion_cliente);
        } else {
          this.EvaluacionArchivosForm.get('direccion').setValue("No registra");
          this.EvaluacionArchivosForm.get('distrito').setValue("");
        }
      } else {
        this.EvaluacionArchivosForm.get('direccion').setValue(" Ocurrió un error al hacer la consulta ");
        this.EvaluacionArchivosForm.get('distrito').setValue("");
      }
    });
  }

  CambiarDireccion(evento){
    if(evento.checked){
      this.EvaluacionArchivosForm.get('distrito').setValue(this.distrito_cliente);
      this.EvaluacionArchivosForm.get('direccion').setValue(this.direccion_cliente);
    } else {
      this.EvaluacionArchivosForm.get('distrito').setValue(this.informacion_cooperativa['direccion_ddjj'].distrito);
      this.EvaluacionArchivosForm.get('direccion').setValue(this.informacion_cooperativa['direccion_ddjj'].direccion);
    }
  }

  ObtenerTelefono(id) {
    this.TServicios.ListarTelefono( id, '1',1,1).subscribe(res => {
      if(res['codigo']==0){
        if (res['data']) {
          this.EvaluacionArchivosForm.get('telefono_numero').setValue(res['data'].telefonos[0].tlf_numero);
          if(res['data'].telefonos[0].id_tipo==1){
            this.EvaluacionArchivosForm.get('telefono_tipo').setValue(res['data'].telefonos[0].tipo);
          } else {
            this.EvaluacionArchivosForm.get('telefono_tipo').setValue("Teléfono de " + res['data'].telefonos[0].tipo);
          }
        }else{
          this.EvaluacionArchivosForm.get('telefono_numero').setValue("No registra")
          this.EvaluacionArchivosForm.get('telefono_tipo').setValue("No registra")
        }
      }else{
        this.EvaluacionArchivosForm.get('telefono_numero').setValue(" Ocurrió un error al hacer la consulta ")
        this.EvaluacionArchivosForm.get('telefono_tipo').setValue(" Ocurrió un error al hacer la consulta ")
      }
    });
  }

  ObtenerNumeroCelular(id){
    this.CServicios.BuscarCelular(id).subscribe(res=>{
      if (res){
        this.EvaluacionArchivosForm.get('telefono_whatsapp').setValue(res);
      } else {
        this.EvaluacionArchivosForm.get('telefono_whatsapp').setValue(0);
      }
    })
  }

  ObtenerCuenta(id){
    this.CServicios.ListarCuenta( id, '1',1,1).subscribe(res => {
      // console.log(res)
      if(res['codigo']==0){
        if (res['data']) {
          this.EvaluacionArchivosForm.get('cuenta_banco').setValue(res['data'].cuentas[0].nombre_banco);
          this.EvaluacionArchivosForm.get('cuenta_numero').setValue(res['data'].cuentas[0].cuenta_numero);
        }else{
          this.EvaluacionArchivosForm.get('cuenta_banco').setValue("No registra")
          this.EvaluacionArchivosForm.get('cuenta_numero').setValue("No registra")
        }
      }else{
        this.EvaluacionArchivosForm.get('cuenta_banco').setValue(" Ocurrió un error al hacer la consulta ")
        this.EvaluacionArchivosForm.get('cuenta_numero').setValue(" Ocurrió un error al hacer la consulta ")
      }
    });
  }

  GenerarInputProductos(){
    this.productos.forEach((item=>{
      for(let i=0 ; i < item.numero ; i++ ){
        this.productos_generar.push({descripcion : item.descripcion, serie : ""});
      }
    }))
    console.log(this.productos.length, this.productos_generar)
  }

  GenerarArchivos(){
    let ahora = (new Date()).getTime();
    this.GenerarDDJJ("DDJJ_"+ahora);
    this.GenerarAutorizacion("Autorizacion_"+ahora);
    this.GenerarCompromiso("Compromiso_"+ahora);
    this.GenerarTarjeta("Tarjeta_"+ahora);
    this.GenerarTransaccion("Transaccion_"+ahora);
  }

  GenerarDDJJ(nombre_archivo){
    this.Servicios.GenerarDDJJ(
      this.EvaluacionArchivosForm.value.plantilla_ddjj,
      nombre_archivo,
      this.EvaluacionArchivosForm.value.nombre,
      this.EvaluacionArchivosForm.value.dni,
      this.EvaluacionArchivosForm.value.distrito,
      this.EvaluacionArchivosForm.value.direccion,
      this.EvaluacionArchivosForm.value.lugar,
      this.EvaluacionArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.ddjj=res['data'];
      }
    })
  }

  GenerarAutorizacion(nombre_archivo){
    this.Servicios.GenerarAutorizacion(
      this.EvaluacionArchivosForm.value.plantilla_autorizacion,
      nombre_archivo,
      this.cooperativa_nombre,
      this.EvaluacionArchivosForm.value.tipo,
      this.EvaluacionArchivosForm.value.nombre,
      this.EvaluacionArchivosForm.value.cargo_estado,
      this.EvaluacionArchivosForm.value.dni,
      this.EvaluacionArchivosForm.value.cip,
      this.EvaluacionArchivosForm.value.codigo,
      this.EvaluacionArchivosForm.value.direccion,
      this.EvaluacionArchivosForm.value.telefono_tipo,
      this.EvaluacionArchivosForm.value.telefono_numero,
      this.EvaluacionArchivosForm.value.email,
      this.EvaluacionArchivosForm.value.subsede,
      this.EvaluacionArchivosForm.value.monto_asociado,
      this.EvaluacionArchivosForm.value.monto_cuota,
      this.EvaluacionArchivosForm.value.numero_cuotas,
      this.EvaluacionArchivosForm.value.lugar,
      this.EvaluacionArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      // console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.autorizacion=res['data'];
      }
    })
  }

  GenerarTransaccion(nombre_archivo){
    this.Servicios.GenerarTransaccion(
      this.EvaluacionArchivosForm.value.plantilla_transaccion,
      nombre_archivo,
      this.cooperativa_nombre,
      this.cooperativa_direccion,
      this.cooperativa_direccion_1,
      this.cooperativa_direccion_2,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.presidente_nombre,
      this.presidente_dni,
      this.presidente_direccion,
      this.EvaluacionArchivosForm.value.nombre,
      this.EvaluacionArchivosForm.value.cargo_estado,
      this.EvaluacionArchivosForm.value.dni,
      this.EvaluacionArchivosForm.value.direccion,
      this.EvaluacionArchivosForm.value.casilla,
      this.EvaluacionArchivosForm.value.subsede,
      this.EvaluacionArchivosForm.value.fecha,
      this.contrato_dias_premura,
      Math.round(this.EvaluacionArchivosForm.value.total*100)/100,
      Math.round(this.EvaluacionArchivosForm.value.monto_cuota*100)/100,
      this.EvaluacionArchivosForm.value.numero_cuotas,
      this.penalidad_porcentaje,
      this.penalidad_maxima_cuota,
      this.EvaluacionArchivosForm.value.cuenta_banco,
      this.EvaluacionArchivosForm.value.cuenta_numero,
      this.EvaluacionArchivosForm.value.email,
      this.EvaluacionArchivosForm.value.telefono_whatsapp,
      this.EvaluacionArchivosForm.value.lugar,
      // Se pone eso para asegurarnos que hay un trabajador
      this.EvaluacionArchivosForm.value.id_trabajador ? this.EvaluacionArchivosForm.value.trabajador : "",
      this.EvaluacionArchivosForm.value.id_trabajador ? this.EvaluacionArchivosForm.value.trabajador_dni : "",
      this.EvaluacionArchivosForm.value.id_trabajador ? this.EvaluacionArchivosForm.value.trabajador_cargo : "",
      this.EvaluacionArchivosForm.value.vendedor,
      this.EvaluacionArchivosForm.value.vendedor_dni,
      this.cronograma,
      this.EvaluacionArchivosForm.value.tipo,
      this.productos_generar
    ).subscribe(res=>{
      console.log(res);
      this.generados=true;
      this.transaccion=res['data'];
    })
  }

  GenerarCompromiso(nombre_archivo){
    this.Servicios.GenerarCompromiso(
      this.EvaluacionArchivosForm.value.plantilla_compromiso,
      nombre_archivo,
      this.cooperativa_nombre,
      this.EvaluacionArchivosForm.value.nombre,
      this.EvaluacionArchivosForm.value.dni,
      this.EvaluacionArchivosForm.value.cip,
      this.cooperativa_cuenta_banco,
      this.cooperativa_cuenta_numero,
      this.cooperativa_contacto,
      this.EvaluacionArchivosForm.value.fecha_letras
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
      this.EvaluacionArchivosForm.value.plantilla_tarjeta,
      nombre_archivo,
      this.EvaluacionArchivosForm.value.nombre,
      this.EvaluacionArchivosForm.value.dni,
      this.EvaluacionArchivosForm.value.cip,
      this.EvaluacionArchivosForm.value.codigo,
      this.EvaluacionArchivosForm.value.cargo_estado,
      this.EvaluacionArchivosForm.value.direccion_resumen,
      this.EvaluacionArchivosForm.value.provincia,
      this.EvaluacionArchivosForm.value.trabajo,
      this.EvaluacionArchivosForm.value.cuenta_numero,
      this.EvaluacionArchivosForm.value.lugar,
      this.EvaluacionArchivosForm.value.telefono_numero,
      this.EvaluacionArchivosForm.value.monto_asociado,
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
      console.log(res);
      saveAs(res, nombre_archivo+'.docx');
    })
  }

  Guardar(){

    this.Servicios.CrearPresupuesto(
      this.EvaluacionArchivosForm.value.id_cliente,
      this.EvaluacionArchivosForm.value.tipo-1,
      this.EvaluacionArchivosForm.value.fecha,
      this.EvaluacionArchivosForm.value.id_vendedor,
      this.EvaluacionArchivosForm.value.numero_cuotas,
      this.EvaluacionArchivosForm.value.capital,
      this.EvaluacionArchivosForm.value.interes,
      this.EvaluacionArchivosForm.value.total,
      this.autorizacion,
      this.ddjj,
      this.transaccion,
      this.tarjeta,
      this.compromiso,
    ).subscribe(res=>{
      console.log(res);
      if( res['codigo']==0 ) {
          if (this.cronograma.length>0) {
          this.cronograma.forEach((item)=>{
            this.Servicios.CrearPresupuestoCronograma(
              res['data'],
              item.monto,
              item.aporte,
              item.fecha,
            ).subscribe()
          })
        }

        setTimeout(()=>{
          this.router.navigate(['/creditos','nuevo',res['data']])
        },500)

        // if (this.Productos.length>0) {
        // 	this.Productos.forEach((item)=>{
        // 		this.Servicio.CrearPresupuestoCronograma(
        // 			res['data'],
        // 			item.id,
        // 			item.numero,
        // 			item.precio,
        // 		).subscribe()
        // 	})
        // }
        
        // if (res['data']>0) {
        //   this.presupuesto_guardado.emit(true);
          this.Notificacion.Snack("Se creó el presupuesto","")
        // }
      } else {
        this.Notificacion.Snack("Ocurrió un error al crear el presupuesto","")
      }
    })
  
  }

}
