import { Component, OnInit } from '@angular/core';
import {CollectionViewer} from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CobranzaJudicialService } from '../cobranza-judicial/cobranza-judicial.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Notificaciones } from '../global/notificacion';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cobranza-judicial-generar',
  templateUrl: './cobranza-judicial-generar.component.html',
  styleUrls: ['./cobranza-judicial-generar.component.scss']
})
export class CobranzaJudicialGenerarComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public id_proceso_nuevo : number ;
  public id_proceso_ver : number ;
  public JudicialForm : FormGroup ;
  public cronograma : Array<any> ;
  public ListadoCronograma : CronogramaDataSource ;
  public Columnas : Array<string>;

  constructor(
    private route : ActivatedRoute ,
    private location : Location ,
    private Builder : FormBuilder ,
    private Notificacion : Notificaciones ,
    private _judicial : CobranzaJudicialService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.CorregirFecha();

    this.ListadoCronograma = new CronogramaDataSource();
    this.Columnas = ['numero','fecha','total'] ;

    this.route.params.subscribe(params => {
      if(Object.keys(params).length>0){
        if(params['idprocesonuevo']){
          this.id_proceso_nuevo = params['idprocesonuevo'];
          // this.id_proceso_nuevo = 4;
          this.SeleccionarProceso(this.id_proceso_nuevo);
        }
        if(params['idprocesover']){
          this.id_proceso_ver = params['idprocesover'];
          // this.id_proceso_nuevo = 4;
          this.SeleccionarProceso(this.id_proceso_ver);
        }
      }
    })
  }

  CrearFormulario(){
    this.JudicialForm = this.Builder.group({
      fecha_inicio : [ { value : new Date(), disabled : false },[
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
      tipo_transaccion : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      codigo_documento : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      total : [ { value : 0, disabled : false },[
        Validators.required ,
        Validators.min(1) ,
        Validators.pattern ('[0-9- ]+')
      ] ] ,
      numero_cuotas : [ { value : 0, disabled : false },[
        Validators.required ,
        Validators.min(1) ,
        Validators.pattern ('[0-9- ]+')
      ] ] ,
      monto_cuota : [ { value : 0, disabled : false },[
        Validators.required ,
        Validators.min(1) ,
      ] ] ,
    })
  }

  CorregirFecha(){
    let fecha = this.JudicialForm.value.fecha_inicio ;
    let ano = moment( fecha ).year() ;
    let mes = moment( fecha ).month() ;
    this.JudicialForm.get('fecha_inicio').setValue( new Date(ano, mes, 27) );
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
      this.JudicialForm.get('id_cliente').setValue(res[0].id_cliente) ;
      this.JudicialForm.get('cliente_documento').setValue(res[0].cliente_dni) ;
      this.JudicialForm.get('cliente_nombre').setValue(res[0].cliente_documento) ;
      this.JudicialForm.get('tipo_transaccion').setValue(res[0].tipo) ;
      this.JudicialForm.get('codigo_documento').setValue(res[0].codigo) ;
      this.JudicialForm.get('total').setValue(res[0].total) ;
      this.JudicialForm.get('numero_cuotas').setValue(res[0].numero_cuotas) ;
      this.JudicialForm.get('monto_cuota').setValue(res[0].monto_cuota) ;
      this.CrearCronograma();
    })
  }
  
  CrearCronograma(){
    this.cronograma = [] ;
    let cuotas : number = this.JudicialForm.value.numero_cuotas ;
    let fecha_corregida : Date = this.JudicialForm.value.fecha_inicio ;
    let monto : number = this.JudicialForm.value.monto_cuota ;
    let fecha : Date ;

    for (let j = 1; j<=cuotas; j++) {
      fecha=moment(fecha_corregida).add(j-1, 'months').toDate();
      this.cronograma.push({
        numero: j,
        fecha: fecha,
        total: monto,
      })
    }

    this.ListadoCronograma.CargarInformacion(this.cronograma) ;
  }

  Atras(){
    this.location.back();
  }

  Guardar(){
    this.Cargando.next(true);
    let largo : number = this.cronograma.length ;
    let i : number = 0, i2 : number = 0;

    this._judicial.ActualizarProcesoCobranza(
      this.id_proceso_nuevo,
      this.JudicialForm.value.fecha_inicio
    )
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      if(res){
        this.cronograma.forEach((item)=>{
          return this._judicial.CrearProcesoCronograma(
            this.id_proceso_nuevo,
            item.total,
            item.fecha,
          ).subscribe(resultado=>{
            i2++;
            if(resultado) {
              i++;
              if( i2 == largo ) {
                if(i==largo){
                  this.Notificacion.Snack("Se creó el cronograma satisfactoriamente.","")
                  this.Atras();
                } else {
                  this.Notificacion.Snack("Ocurrió un error al crear el cronograma.","")
                  this.Atras();
                }
              }
            }
          })
        })
      }
    })
  }

}

export class CronogramaDataSource {

  public Cuotas= new BehaviorSubject<any>([]);

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.Cuotas.asObservable();
  }
  
  disconnect() { }
  
  CargarInformacion(cuotas){
    this.Cuotas.next(cuotas)
  }

}