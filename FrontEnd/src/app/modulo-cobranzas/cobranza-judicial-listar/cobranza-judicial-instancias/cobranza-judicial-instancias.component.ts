import { EventEmitter, Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { VentanaConfirmarComponent } from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { EstadoSesion } from 'src/app/compartido/reducers/permisos.reducer';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { CobranzaJudicialService } from '../../cobranza-judicial/cobranza-judicial.service';
import { VentanaCambioDistritoComponent } from '../ventana-cambio-distrito/ventana-cambio-distrito.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { CobranzaJudicialComponent } from '../../cobranza-judicial/cobranza-judicial.component';
import { DbService } from 'src/app/core/servicios/db.service';
import { VentanaDevolverAnexosComponent } from '../../cobranza-judicial/ventana-devolver-anexos/ventana-devolver-anexos.component';

@Component({
  selector: 'app-cobranza-judicial-instancias',
  templateUrl: './cobranza-judicial-instancias.component.html',
  styleUrls: ['./cobranza-judicial-instancias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush ,
})
export class CobranzaJudicialInstanciasComponent implements OnInit {

  @Input() instancia : any ;
  @Input() ProcesosCompletos : Array<any> ;

  private Procesos : Array<any> ;
  public ListadoProcesos : ProcesosDataSource ;
  public Columnas: string[] = ['id_tipo_documento', 'fecha_inicio', 'cliente_nombre', 'expediente', 'vendedor', 'total_documentos','fecha_ultimo_documento','fecha_ultimo_documento_diferencia', 'opciones'];

  public permiso : Rol ;
  public total_expedientes : number ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Dialogo : MatDialog ,
    private router : Router ,
    private route : ActivatedRoute ,
    private _judicial: CobranzaJudicialService,
    private Notificaciones : Notificaciones ,
    private _db : DbService ,
  ) { }

  ngOnInit(): void {
    this.ListadoProcesos = new ProcesosDataSource(this._db) ;

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.CargarData() ;
  }

  VerProceso(id_proceso){
    this.Dialogo.open(CobranzaJudicialComponent, {
      data : id_proceso ,
      width : '95vw' ,
      maxHeight : '80vh' ,
    })
    .afterClosed().subscribe(resultado => {
      if ( resultado === true ) {
        this.router.navigate(['ver', id_proceso], { relativeTo: this.route } ) ;
      }
    })
    
  }

  AgregarDocumentos(proceso){
    this.router.navigate(['agregar', proceso.id], { relativeTo: this.route } )
  }

  EliminarProceso(proceso){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el proceso", valor: proceso.expediente }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this._judicial.EliminarProcesoCabecera(proceso.id).subscribe((res)=>{
          this.CargarData();
        });
      }
    })
  }

  CambiarSede( proceso ){
    let Dialogo = this.Dialogo.open(VentanaCambioDistritoComponent,{
      data: proceso ,
      width: '1200px'
    }) ;

    Dialogo.afterClosed().subscribe(res=>{
      if(res){
        this.Notificaciones.Snack("Se creó el traslado satisfactoriamente.","")
        this.CargarData();
      }
      if(res===false) {
        this.Notificaciones.Snack("Ocurrió un error al crear el traslado.","")
      }
    })
  }
  
  CargarData() {
    this.ListadoProcesos.CargarInformacion(this.instancia.id_instancia) ;
    // this._db.ListarProcesosxInstancia(this.instancia.id_instancia)
    // .then()
    // this.Procesos = this.ProcesosCompletos.filter(elemento => elemento.id_instancia = this.instancia.id_instancia) ;
    // this.total_expedientes = this.Procesos.length ;

    // this.ListadoProcesos.AsignarInformacion(this.Procesos) ;
  }

  DevolverAnexos(id_proceso) {
    this.Dialogo.open(VentanaDevolverAnexosComponent, {
      data : { tipo : "crear", id_proceso : id_proceso } ,
      width : '1200px' ,
      maxHeight : '80vh'
    })
  }
}

export class ProcesosDataSource implements DataSource<any> {

  private ListadoExpedientes = new BehaviorSubject<any>([]);
  private TotalExpedientes = new BehaviorSubject<any>([]);
  public TotalExpedientes$ = this.TotalExpedientes.asObservable() ;

  private Cargando = new BehaviorSubject<boolean>(false) ;
  public Cargando$ = this.Cargando.asObservable() ;
  private terminado$ = new Subject() ;

  constructor(
    private _db : DbService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.ListadoExpedientes.asObservable();
  }

  disconnect(){
    this.ListadoExpedientes.complete();
    this.terminado$.next() ;
  }

  CargarInformacion( 
    id_instancia : number 
   ){
    this.Cargando.next(true) ;
    this.terminado$.next() ;

    this._db.ListarProcesosxInstancia(
      id_instancia ,
    )
    .finally(() => {
      this.Cargando.next(false) ;
    })
    .then(res=>{
      this.ListadoExpedientes.next(res) ;
      this.CalcularTotales(id_instancia) ;
    })
  }
  
  CalcularTotales( 
    id_instancia : number 
   ){
    this.Cargando.next(true) ;
    this.terminado$.next() ;

    this._db.ContarProcesosxInstancia(
      id_instancia ,
    )
    .finally(() => {
      this.Cargando.next(false) ;
    })
    .then(res=>{
      this.TotalExpedientes.next(res) ;
    })
  }
}
