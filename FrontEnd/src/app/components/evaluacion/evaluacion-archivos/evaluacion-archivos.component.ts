import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EvaluacionService } from '../evaluacion.service';
import { ServiciosDirecciones } from '../../global/direcciones';
import { ServiciosTelefonos } from '../../global/telefonos';
import { ClienteService } from '../../clientes/clientes.service';
import * as moment from 'moment';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-evaluacion-archivos',
  templateUrl: './evaluacion-archivos.component.html',
  styleUrls: ['./evaluacion-archivos.component.css'],
  providers : [ EvaluacionService , ServiciosDirecciones , ServiciosTelefonos , ClienteService ]
})

export class EvaluacionArchivosComponent implements OnInit {

	@Input() informacion_venta: Observable<any>;
  public EvaluacionArchivosForm : FormGroup;
  public cliente_afiliado : boolean = false;
  public generados : boolean = false;
  public ddjj : string ;
  public autorizacion : string ;
  public compromiso : string ;
  public transaccion : string ;
  public cronograma : Array<any>;
  
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
    private Servicios : EvaluacionService,
    private DServicios : ServiciosDirecciones,
    private TServicios: ServiciosTelefonos,
    private CServicios : ClienteService,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.CrearFormulario();
    this.ActualizarInformacion();
    this.ObtenerDatosCooperativa();
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
      total : [ { value : null , disabled : false } , [
      ]],
      monto_asociado : [ { value : null , disabled : false } , [
      ]],
      monto_cuota : [ { value : null , disabled : false } , [
      ]],
      numero_cuotas : [ { value : null , disabled : false } , [
      ]],
      telefono_tipo : [ { value : null , disabled : false } , [
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
      cuenta_banco : [ { value : null , disabled : false } , [
      ]],
      cuenta_numero : [ { value : null , disabled : false } , [
      ]],
      fecha_letras : [ { value : null , disabled : false } , [
      ]],
      lugar : [ { value : null , disabled : false } , [
        Validators.required
      ]],
    })
  }

  ActualizarInformacion(){
    this.informacion_venta.subscribe(res=>{
      // console.log(res);
      if(res.cliente){
        this.cliente_afiliado=res['afiliado'];
        if(res.cliente.id) {
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
        // this.EvaluacionArchivosForm.get('cuenta_banco').setValue(res.cliente.nombre_banco)
        // this.EvaluacionArchivosForm.get('cuenta_numero').setValue(res.cliente.cuenta_numero)
        this.EvaluacionArchivosForm.get('fecha_letras').setValue(res.fecha)
        this.EvaluacionArchivosForm.get('cargo').setValue(res.cargo_nombre + " " +res.cargo_estado);
        this.EvaluacionArchivosForm.get('total').setValue(res.total);
        this.EvaluacionArchivosForm.get('monto_asociado').setValue(res.aporte);
        this.EvaluacionArchivosForm.get('monto_cuota').setValue(res.cronograma[0].total);
        this.EvaluacionArchivosForm.get('numero_cuotas').setValue(res.cuotas);
        this.EvaluacionArchivosForm.get('tipo').setValue(res.venta+1);
        this.cronograma=res.cronograma;
      }
    })
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
            this.EvaluacionArchivosForm.get('telefono_tipo').setValue("Teléfono de" + res['data'].telefonos[0].tipo);
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
          this.EvaluacionArchivosForm.get('cuenta_numero').setValue("Teléfono de" + res['data'].cuentas[0].cuenta_numero);
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

  GenerarArchivos(){
    let ahora = (new Date()).getTime();
    // this.GenerarDDJJ("DDJJ_"+ahora);
    // this.GenerarAutorizacion("Autorizacion_"+ahora);
    // this.GenerarCompromiso("Compromiso_"+ahora);
    // this.GenerarTarjeta("Tarjeta_"+ahora);
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
      console.log(res)
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
      console.log(res)
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
      "VENDEDOR",
      "DNI VENDEDOR",
      this.cronograma
    ).subscribe(res=>{
      console.log(res);
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
      console.log(res)
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
      console.log(res)
      if(res['codigo']==0){
        this.generados=true;
        this.compromiso=res['data'];
      }
    })
  }

  AbrirArchivo(nombre_archivo){
    this.Servicios.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      console.log(res);
      saveAs(res, nombre_archivo+'.docx');
    })
  }

}
