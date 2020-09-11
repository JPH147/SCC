import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionarClienteComponent } from '../../compartido/componentes/seleccionar-cliente/seleccionar-cliente.component';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { RefinanciamientoService } from '../../components/refinanciamiento/refinanciamiento.service';
import { Observable, of , BehaviorSubject , merge } from 'rxjs';
import { catchError, finalize, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ProcesoJudicialVinculadosService } from '../../modulo-maestro/proceso-judicial-vinculados/proceso-judicial-vinculados.service';
import { EvaluacionService } from '../../modulo-clientes/evaluacion/evaluacion.service';
import { CobranzaJudicialService } from '../cobranza-judicial/cobranza-judicial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cobranza-judicial-multiple',
  templateUrl: './cobranza-judicial-multiple.component.html',
  styleUrls: ['./cobranza-judicial-multiple.component.scss']
})
export class CobranzaJudicialMultipleComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  public JudicialDocumentosForm : FormGroup ;
  public JudicialInformacionForm : FormGroup ;
  public ListadoTransacciones : TransaccionesDataSource ;  
  public Columnas : Array<string> ;
  public Distritos : Array<any>;
  public Instancias : Array<any>;
  public Jueces : Array<any>;
  public Especialistas : Array<any>;
  public penalidad_porcentaje : number ;

  constructor(
    private location : Location ,
    private Dialogo : MatDialog ,
    private _router : Router ,
    private _builder : FormBuilder ,
    private _judiciales : CobranzaJudicialService ,
    private _refinanciamiento: RefinanciamientoService ,
    private _vinculados : ProcesoJudicialVinculadosService ,
    private _evaluacion : EvaluacionService
  ) { }

  ngOnInit() {
    this.Columnas = [ "numero" , "considerar" , "fecha" , "tipo" , "documento" , "monto_pendiente" ] ;
    this.ListadoTransacciones = new TransaccionesDataSource(this._refinanciamiento) ;

    this.CrearFormularios() ;
    this.ListarDistritosJudiciales() ;
    this.ObtenerPenalidad() ;
  }

  ngAfterViewInit() {
    merge(
      this.JudicialInformacionForm.get('numero_cuotas').valueChanges,
      this.JudicialInformacionForm.get('total').valueChanges,
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.CalcularCuotas();
      })
    ).subscribe() ;

    this.JudicialInformacionForm.get('juez').valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if ( this.JudicialInformacionForm.value.instancia_judicial ) {
          this.ListarJueces();
        }
      })
    ).subscribe() ;

    this.JudicialInformacionForm.get('especialista').valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if ( this.JudicialInformacionForm.value.instancia_judicial ) {
          this.ListarEspecialistas();
        }
      })
    ).subscribe() ;

    this.JudicialInformacionForm.get('expediente').valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.VerificarExpedienteDuplicado() ;
      })
    ).subscribe() ;
  }

  Atras(){
    this.location.back()
  }

  CrearFormularios() {
    this.JudicialDocumentosForm = this._builder.group({
      id_cliente : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      cliente_nombre : [ { value : null , disabled : false } ,[
      ] ] ,
      monto_total : [ { value : 0 , disabled : false } ,[
      ] ] ,
      seleccionados : [ { value : 0 , disabled : false } ,[
        Validators.min(1)
      ] ] ,
    }) ;

    this.JudicialInformacionForm = this._builder.group({
      distrito_judicial : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      instancia_judicial : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      distrito_judicial_nombre : [ { value : "", disabled : false },[
      ] ] ,
      instancia_judicial_nombre : [ { value : "", disabled : false },[
      ] ] ,
      id_juez : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      juez : [ { value : "" , disabled : false } ,[
        Validators.required
      ] ] ,
      id_especialista : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      especialista : [ { value : "" , disabled : false } ,[
        Validators.required
      ] ] ,
      expediente : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      fecha_inicio : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      sumilla : [ { value : null , disabled : false } ,[
        Validators.required
      ] ] ,
      total : [ { value : 0 , disabled : false } ,[
        Validators.required
      ] ] ,
      numero_cuotas : [ { value : 1 , disabled : false } ,[
        Validators.required
      ] ] ,
      monto_cuota : [ { value : 0 , disabled : false } ,[
        Validators.required
      ] ] ,
    }) ;
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.JudicialDocumentosForm.get('id_cliente').setValue(res.id);
        this.JudicialDocumentosForm.get('cliente_nombre').setValue(res.nombre);
        this.BuscarMovimientos();
      }
    })
  }

  RemoverCliente(){
    this.JudicialDocumentosForm.get('id_cliente').setValue(null);
    this.JudicialDocumentosForm.get('cliente_nombre').setValue("");
    this.ListadoTransacciones.InformacionTransacciones.next([]);
  }

  BuscarMovimientos(){
    this.ListadoTransacciones.CargarInformacion(this.JudicialDocumentosForm.value.id_cliente);
  }

  ObtenerPenalidad(){
    this._evaluacion.ObtenerInformacion().subscribe(res=>{
      this.penalidad_porcentaje = res['cooperativa_configuracion'].find( e => e.parametro=="penalidad_credito_porcentaje" ).valor ;
    })
  }

  TransaccionSeleccionada(evento, id) {
    let contar = 0, total = 0 ;
    this.ListadoTransacciones.InformacionTransacciones.value.map((item)=>{
      if(item.id == id) {
        item.considerar=evento.checked ;
      }
      contar = contar + (item.considerar ? 1 : 0) ;
      total = total + (item.considerar ? item.monto_pendiente : 0) ;
      return ;
    })
    this.JudicialDocumentosForm.get('seleccionados').setValue( contar ) ;
    this.JudicialDocumentosForm.get('monto_total').setValue( total ) ;

    let monto_penalidad = Math.round( total*(100+this.penalidad_porcentaje) ) / 100 ;

    this.JudicialInformacionForm.get('total').setValue( monto_penalidad ) ;
  }

  ListarDistritosJudiciales(){
    this._vinculados.ListarDistritosJudiciales("",1,50).subscribe(res=>{
      this.Distritos = res['data'].distritos
    })
  }

  DistritoSeleccionado(){
    this.ListarInstanciasJudiciales() ;

    this.JudicialInformacionForm.get('instancia_judicial').setValue(null) ;
    this.JudicialInformacionForm.get('instancia_judicial_nombre').setValue("") ;
    this.JudicialInformacionForm.get('id_juez').setValue(null) ;
    this.JudicialInformacionForm.get('juez').setValue("") ;
    this.JudicialInformacionForm.get('id_especialista').setValue(null) ;
    this.JudicialInformacionForm.get('especialista').setValue("") ;
  }

  ListarInstanciasJudiciales(){
    this._vinculados.ListarInstanciasJudiciales(this.JudicialInformacionForm.value.distrito_judicial,"","",1,50).subscribe(res=>{
      this.Instancias = res['data'].instancias
    })
  }

  InstanciaSeleccionada(){
    this.JudicialInformacionForm.get('id_juez').setValue(null) ;
    this.JudicialInformacionForm.get('juez').setValue("") ;
    this.JudicialInformacionForm.get('id_especialista').setValue(null) ;
    this.JudicialInformacionForm.get('especialista').setValue("") ;
    this.ListarJueces() ;
    this.ListarEspecialistas() ;
  }

  ListarJueces(){
    this._vinculados.ListarJuez(this.JudicialInformacionForm.value.instancia_judicial,"","","juez",this.JudicialInformacionForm.value.juez,1,50).subscribe(res=>{
      this.Jueces = res['data'].jueces
    })
  }

  ListarEspecialistas(){
    this._vinculados.ListarJuez(this.JudicialInformacionForm.value.instancia_judicial,"","","especialista",this.JudicialInformacionForm.value.especialista,1,50).subscribe(res=>{
      this.Especialistas = res['data'].jueces
    })
  }

  JuezSeleccionado(event){
    this.JudicialInformacionForm.get('id_juez').setValue(event.option.value.id_juzgado_juez);
    this.JudicialInformacionForm.get('juez').setValue(event.option.value.juzgado_juez);
  }

  EspecialistaSeleccionado(event){
    this.JudicialInformacionForm.get('id_especialista').setValue(event.option.value.id_juzgado_juez);
    this.JudicialInformacionForm.get('especialista').setValue(event.option.value.juzgado_juez);
  }

  RemoverJuez(){
    this.JudicialInformacionForm.get('id_juez').setValue(null);
    this.JudicialInformacionForm.get('juez').setValue("");
  }

  RemoverEspecialista(){
    this.JudicialInformacionForm.get('id_especialista').setValue(null);
    this.JudicialInformacionForm.get('especialista').setValue("");
  }

  CalcularCuotas(){
    let cuota : number = 0 ;
    cuota = this.JudicialInformacionForm.value.total / this.JudicialInformacionForm.value.numero_cuotas ;
    cuota = Math.round(cuota*100) / 100 ;
    this.JudicialInformacionForm.get('monto_cuota').setValue(cuota);
  }

  VerificarExpedienteDuplicado(){
    this._judiciales.ContarProcesoJudicialExpediente(
      this.JudicialDocumentosForm.get('expediente').value
    ).subscribe(  res =>{
      if( res > 0 ){
        this.JudicialDocumentosForm.get('expediente').setErrors({ repetido : true })
      } else {
        this.JudicialDocumentosForm.get('expediente').setErrors(null)
      }
    })
  }

  Guardar(){
    this.Cargando.next(true) ;
    let transacciones = this.ListadoTransacciones.InformacionTransacciones.value ;

    transacciones = transacciones.filter( e=> e.considerar ) ;

    this._judiciales.CrearProcesoTransaccionesMultiples(
      this.JudicialDocumentosForm.value.id_cliente , 
      this.JudicialInformacionForm.value.expediente , 
      this.JudicialInformacionForm.value.instancia_judicial , 
      this.JudicialInformacionForm.value.id_juez , 
      this.JudicialInformacionForm.value.id_especialista ,
      this.JudicialInformacionForm.value.fecha_inicio ,
      this.JudicialInformacionForm.value.sumilla ,
      this.JudicialInformacionForm.value.numero_cuotas ,
      this.JudicialInformacionForm.value.total ,
      transacciones
    )
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      if( res ) {
        this._router.navigate(['/cobranza-judicial', 'agregar', res] )
      }
    })
  }
}

export class TransaccionesDataSource implements DataSource<any> {
  public InformacionTransacciones = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();

  constructor(
    private _refinanciamiento: RefinanciamientoService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTransacciones.asObservable();
  }

  disconnect() {
    this.InformacionTransacciones.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    cliente:number,
  ) {
    this.CargandoInformacion.next(true);

    this._refinanciamiento.ListarTransaccionesConInteres( cliente )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.InformacionTransacciones.next(res['data'].transacciones);
    });
  }

}