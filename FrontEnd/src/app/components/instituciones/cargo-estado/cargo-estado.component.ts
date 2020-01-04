import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { InstitucionesService } from '../instituciones.service';
import { VentanaCargoEstadoComponent } from './ventana-cargo-estado/ventana-cargo-estado.component';
import { Notificaciones } from '../../global/notificacion';


@Component({
  selector: 'app-cargo-estado',
  templateUrl: './cargo-estado.component.html',
  styleUrls: ['./cargo-estado.component.css']
})
export class CargoEstadoComponent implements OnInit {

  @ViewChild('InputInstitucion', { static: true }) FiltroInstitucion: ElementRef;
  @ViewChild('InputSede', { static: true }) FiltroSede: ElementRef;
  @ViewChild('InputCargoEstado', { static: true }) FiltroCargoEstado: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoCargoEstados: CargoEstadoDataSource;
  public Columnas: string[] = ["numero" , "institucion" , "sede" , "cargo_estado" , "opciones"];

  constructor(
    private Servicio: InstitucionesService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones
  ) { }

  ngOnInit() {
    this.ListadoCargoEstados = new CargoEstadoDataSource(this.Servicio);
    this.ListadoCargoEstados.CargarInformacion("","","",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroInstitucion.nativeElement, 'keyup'),
      fromEvent(this.FiltroSede.nativeElement, 'keyup'),
      fromEvent(this.FiltroCargoEstado.nativeElement, 'keyup'),
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.paginator.pageIndex = 0;
         this.CargarData();
       })
    ).subscribe();
  }

  CargarData() {
    this.ListadoCargoEstados.CargarInformacion(
      this.FiltroInstitucion.nativeElement.value,
      this.FiltroSede.nativeElement.value,
      this.FiltroCargoEstado.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(cargo){
    let Ventana = this.Dialogo.open( VentanaCargoEstadoComponent, {
      width: '900px',
      data: cargo
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizó el cargo satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar el cargo","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaCargoEstadoComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó el cargo satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear el cargo","")
        }
      }
    })
  }
 
}

export class CargoEstadoDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: InstitucionesService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    institucion : string,
    sede : string,
    cargo_estado : string,
    pagina : number,
    totalpagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCargoEstados( institucion , sede , cargo_estado , pagina , totalpagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].cargo_estados);
    });
  }

}