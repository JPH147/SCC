import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
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

@Component({
  selector: 'app-cobranza-judicial-listar',
  templateUrl: './cobranza-judicial-listar.component.html',
  styleUrls: ['./cobranza-judicial-listar.component.css'],
})

export class CobranzaJudicialListarComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public TipoDocumentos : Array<any> ;
  public Cuentas : Array<any> = [];
  public Distritos : Array<any> = [];

  public permiso : Rol ;
  public total_procesos : number = 0 ;

  public ProcesosJudicialesForm : FormGroup ;

  public InformacionDistritosArray : Array<any> ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private route : ActivatedRoute ,
    private router : Router ,
    private Dialogo : MatDialog ,
    private Notificaciones : Notificaciones ,
    private _judicial: CobranzaJudicialService,
    private _vinculados : ProcesoJudicialVinculadosService ,
    private _builder : FormBuilder ,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.ListarTipoDocumentos();
    this.EncontrarFecha();
    this.ListarDistritos();
    this.fecha_inicio = new Date() ;
    this.fecha_fin = new Date() ;
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
      this.ProcesosJudicialesForm.valueChanges
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
      expediente : '' ,
      dni : '' ,
      cliente : '' ,
      fecha_inicio : null ,
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

    this.CargarDistritos(
      this.ProcesosJudicialesForm.get('distrito').value ,
      "",
      this.ProcesosJudicialesForm.get('expediente').value ,
      this.ProcesosJudicialesForm.get('dni').value ,
      this.ProcesosJudicialesForm.get('cliente').value ,
      this.ProcesosJudicialesForm.get('fecha_inicio').value ,
      this.ProcesosJudicialesForm.get('fecha_fin').value ,
      this.ProcesosJudicialesForm.get('estado').value ,
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
      this.fecha_inicio,
      this.fecha_fin,
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
}