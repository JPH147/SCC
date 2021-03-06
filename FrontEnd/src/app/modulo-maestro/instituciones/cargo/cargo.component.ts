import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { InstitucionesService } from '../instituciones.service';
import { VentanaConfirmarComponent } from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaCargoComponent } from './ventana-cargo/ventana-cargo.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {

  @ViewChild('InputInstitucion', { static: true }) FiltroInstitucion: ElementRef;
  @ViewChild('InputSede', { static: true }) FiltroSede: ElementRef;
  @ViewChild('InputCargo', { static: true }) FiltroCargo: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoCargos: CargoDataSource;
  public Columnas: string[] = ["numero" , "institucion" , "sede" , "cargo" , "opciones"];

  constructor(
    private Servicio: InstitucionesService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones
  ) { }

  ngOnInit() {
    this.ListadoCargos = new CargoDataSource(this.Servicio);
    this.ListadoCargos.CargarInformacion("","","",1,10);
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
      fromEvent(this.FiltroCargo.nativeElement, 'keyup'),
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
    this.ListadoCargos.CargarInformacion(
      this.FiltroInstitucion.nativeElement.value,
      this.FiltroSede.nativeElement.value,
      this.FiltroCargo.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(cargo){
    let Ventana = this.Dialogo.open( VentanaCargoComponent, {
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
    let Ventana = this.Dialogo.open( VentanaCargoComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó la sede satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear la sede","")
        }
      }
    })
  }
 
  Eliminar(cargo) {
    console.log(cargo);
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el cargo', valor: cargo.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarCargo(cargo.id_cargo).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

}

export class CargoDataSource implements DataSource<any> {

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
    cargo : string,
    pagina : number,
    totalpagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCargos( institucion , sede , cargo , pagina , totalpagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].cargos);
    });
  }

}