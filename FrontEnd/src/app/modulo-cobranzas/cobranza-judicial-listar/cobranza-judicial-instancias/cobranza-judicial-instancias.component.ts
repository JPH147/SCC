import { EventEmitter, Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { VentanaConfirmarComponent } from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { EstadoSesion } from 'src/app/compartido/reducers/permisos.reducer';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { CobranzaJudicialService } from '../../cobranza-judicial/cobranza-judicial.service';
import { VentanaCambioDistritoComponent } from '../ventana-cambio-distrito/ventana-cambio-distrito.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cobranza-judicial-instancias',
  templateUrl: './cobranza-judicial-instancias.component.html',
  styleUrls: ['./cobranza-judicial-instancias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush ,
})
export class CobranzaJudicialInstanciasComponent implements OnInit, OnChanges {

  @Input() instancia : any ;
  @Input() filtros : any ;
  @Output() total_expedientes = new EventEmitter<number>() ;

  public ListadoProcesos : ProcesosDataSource ;
  public Columnas: string[] = ['id_tipo_documento', 'fecha_inicio', 'cliente_nombre', 'expediente', 'vendedor', 'total_documentos','fecha_ultimo_documento','fecha_ultimo_documento_diferencia', 'opciones'];

  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Dialogo : MatDialog ,
    private router : Router ,
    private route : ActivatedRoute ,
    private _judicial: CobranzaJudicialService,
    private Notificaciones : Notificaciones ,
  ) { }

  ngOnInit(): void {
    this.ListadoProcesos = new ProcesosDataSource(this._judicial) ;

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.ListadoProcesos.TotalExpedientes$.subscribe(resultado => {
      this.total_expedientes.emit(resultado) ;
    })

    this.CargarData() ;
  }

  ngOnChanges(changes : SimpleChanges) {
    let cambio = changes['filtros'] ;

    if ( cambio.currentValue && this.ListadoProcesos) {
      this.CargarData() ;
    }
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
    this.ListadoProcesos.CargarInformacion(
      this.instancia.id_instancia ,
      this.filtros.expediente ,
      this.filtros.dni ,
      this.filtros.cliente ,
      this.filtros.fecha_inicio ,
      this.filtros.fecha_fin ,
      this.filtros.estado ,
      "fecha_inicio desc"
    );
  }
}

export class ProcesosDataSource implements DataSource<any> {

  private ListadoExpedientes = new BehaviorSubject<any>([]);
  private TotalExpedientes = new BehaviorSubject<any>([]);
  public TotalExpedientes$ = this.TotalExpedientes.asObservable() ;

  private Cargando = new BehaviorSubject<boolean>(false) ;
  public Cargando$ = this.Cargando.asObservable() ;

  constructor(
    private _judicial : CobranzaJudicialService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.ListadoExpedientes.asObservable();
  }

  disconnect(){
    this.ListadoExpedientes.complete();
  }

  CargarInformacion( 
    id_instancia : number ,
    expediente : string ,
    dni : string ,
    nombre : string ,
    fecha_inicio : Date ,
    fecha_fin : Date ,
    estado : number ,
    orden : string ,
   ){
    this.Cargando.next(true) ;

    this._judicial.ListarV2(
      id_instancia ,
      expediente ,
      dni ,
      nombre ,
      fecha_inicio ,
      fecha_fin ,
      estado ,
      orden
    )
    .pipe(
      finalize(()=> {
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      this.ListadoExpedientes.next(res['data'].procesos) ;
      this.TotalExpedientes.next(res['data'].procesos.length) ;
    })
  }

  
}
