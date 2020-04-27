import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  public id_proceso : number ;
  public id_proceso_ver : number ;
  public id_proceso_editar : number ;
  public id_proceso_agregar : number ;
  public Distritos : Array<any>;
  public Instancias : Array<any>;
  public Jueces : Array<any>;
  public Especialistas : Array<any>;
  public Documentos : Array<any>;
  public DocumentosAnteriores : Array<any> = [];
  public juzgado_distrito_anterior : string ;
  public juzgado_instancia_anterior : string ;
  public expediente_anterior : string ;
  public penalidad_porcentaje : number ;
  public editar_expediente : number = 3 ;
  public editar_juzgado : number = 3 ;
  public DocumentosTransaccion : Array<any> = [] ;

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
          this.id_proceso = params['idprocesoagregar'] ;
          this.id_proceso_agregar = params['idprocesoagregar'];
          // this.id_proceso_agregar = 8 ;
          this.SeleccionarProceso(this.id_proceso_agregar);
        }
    
        if(params['idprocesover']){
          this.id_proceso = params['idprocesover'] ;
          this.id_proceso_ver = params['idprocesover'];
          // this.id_proceso_ver = 8 ;
          this.SeleccionarProceso(this.id_proceso_ver);
        }
      
        if(params['idprocesoeditar']){
          this.id_proceso = params['idprocesoeditar'] ;
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
      ).subscribe() ;

      this.JudicialForm.get('juez').valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          this.ListarJueces();
        })
      ).subscribe() ;

      this.JudicialForm.get('especialista').valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(()=>{
          this.ListarEspecialistas();
        })
      ).subscribe() ;
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
      id_juez : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      juez : [ { value : "", disabled : false },[
      ] ] ,
      id_especialista : [ { value : null, disabled : false },[
      ] ] ,
      especialista : [ { value : "", disabled : false },[
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
      this._judicial.ListarDetallexProceso( id_proceso ) ,
      this._judicial.ListarDocumentosTransaccionxProceso( id_proceso )
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
      this.ListarJueces() ;
      this.ListarEspecialistas() ;
      // if( this.id_proceso_editar ) {
        this.JudicialForm.get('id_juez').setValue(res[0].id_juez) ;
        this.JudicialForm.get('id_especialista').setValue(res[0].id_especialista) ;
      // }
      this.JudicialForm.get('juez').setValue(res[0].juez) ;
      this.JudicialForm.get('especialista').setValue(res[0].especialista) ;
      this.JudicialForm.get('expediente').setValue(res[0].expediente) ;
      this.JudicialForm.get('fecha_inicio').setValue(moment(res[0].fecha_inicio).toDate()) ;
      this.JudicialForm.get('sumilla').setValue(res[0].sumilla) ;
      this.JudicialForm.get('id_cliente').setValue(res[0].id_cliente) ;
      this.JudicialForm.get('cliente_documento').setValue(res[0].cliente_dni) ;
      this.JudicialForm.get('cliente_nombre').setValue(res[0].cliente_nombre) ;
      this.JudicialForm.get('codigo_documento').setValue(res[0].codigo) ;
      this.JudicialForm.get('total').setValue(res[0].total) ;
      this.JudicialForm.get('numero_cuotas').setValue(res[0].numero_cuotas) ;
      this.JudicialForm.get('monto_cuota').setValue(res[0].monto_cuota) ;
      if( res[1] ) {
        this.Documentos=res[1] ;
        this.Documentos = this.Documentos.map((item)=>{
                            item.fecha = moment(item.fecha).toDate();
                            item.archivo_antiguo = item.archivo;
                            item.archivo = item.archivo ? URLIMAGENES.carpeta + 'proceso judicial/' + item.archivo : "";
                            return item;
                          }) ;
                        }
      this.CargarDetalleAnterior(id_proceso);
      this.DocumentosTransaccion = res[2];
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
      this.JudicialForm.get('codigo_documento').setValue(res.contrato) ;
    });
  }

  CambiarTipoVista( tipo : number ){
    if( tipo==1 ) {
      this.id_proceso_editar = this.id_proceso ;
      this.id_proceso_agregar = null ;
      this.id_proceso_ver = null ;
    }
    if( tipo==2 ) {
      this.id_proceso_agregar = this.id_proceso ;
      this.id_proceso_editar = null ;
      this.id_proceso_ver = null ;
    }
    if( tipo==3 ) {
      this.id_proceso_ver = this.id_proceso ;
      this.id_proceso_editar = null ;
      this.id_proceso_agregar = null ;
    }
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

  CargarDetalleAnterior( id_proceso ){
    forkJoin(
      this._judicial.ListarAnteriorxId( id_proceso ) ,
      this._judicial.ListarDetalleAnteriorxProceso( id_proceso )
    )
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      if(res[1]) {
        this.juzgado_distrito_anterior = res[0].juzgado_distrito ,
        this.juzgado_instancia_anterior = res[0].juzgado_instancia ,
        this.expediente_anterior = res[0].expediente
        this.DocumentosAnteriores = res[1] ;
        this.DocumentosAnteriores = this.DocumentosAnteriores.map((item)=>{
                            item.fecha = moment(item.fecha).toDate();
                            item.archivo_antiguo = item.archivo;
                            item.archivo = item.archivo ? URLIMAGENES.carpeta + 'proceso judicial/' + item.archivo : "";
                            item.anteriores = true ;
                            return item;
                          })
      }
    })
  }

  ListarDistritosJudiciales(){
    this._vinculados.ListarDistritosJudiciales("",1,50).subscribe(res=>{
      this.Distritos = res['data'].distritos
    })
  }

  DistritoSeleccionado(){
    this.ListarInstanciasJudiciales() ;
    
    this.JudicialForm.get('instancia_judicial').setValue(null) ;
    this.JudicialForm.get('instancia_judicial_nombre').setValue("") ;
    this.JudicialForm.get('id_juez').setValue(null) ;
    this.JudicialForm.get('juez').setValue("") ;
    this.JudicialForm.get('id_especialista').setValue(null) ;
    this.JudicialForm.get('especialista').setValue("") ;
  }

  ListarInstanciasJudiciales(){
    this._vinculados.ListarInstanciasJudiciales(this.JudicialForm.value.distrito_judicial,"","",1,50).subscribe(res=>{
      this.Instancias = res['data'].instancias
    })
  }

  InstanciaSeleccionada(){
    this.JudicialForm.get('id_juez').setValue(null) ;
    this.JudicialForm.get('juez').setValue("") ;
    this.JudicialForm.get('id_especialista').setValue(null) ;
    this.JudicialForm.get('especialista').setValue("") ;
    this.ListarJueces() ;
    this.ListarEspecialistas() ;
  }

  ListarJueces(){
    this._vinculados.ListarJuez(this.JudicialForm.value.instancia_judicial,"","","juez",this.JudicialForm.value.juez,1,50).subscribe(res=>{
      this.Jueces = res['data'].jueces
    })
  }

  ListarEspecialistas(){
    this._vinculados.ListarJuez(this.JudicialForm.value.instancia_judicial,"","","especialista",this.JudicialForm.value.especialista,1,50).subscribe(res=>{
      this.Especialistas = res['data'].jueces
    })
  }

  JuezSeleccionado(event){
    this.JudicialForm.get('id_juez').setValue(event.option.value.id_juzgado_juez);
    this.JudicialForm.get('juez').setValue(event.option.value.juzgado_juez);
  }

  EspecialistaSeleccionado(event){
    this.JudicialForm.get('id_especialista').setValue(event.option.value.id_juzgado_juez);
    this.JudicialForm.get('especialista').setValue(event.option.value.juzgado_juez);
  }

  RemoverJuez(){
    this.JudicialForm.get('id_juez').setValue(null);
    this.JudicialForm.get('juez').setValue("");
  }

  RemoverEspecialista(){
    this.JudicialForm.get('id_especialista').setValue(null);
    this.JudicialForm.get('especialista').setValue("");
  }

  AgregarDocumento(){
    let Ventana = this.Dialogo.open(VentanaJudicialComponent,{
      data: { proceso : this.id_proceso_agregar, fecha : this.JudicialForm.value.fecha_inicio } ,
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
      this.JudicialForm.value.id_juez ,
      this.JudicialForm.value.id_especialista ,
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
        console.log(res)
        this.Notificacion.Snack("Se creó con éxito el proceso","");
        this.router.navigate(['/cobranza-judicial','agregar',res]);
      } else {
        this.Notificacion.Snack("Ocurrió un error al crear el proceso","")
      }
    })
  }

  EditarExpediente(numero){
    this.editar_expediente = numero ;
    if( numero==2 ){
      this._judicial.ActualizarProcesoCabecera(
        this.id_proceso_editar,
        this.JudicialForm.value.expediente ,
        this.JudicialForm.value.instancia_judicial ,
        this.JudicialForm.value.id_juez ,
        this.JudicialForm.value.id_especialista ,
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
        this.JudicialForm.value.id_juez ,
        this.JudicialForm.value.id_especialista ,
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

}
