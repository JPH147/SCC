import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CreditosService } from './creditos.service';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatDialog, MatSort } from '@angular/material';
import {ServiciosTipoDocumento, TipoDocumento} from '../global/tipodocumento';
import {ServiciosTipoPago, TipoPago} from '../global/tipopago';
import {ClienteService } from '../clientes/clientes.service';
import {ClienteDataSource} from '../clientes/clientes.dataservice';
import { forkJoin,fromEvent, merge, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {ServiciosTelefonos, Telefono} from '../global/telefonos';
import {ServiciosDirecciones, Direccion} from '../global/direcciones';
import {ServiciosGenerales, Talonario, Serie} from '../global/servicios';
import * as moment from 'moment';
import {Location} from '@angular/common';
import {Notificaciones} from '../global/notificacion';
import {URLIMAGENES} from '../global/url'
import {SeleccionarClienteComponent} from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaEmergenteContacto} from '../clientes/ventana-emergentecontacto/ventanaemergentecontacto';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss'],
  providers: [CreditosService, ClienteService, ServiciosDirecciones, ServiciosTelefonos, ServiciosGenerales, ServiciosTipoPago]
})
export class CreditosComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public CreditosForm: FormGroup
  public id_credito: number;
  public id_credito_editar: number;
  public id_cliente: number;
  public garantes: FormArray;
  public editar_cronograma:number;

  public ListadoCronograma: CronogramaDataSource;
  public ColumnasCronograma: Array<string>;
  public Cronograma: Array<any>;
  public total_cronograma_editado: number;
  public diferencia: number;

  @ViewChild('InputTotal') FiltroTotal: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;
  @ViewChild('Vendedor') VendedorAutoComplete: ElementRef;
  @ViewChild('Autorizador') AutorizadorAutoComplete: ElementRef;

  public ListadoVendedores: Array<any>;
  public ListadoAudorizadores: Array<any>;
  public ListadoSucursales: Array<any>;
  public ListadoTipoPago: Array<any>;

  constructor(
    private Servicio: CreditosService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private TelefonoServicio: ServiciosTelefonos,
    private ServiciosGenerales: ServiciosGenerales,
    private ServicioTipoPago: ServiciosTipoPago,
    private location: Location,
    private Builder: FormBuilder,
    private Dialogo: MatDialog,
  ) { }

  ngOnInit() {

    this.CrearFormulario();

    // Se cargan los arrays del inicio
    this.ListarVendedor("");
    this.ListarAutorizador("");
    this.ListarTipoPago();
    this.ListarSucursales();

    this.editar_cronograma = 3;
    this.ListadoCronograma = new CronogramaDataSource();
    this.ColumnasCronograma= ['numero', 'fecha_vencimiento_ver', 'monto_cuota_ver'];

  }

  ngAfterViewInit(): void {

    fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarVendedor(this.CreditosForm.value.vendedor);
      })
     ).subscribe();

     fromEvent(this.AutorizadorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarAutorizador(this.CreditosForm.value.autorizador);
      })
     ).subscribe();

     merge(
      fromEvent(this.FiltroCuota.nativeElement,'keyup'),
      fromEvent(this.FiltroTotal.nativeElement,'keyup')
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if (
          // this.FiltroMonto.nativeElement.value &&
          this.FiltroTotal.nativeElement.value &&
          this.FiltroCuota.nativeElement.value &&
          this.CreditosForm.value.fecha_pago
        ) {
          this.CrearCronograma()
        }
      })
    ).subscribe()

  }

  CrearFormulario(){
    this.CreditosForm = this.Builder.group({
      id_cliente :[{value: null, disabled: false},[
      ]],
      cliente :[{value: null, disabled: false},[
      ]],
      cargo :[{value: null, disabled: false},[
      ]],
      trabajo :[{value: null, disabled: false},[
      ]],
      direccion :[{value: null, disabled: false},[
      ]],
      telefono :[{value: null, disabled: false},[
      ]],
      garante :[{value: null, disabled: false},[
      ]],
      fecha_credito: [{value: new Date(), disabled: false},[
      ]],
      sucursal: [{value: null, disabled: false},[
      ]],
      codigo: [{value: null, disabled: false},[
      ]],
      fecha_pago: [{value: moment(new Date()).add(1, 'months').toDate(), disabled: false},[
      ]],
      tipo_pago: [{value: null, disabled: false},[
      ]],
      cuotas: [{value: null, disabled: false},[
      ]],
      total: [{value: null, disabled: false},[
      ]],
      id_vendedor: [{value: null, disabled: false},[
      ]],
      vendedor: [{value: null, disabled: false},[
      ]],
      id_autorizador: [{value: null, disabled: false},[
      ]],
      autorizador: [{value: null, disabled: false},[
      ]],
      observaciones: [{value: null, disabled: false},[
      ]],
      garantes: this.Builder.array([])
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CreditosForm.get('id_cliente').setValue(res.id);
        this.ObtenerClientexId(res.id);
        this.ObtenerDireccion(res.id);
        this.ObtenerTelefono(res.id);
      }
    })
  }

  ObtenerClientexId(id_cliente) {

    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        // console.log(res)
        this.CreditosForm.get('cliente').setValue(res.nombre);
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
    this.CreditosForm.get('cargo').setValue("");
    this.CreditosForm.get('trabajo').setValue("");
    this.CreditosForm.get('direccion').setValue("");
    this.CreditosForm.get('telefono').setValue("");
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
    this.ServicioTipoPago.ListarTipoPago().subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  ListarVendedor(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
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
  }

  ListarAutorizador(nombre: string) {
    this.ServiciosGenerales.ListarVendedor("",nombre,"",1,5).subscribe( res => {
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
  }

  /*Cronograma */
  CrearCronograma(){

    this.Cronograma=[];

    let year = moment(this.CreditosForm.value.fecha_pago).year();
    let month = moment(this.CreditosForm.value.fecha_pago).month();
    let day = moment(this.CreditosForm.value.fecha_pago).date();

    let fecha_corregida:Date = new Date(year, month, day);

    let fecha:Date;

    let monto=Math.round((this.CreditosForm.value.total)*100/this.FiltroCuota.nativeElement.value)/100

    for (var i = 1; i<=this.FiltroCuota.nativeElement.value; i++) {

      fecha=moment(fecha_corregida).add(i-1, 'months').toDate();

      this.Cronograma.push({
        numero: i,
        fecha_vencimiento: fecha,
        monto_cuota: monto
      })

    }

    this.CalcularTotalCronograma();
    this.ListadoCronograma.AsignarInformacion(this.Cronograma);

  }

  CalcularTotalCronograma(){
    this.total_cronograma_editado=0;
    this.Cronograma.forEach((item)=>{
      this.total_cronograma_editado=this.total_cronograma_editado+item.monto_cuota*1;
    })
    this.diferencia=this.CreditosForm.value.total-this.total_cronograma_editado
  }

  EditarCronograma(estado){
    this.editar_cronograma=estado;
    this.CalcularTotalCronograma();
  }

  Atras(){
    this.location.back()
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
    this.Informacion.complete()
  }

  AsignarInformacion(array){
    this.Informacion.next(array);
  }

}