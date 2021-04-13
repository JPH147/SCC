import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { VentanaConfirmarComponent } from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { EstadoSesion } from 'src/app/compartido/reducers/permisos.reducer';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { CobranzaJudicialService } from '../cobranza-judicial.service';
import { VentanaNotificacionesDetalleComponent } from '../ventana-notificaciones-detalle/ventana-notificaciones-detalle.component';
import { VentanaNotificacionesComponent } from '../ventana-notificaciones/ventana-notificaciones.component';

@Component({
  selector: 'app-ventana-notificaciones-listado',
  templateUrl: './ventana-notificaciones-listado.component.html',
  styleUrls: ['./ventana-notificaciones-listado.component.css']
})
export class VentanaNotificacionesListadoComponent implements OnInit {

  public ListadoNotificaciones : NotificacionesDataSource ;
  public Columnas : Array<string> = [] ;
  public permiso : Rol ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : number ,
    private _judiciales : CobranzaJudicialService ,
    private Dialogo : MatDialog ,
    private _store : Store<EstadoSesion> ,
    private _notificacion : Notificaciones ,
  ) { }

  ngOnInit(): void {
    this.ListadoNotificaciones = new NotificacionesDataSource(this._judiciales) ;
    this.Columnas = ["numero", "codigo", "destinatario", "anexos", "juzgado_fecha_envio", "opciones"] ;
    this.CargarInformacion() ;

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })
  }
  
  private CargarInformacion() {
    this.ListadoNotificaciones.CargarInformacion(this.data)
  }

  Ver(notificacion) {
    this.Dialogo.open(VentanaNotificacionesDetalleComponent, {
      data : notificacion ,
      width : '900px' ,
      maxHeight : '80vh'
    })
  }

  public AgregarNotificacion() {
    let informacion = {
      tipo : 'crear' ,
      documento_proceso : this.data
    }

    let Ventana = this.Dialogo.open(VentanaNotificacionesComponent ,{
      data : informacion ,
      width : '600px' ,
      maxHeight : '80vh' ,
    })

    Ventana.afterClosed().subscribe(resultado => {
      if(resultado){
        if ( resultado === true ) {
          this._notificacion.Snack("Se creó la notificación satisfactoriamente","");
          this.CargarInformacion();
        }
        if ( resultado===false ) {
          this._notificacion.Snack("Ocurrió un error al crear la notificación","")
        }
      }
    })
  }


  Editar(notificacion) {
    let informacion = {
      tipo : 'editar' ,
      documento_proceso : this.data ,
      notificacion : notificacion
    }

    let Ventana = this.Dialogo.open(VentanaNotificacionesComponent ,{
      data : informacion ,
      width : '600px' ,
      maxHeight : '80vh' ,
    })

    Ventana.afterClosed().subscribe(resultado => {
      if(resultado){
        if ( resultado === true ) {
          this._notificacion.Snack("Se actualizó la notificación satisfactoriamente","");
          this.CargarInformacion();
        }
        if ( resultado===false ) {
          this._notificacion.Snack("Ocurrió un error al actualizar la notificación","")
        }
      }
    })
  }

  EliminarNotificacion(notificacion) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la notificacion', valor: notificacion.codigo}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this._judiciales.EliminarNotificaciones(notificacion.id_proceso_judicial_notificacion).subscribe(res => {
          this.CargarInformacion();
        });
      }
    });
  }
}


export class NotificacionesDataSource implements DataSource<any> {

  private ListadoNotificaciones = new BehaviorSubject<any>([]);
  private TotalNotificaciones = new BehaviorSubject<any>([]);
  public TotalNotificaciones$ = this.TotalNotificaciones.asObservable() ;

  private Cargando = new BehaviorSubject<boolean>(false) ;
  public Cargando$ = this.Cargando.asObservable() ;
  private terminado$ = new Subject() ;

  constructor(
    private _judiciales : CobranzaJudicialService ,
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.ListadoNotificaciones.asObservable();
  }

  disconnect(){
    this.ListadoNotificaciones.complete();
    this.terminado$.next() ;
  }

  CargarInformacion( 
    id_proceso : number 
   ){
    this.Cargando.next(true) ;
    this.terminado$.next() ;

    this._judiciales.ListarProcesosJudicialesNotificacionesxProceo(
      id_proceso ,
    )
    .pipe(
      finalize(() => {
        this.Cargando.next(false) ;
      })
    )
    .subscribe(resultado=>{
      if ( resultado ) {
        this.ListadoNotificaciones.next(resultado['data'].notificaciones) ;
        this.TotalNotificaciones.next(resultado['mensaje']) ;
      } else {
        this.ListadoNotificaciones.next([]) ;
        this.TotalNotificaciones.next(0) ;
      }
    })
  }
}
