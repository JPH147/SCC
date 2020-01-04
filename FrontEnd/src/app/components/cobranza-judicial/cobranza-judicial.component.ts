import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SeleccionarClienteComponent } from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaJudicialComponent } from './ventana-judicial/ventana-judicial.component';
import { CobranzaJudicialService } from './cobranza-judicial.service';
import { Notificaciones } from '../global/notificacion';
import { finalize, map, distinctUntilChanged, tap, debounceTime } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CreditosService } from '../creditos/creditos.service';
import { VentaService } from '../ventas/ventas.service';
import * as moment from 'moment'
import { EvaluacionService } from '../evaluacion/evaluacion.service';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { URLIMAGENES } from '../../components/global/url' ;
import { ProcesoJudicialVinculadosService } from '../proceso-judicial-vinculados/proceso-judicial-vinculados.service';

@Component({
  selector: 'app-cobranza-judicial',
  templateUrl: './cobranza-judicial.component.html',
  styleUrls: ['./cobranza-judicial.component.scss']
})

export class CobranzaJudicialComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public id_venta : number = 0 ;
  public id_credito : number = 0 ;
  public JudicialForm : FormGroup ;
  public id_proceso_ver : number ;
  public id_proceso_editar : number ;
  public id_proceso_agregar : number ;
  public Distritos : Array<any>;
  public Instancias : Array<any>;
  public Documentos : Array<any>;
  public penalidad_porcentaje : number ;
  public editar_expediente : number = 3 ;
  public editar_juzgado : number = 3 ;

  constructor(
    private router : Router ,
    private route : ActivatedRoute ,
    private Dialogo : MatDialog ,
    private Builder : FormBuilder ,
    private Notificacion : Notificaciones ,
    private location : Location ,
    private _vinculados : ProcesoJudicialVinculadosService ,
    private _evaluacion : EvaluacionService ,
    private _judicial : CobranzaJudicialService ,
    private _creditos : CreditosService ,
    private _ventas : VentaService
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListarDistritosJudiciales() ;

    this.route.params.subscribe(params => {
      // Verifica si 'params' tiene datos
      if(Object.keys(params).length>0){
        if(params['idprocesoagregar']){
          this.id_proceso_agregar = params['idprocesoagregar'];
          this.SeleccionarProceso(this.id_proceso_agregar);
        }

        if(params['idprocesover']){
          this.id_proceso_ver = params['idprocesover'];
          this.SeleccionarProceso(this.id_proceso_ver);
        }

        if(params['idprocesoeditar']){
          this.id_proceso_editar = params['idprocesoeditar'];
          this.SeleccionarProceso(this.id_proceso_editar);
        }

        if(params['idcredito']){
          this.id_credito=params['idcredito'] ;
          this.SeleccionarCredito();
          this.ObtenerDatosCooperativa();
        }

        if(params['idventa']){
          this.id_venta=params['idventa'] ;
          this.SeleccionarVenta();
          this.ObtenerDatosCooperativa();
        }

        if(params['idventasalida']){
          this.id_venta=params['idventasalida'] ;
          this.SeleccionarVentaSalida();
          this.ObtenerDatosCooperativa();
        }
      }
    })
  }

  ngAfterViewInit(): void {
    if( this.id_credito || this.id_venta || this.id_proceso_editar ){
      merge(
        this.JudicialForm.get('numero_cuotas').valueChanges,
        this.JudicialForm.get('total').valueChanges,
      )
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          this.CalcularCuotas();
        })
      ).subscribe()
    }
  }

  CrearFormulario(){
    this.JudicialForm = this.Builder.group({
      distrito_judicial : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      instancia_judicial : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      distrito_judicial_nombre : [ { value : null, disabled : false },[
      ] ] ,
      instancia_judicial_nombre : [ { value : null, disabled : false },[
      ] ] ,
      juez : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      especialista : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      expediente : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      fecha_inicio : [ { value : new Date(), disabled : false },[
        Validators.required
      ] ] ,
      sumilla : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      tipo_transaccion : [ { value : "", disabled : false },[
        Validators.required
      ] ] ,
      codigo_documento : [ { value : "", disabled : false },[
        Validators.required
      ] ] ,
      id_cliente : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      cliente_nombre : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      cliente_documento : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      deuda : [ { value : 0, disabled : false },[
        Validators.required
      ] ] ,
      total : [ { value : 0, disabled : false },[
        Validators.required ,
        Validators.min(1) ,
      ] ] ,
      numero_cuotas : [ { value : 1, disabled : false },[
        Validators.required ,
        Validators.min(1) ,
      ] ] ,
      monto_cuota : [ { value : 0, disabled : false },[
        Validators.required ,
        Validators.min(1) ,
      ] ] ,
    })
  }

  SeleccionarProceso(id_proceso){
    this.Cargando.next(true);
    forkJoin(
      this._judicial.ListarxId( id_proceso ) ,
      this._judicial.ListarDetallexProceso( id_proceso )  
    )
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      this.JudicialForm.get('distrito_judicial').setValue(res[0].id_juzgado_distrito) ;
      this.JudicialForm.get('distrito_judicial_nombre').setValue(res[0].juzgado_distrito) ;
      this.ListarInstanciasJudiciales();
      this.JudicialForm.get('instancia_judicial').setValue(res[0].id_juzgado_instancia) ;
      this.JudicialForm.get('instancia_judicial_nombre').setValue(res[0].juzgado_instancia) ;

      this.JudicialForm.get('juez').setValue(res[0].juez) ;
      this.JudicialForm.get('especialista').setValue(res[0].especialista) ;
      this.JudicialForm.get('expediente').setValue(res[0].expediente) ;
      this.JudicialForm.get('fecha_inicio').setValue(moment(res[0].fecha_inicio).toDate()) ;
      this.JudicialForm.get('sumilla').setValue(res[0].sumilla) ;
      this.JudicialForm.get('id_cliente').setValue(res[0].id_cliente) ;
      this.JudicialForm.get('cliente_documento').setValue(res[0].cliente_dni) ;
      this.JudicialForm.get('cliente_nombre').setValue(res[0].cliente_documento) ;
      this.JudicialForm.get('tipo_transaccion').setValue(res[0].tipo) ;
      this.JudicialForm.get('codigo_documento').setValue(res[0].codigo) ;
      this.JudicialForm.get('total').setValue(res[0].total) ;
      this.JudicialForm.get('numero_cuotas').setValue(res[0].numero_cuotas) ;
      this.JudicialForm.get('monto_cuota').setValue(res[0].monto_cuota) ;
      // this.CargarDetalle(id_proceso);
      this.Documentos=res[1] ;
      this.Documentos = this.Documentos.map((item)=>{
                          item.fecha = moment(item.fecha).toDate();
                          item.archivo_antiguo = item.archivo;
                          item.archivo = item.archivo ? URLIMAGENES.carpeta + 'proceso judicial/' + item.archivo : "";
                          return item;
                        })
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.JudicialForm.get('id_cliente').setValue(res.id);
        this.JudicialForm.get('cliente_nombre').setValue(res.nombre);
        this.JudicialForm.get('cliente_documento').setValue(res.dni); 
      }
    })
  }

  SeleccionarCredito(){
    this.Cargando.next(true);
    this._creditos.Seleccionar(this.id_credito)
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      this.JudicialForm.get('id_cliente').setValue(res.id_cliente) ;
      this.JudicialForm.get('cliente_documento').setValue(res.cliente_dni) ;
      this.JudicialForm.get('cliente_nombre').setValue(res.cliente) ;
      this.JudicialForm.get('deuda').setValue( +res.total ) ;
      this.JudicialForm.get('total').setValue( (+res.total*1+this.penalidad_porcentaje) ) ;
      this.JudicialForm.get('tipo_transaccion').setValue("Préstamo") ;
      this.JudicialForm.get('codigo_documento').setValue(res.codigo_credito) ;
    });
  }

  SeleccionarVenta(){
    this.Cargando.next(true);
    this._ventas.SeleccionarVenta(this.id_venta)
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      this.JudicialForm.get('id_cliente').setValue(res.id_cliente) ;
      this.JudicialForm.get('cliente_documento').setValue(res.cliente_dni) ;
      this.JudicialForm.get('cliente_nombre').setValue(res.cliente_nombre) ;
      this.JudicialForm.get('deuda').setValue( +res.monto_total ) ;
      this.JudicialForm.get('total').setValue( +res.monto_total*+this.penalidad_porcentaje ) ;
      this.JudicialForm.get('tipo_transaccion').setValue("Venta") ;
      this.JudicialForm.get('codigo_documento').setValue(res.contrato) ;
    });
  }

  SeleccionarVentaSalida(){
    this.Cargando.next(true);
    this._ventas.SeleccionarVentaSalida(this.id_venta)
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      this.JudicialForm.get('id_cliente').setValue(res.id_cliente) ;
      this.JudicialForm.get('cliente_documento').setValue(res.cliente_dni) ;
      this.JudicialForm.get('cliente_nombre').setValue(res.cliente_nombre) ;
      this.JudicialForm.get('deuda').setValue( +res.monto_total ) ;
      this.JudicialForm.get('total').setValue( +res.monto_total*+this.penalidad_porcentaje ) ;
      this.JudicialForm.get('tipo_transaccion').setValue("Venta") ;
      this.JudicialForm.get('codigo_documento').setValue(res.contrato) ;
    });
  }

  CargarDetalle( id_proceso ){
    this.Cargando.next(true);
    this._judicial.ListarDetallexProceso( id_proceso )
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      // console.log(res)
      this.Documentos=res ;
      this.Documentos = this.Documentos.map((item)=>{
                          item.fecha = moment(item.fecha).toDate();
                          item.archivo_antiguo = item.archivo;
                          item.archivo = item.archivo ? URLIMAGENES.carpeta + 'proceso judicial/' + item.archivo : "";
                          return item;
                        })
    })
  }

  ListarDistritosJudiciales(){
    this._vinculados.ListarDistritosJudiciales("",1,50).subscribe(res=>{
      this.Distritos = res['data'].distritos
    })
  }

  ListarInstanciasJudiciales(){
    this._vinculados.ListarInstanciasJudiciales(this.JudicialForm.value.distrito_judicial,"","",1,50).subscribe(res=>{
      this.Instancias = res['data'].instancias
    })
  }

  AgregarDocumento(){
    let Ventana = this.Dialogo.open(VentanaJudicialComponent,{
      data: { proceso : this.id_proceso_agregar } ,
      width: '900px'
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this.Notificacion.Snack("Se creó el documento satisfactoriamente","");
          this.CargarDetalle(this.id_proceso_agregar);
        } else {
          this.Notificacion.Snack("Ocurrió un error al crear el documento","");
        }
      }
    })
  }

  ObtenerDatosCooperativa(){
    let monto_referencia : number = 0 ;
    this._evaluacion.ObtenerInformacion().subscribe(res=>{
      this.penalidad_porcentaje = res['cooperativa_configuracion'].find(e => e.parametro=="penalidad_credito_porcentaje").valor ;
      this.penalidad_porcentaje = ( 1 + this.penalidad_porcentaje/100 ) ;
      monto_referencia = +this.JudicialForm.value.deuda * +this.penalidad_porcentaje ;
      monto_referencia = Math.round(monto_referencia*100)/100 ;
      this.JudicialForm.get('total').setValue( monto_referencia ) ;
    })
  }

  CalcularCuotas(){
    let cuota : number = 0 ;
    cuota = this.JudicialForm.value.total / this.JudicialForm.value.numero_cuotas ;
    cuota = Math.round(cuota*100) / 100 ;
    this.JudicialForm.get('monto_cuota').setValue(cuota);
  }

  EditarExpediente(numero){
    this.editar_expediente = numero ;
    if( numero==2 ){
      this._judicial.ActualizarProcesoCabecera(
        this.id_proceso_editar,
        this.JudicialForm.value.expediente ,
        this.JudicialForm.value.instancia_judicial ,
        this.JudicialForm.value.juez ,
        this.JudicialForm.value.especialista ,
        this.JudicialForm.value.fecha_inicio ,
        this.JudicialForm.value.sumilla ,
        this.JudicialForm.value.numero_cuotas ,
        this.JudicialForm.value.total
      ).subscribe(res=>{
        if(res){
          this.SeleccionarProceso(this.id_proceso_editar) ;
          this.Notificacion.Snack("Se actualizaron los datos satisfactoriamente","")
        } else {
          this.Notificacion.Snack("Ocurrió un error al actualizar los datos","")
        }
      })
    }
  }

  EditarJuzgado(numero){
    this.editar_juzgado = numero ;
    if( numero==2 ){
      this._judicial.ActualizarProcesoCabecera(
        this.id_proceso_editar,
        this.JudicialForm.value.expediente ,
        this.JudicialForm.value.instancia_judicial ,
        this.JudicialForm.value.juez ,
        this.JudicialForm.value.especialista ,
        this.JudicialForm.value.fecha_inicio ,
        this.JudicialForm.value.sumilla ,
        this.JudicialForm.value.numero_cuotas ,
        this.JudicialForm.value.total
      ).subscribe(res=>{
        if(res){
          this.SeleccionarProceso(this.id_proceso_editar) ;
          this.Notificacion.Snack("Se actualizaron los datos satisfactoriamente","")
        } else {
          this.Notificacion.Snack("Ocurrió un error al actualizar los datos","")
        }
      })
    }
  }

  EditarDetalle(proceso){
    let Ventana = this.Dialogo.open(VentanaJudicialComponent,{
      data: { proceso_detalle : proceso, proceso: this.id_proceso_agregar ? this.id_proceso_agregar : this.id_proceso_editar } ,
      width: '900px'
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this.Notificacion.Snack("Se actualizó el documento satisfactoriamente","");
          this.CargarDetalle(this.id_proceso_agregar ? this.id_proceso_agregar : this.id_proceso_editar);
        } else {
          this.Notificacion.Snack("Ocurrió un error al actualizar el documento","");
        }
      }
    })
  }

  EliminarDetalle(proceso){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el documento", valor: proceso.sumilla }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this._judicial.EliminarProcesoDetalle(proceso.id).subscribe((res)=>{
          this.CargarDetalle(this.id_proceso_editar);
        });
      }
    })
  }

  AbrirDocumento(archivo){
    // console.log(archivo);
    if(archivo){
      window.open(archivo, "_blank");
    }
  }

  Atras(){
    this.location.back();
  }

  Guardar(){
    this.Cargando.next(true);
    this._judicial.CrearProcesoCabecera(
      this.id_venta ,
      this.id_credito ,
      this.JudicialForm.value.expediente ,
      this.JudicialForm.value.instancia_judicial ,
      this.JudicialForm.value.juez ,
      this.JudicialForm.value.especialista ,
      this.JudicialForm.value.fecha_inicio ,
      this.JudicialForm.value.sumilla ,
      this.JudicialForm.value.numero_cuotas ,
      this.JudicialForm.value.total ,
    )
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      if(res){
        this.Notificacion.Snack("Se creó con éxito el proceso","");
        this.router.navigate(['/cobranza-judicial']);
      } else {
        this.Notificacion.Snack("Ocurrió un error al crear el proceso","")
      }
    })
  }

}
