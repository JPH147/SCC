import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ServiciosGenerales } from '../global/servicios';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { Notificaciones } from '../global/notificacion';
import { VentanaCourierComponent } from './ventana-courier/ventana-courier.component';

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.css'],
  providers : [ServiciosGenerales]
})
export class CourierComponent implements OnInit {
  public fecha_inicio: Date;
  public fecha_fin: Date;

  public ListadoCourier: CourierDataSource;
  public Columnas: string[] = ['numero', 'nombre', 'url', 'opciones'];

  @ViewChild('InputCourier', { static: true }) FiltroCourier: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Dialogo : MatDialog ,
    private Notificacion : Notificaciones ,
    private Servicio : ServiciosGenerales
  ) { }

  ngOnInit() {

    this.fecha_inicio= new Date((new Date()).valueOf() - 1000*60*60*24*120)
    this.fecha_fin=new Date()

    this.ListadoCourier = new CourierDataSource(this.Servicio);
    this.ListadoCourier.CargarCourier("",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => {
        this.CargarData()
      })
    ).subscribe();

    merge(
      fromEvent(this.FiltroCourier.nativeElement, 'keyup')
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
    this.ListadoCourier.CargarCourier(
      this.FiltroCourier.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
    );
  }

  Agregar(){
    let Ventana = this.Dialogo.open(VentanaCourierComponent, {
      width: '900px'
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.CargarData();
        this.Notificacion.Snack("Se creó el courier satisfactoriamente","");
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al crear el courier","");
      }
    })
  }

  EditarCourier(id){
    let Ventana = this.Dialogo.open(VentanaCourierComponent, {
      width: '900px',
      data : id
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.CargarData();
        this.Notificacion.Snack("Se actualizó el courier satisfactoriamente","");
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al actualizar el courier","");
      }
    }) 
  }

  EliminarCourier(seguimiento){
    let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el seguimiento', valor: seguimiento.numero_seguimiento}
    });
    
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarCourier(seguimiento.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

}

export class CourierDataSource implements DataSource<any> {

  private InformacionCourier = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: ServiciosGenerales
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCourier.asObservable();
  }

  disconnect() {
    this.InformacionCourier.complete();
    this.CargandoInformacion.complete();
  }

  CargarCourier(
    nombre : string ,
    pagina_inicio : number ,
    pagina_final : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCourier( nombre , pagina_inicio , pagina_final )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionCourier.next(res['data'].courier);
    });
  }

}
