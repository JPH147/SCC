import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Observable, BehaviorSubject, of, fromEvent, merge, forkJoin, Subject } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzaJudicialService } from '../cobranza-judicial/cobranza-judicial.service';
import { VentanaConfirmarComponent } from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcesoJudicialVinculadosService } from '../../modulo-maestro/proceso-judicial-vinculados/proceso-judicial-vinculados.service';
import { VentanaCambioDistritoComponent } from './ventana-cambio-distrito/ventana-cambio-distrito.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as moment from 'moment' ;
import { DbService } from 'src/app/core/servicios/db.service';
import { ArchivosService } from 'src/app/core/servicios/archivos';
import { saveAs } from 'file-saver' ;

@Component({
  selector: 'app-cobranza-judicial-listar',
  templateUrl: './cobranza-judicial-listar.component.html',
  styleUrls: ['./cobranza-judicial-listar.component.css'],
})

export class CobranzaJudicialListarComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public Subject$ = new Subject<boolean>() ;

  public TipoDocumentos : Array<any> ;
  public Cuentas : Array<any> = [];
  public Distritos : Array<any> = [];

  public permiso : Rol ;
  public total_procesos : number = 0 ;

  public ProcesosJudicialesForm : FormGroup ;

  public InformacionDistritosArray : Array<any> ;
  // public InformacionInstanciasArray : Array<any> ;
  // public InformacionProcesosArray : Array<any> ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private route : ActivatedRoute ,
    private router : Router ,
    private Dialogo : MatDialog ,
    private Notificaciones : Notificaciones ,
    private _judicial: CobranzaJudicialService,
    private _vinculados : ProcesoJudicialVinculadosService ,
    private _builder : FormBuilder ,
    private db : DbService ,
    private AServicio : ArchivosService,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.ListarTipoDocumentos();
    this.CargarData();
    this.EncontrarFecha();
    this.ListarDistritos();
  }

  ngAfterViewInit () {
    this.ProcesosJudicialesForm.get('distrito').valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.ListarDistritos();
      })
    ).subscribe();

    merge(
      this.ProcesosJudicialesForm.get('distrito').valueChanges ,
      this.ProcesosJudicialesForm.get('instancia').valueChanges ,
      this.ProcesosJudicialesForm.get('expediente').valueChanges ,
      this.ProcesosJudicialesForm.get('dni').valueChanges ,
      this.ProcesosJudicialesForm.get('cliente').valueChanges ,
      this.ProcesosJudicialesForm.get('estado').valueChanges ,
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.CargarData();
       })
    ).subscribe();
  }

  CrearFormulario() {
    this.ProcesosJudicialesForm = this._builder.group({
      distrito : '' ,
      instancia : '' ,
      expediente : '' ,
      dni : '' ,
      cliente : '' ,
      fecha_inicio : new Date(2010,0,1,0,0,0,0) ,
      fecha_fin : new Date() ,
      estado : -1
    })
  }

  EncontrarFecha(){
    this._judicial.ObtenerFechaAntigua().subscribe(res=>{
      this.ProcesosJudicialesForm.get('fecha_inicio').setValue(res) ;
    })
  }

  CargarData() {
    this.CalcularTotal() ;

    this.CargarInformacion(
      this.ProcesosJudicialesForm.get('distrito').value ,
      this.ProcesosJudicialesForm.get('instancia').value ,
      this.ProcesosJudicialesForm.get('expediente').value ,
      this.ProcesosJudicialesForm.get('dni').value ,
      this.ProcesosJudicialesForm.get('cliente').value ,
      this.ProcesosJudicialesForm.get('fecha_inicio').value ,
      this.ProcesosJudicialesForm.get('fecha_fin').value ,
      this.ProcesosJudicialesForm.get('estado').value ,
      "fecha_inicio desc" ,
    );
  }

  // CambiarSede( proceso ){
  //   let Dialogo = this.Dialogo.open(VentanaCambioDistritoComponent,{
  //     data: proceso ,
  //     width: '1200px'
  //   }) ;

  //   Dialogo.afterClosed().subscribe(res=>{
  //     if(res){
  //       this.Notificaciones.Snack("Se creó el traslado satisfactoriamente.","")
  //       this.CargarData();
  //     }
  //     if(res===false) {
  //       this.Notificaciones.Snack("Ocurrió un error al crear el traslado.","")
  //     }
  //   })
  // }

  CalcularTotal() {
    this._judicial.ContarProcesosJudiciales(
      this.ProcesosJudicialesForm.get('fecha_inicio').value ,
      this.ProcesosJudicialesForm.get('fecha_fin').value ,
      this.ProcesosJudicialesForm.get('estado').value ,
    ).subscribe( total =>{
      this.total_procesos = total ;
    } )
  }

  ListarDistritos(){
    this._vinculados.ListarDistritosJudicialesActivos(
      this.ProcesosJudicialesForm.get('distrito').value
    ).subscribe(res=>{
      this.Distritos = res ;
    })
  }

  EjecutarCobranza(proceso){
    this.router.navigate(['generar','nuevo', proceso.id], { relativeTo: this.route } )
  }

  ListarTipoDocumentos(){
    this._vinculados.ListarDocumentosJudiciales("",1,20).subscribe(res=>{
      this.TipoDocumentos = res['data'].documentos ;
    })
  }

  CargarDistritos(
    distrito:string,
    juzgado:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
  ) {
    this.Cargando.next(true) ;
    
    this._judicial.ListarDistritos( distrito , juzgado , expediente , dni , nombre , fecha_inicio , fecha_fin , estado )
    .pipe(
      catchError(() => of([])),
      finalize(() => {
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res => {
      this.InformacionDistritosArray = res['data'].distritos;
      // console.log(this.InformacionDistritosArray.length)
    })
  }

  CargarInformacion(
    distrito : string ,
    instancia : string ,
    expediente : string ,
    dni : string ,
    nombre : string ,
    fecha_inicio : Date ,
    fecha_fin : Date ,
    estado : number ,
    orden : string ,
  ) {
    this.Cargando.next(true) ;
    this.Subject$.next() ;    

    forkJoin([
      this._judicial.ListarDistritosV4( distrito , instancia , expediente , dni , nombre , fecha_inicio , fecha_fin , estado ) ,
      this._judicial.ListarInstanciasV4( distrito , instancia , expediente , dni , nombre , fecha_inicio , fecha_fin , estado ) ,
      this._judicial.ListarV4( distrito , instancia , expediente , dni , nombre , fecha_inicio , fecha_fin , estado , orden ) ,
    ])
    .pipe(
      catchError(() => of([])),
      finalize(() => {
        this.Cargando.next(false) ;
      }),
      takeUntil(this.Subject$)
    )
    .subscribe(resultados => {
      this.InformacionDistritosArray = resultados[0] ;
      this.GuardarInformacionDexie(resultados[1], resultados[2]) ;
      // this.InformacionInstanciasArray = resultados[1] ;
      // this.InformacionProcesosArray = resultados[2] ;
    })
  }

  GuardarInformacionDexie(
    instancias : Array<any> ,
    procesos : Array<any> ,
  ) {
    this.db.GuardarInstanciasOffline(instancias) ;
    this.db.GuardarProcesosOffline(procesos) ;
  }

  ExportToExcel(){
    this.Cargando.next(true) ;

    const nombre_archivo : string = "reporte_procesos_" + new Date().getTime();

    this._judicial.ListarV4Unlimited(
      nombre_archivo ,
      this.ProcesosJudicialesForm.get('distrito').value ,
      this.ProcesosJudicialesForm.get('instancia').value ,
      this.ProcesosJudicialesForm.get('expediente').value ,
      this.ProcesosJudicialesForm.get('dni').value ,
      this.ProcesosJudicialesForm.get('cliente').value ,
      this.ProcesosJudicialesForm.get('fecha_inicio').value ,
      this.ProcesosJudicialesForm.get('fecha_fin').value ,
      this.ProcesosJudicialesForm.get('estado').value ,
      "fecha_inicio desc" ,
    )
    .pipe(
      finalize(() => {
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      if(res){
        this.AbrirArchivo(nombre_archivo,res);
      }
    })
  }

  AbrirArchivo(nombre_archivo,path){
    this.AServicio.ObtenerArchivo(path).subscribe(res=>{
      saveAs(res, nombre_archivo+'.xlsx');
    })
  }

}