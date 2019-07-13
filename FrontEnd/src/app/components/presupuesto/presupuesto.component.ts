import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, forkJoin,fromEvent, merge, BehaviorSubject, of} from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSelect, MatPaginator, MatSort } from '@angular/material'
import { CreditosService } from '../creditos/creditos.service';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css'],
  providers : [ CreditosService ]
})

export class PresupuestoComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;

  public ListadoPresupuesto: PresupuestoDataSource;
  public Columnas: string[] = ['numero', 'cliente', 'tipo', 'fecha', 'capital', 'opciones'];

  @ViewChild('InputCliente') FiltroCliente: ElementRef;
  @ViewChild('InputEstado') FiltroEstado: MatSelect;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private Servicio: CreditosService
  ) { }

  ngOnInit() {

    this.fecha_inicio= new Date((new Date()).valueOf() - 1000*60*60*24*120)
    this.fecha_fin=new Date()

    this.ListadoPresupuesto = new PresupuestoDataSource(this.Servicio);
    this.ListadoPresupuesto.CargarPresupuestos("",this.fecha_inicio,this.fecha_fin,3,1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page,
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    fromEvent(
      this.FiltroCliente.nativeElement, 'keyup',
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
    this.ListadoPresupuesto.CargarPresupuestos(
      this.FiltroCliente.nativeElement.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }
}

export class PresupuestoDataSource implements DataSource<any>{

  private InformacionCreditos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: CreditosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCreditos.asObservable();
  }

  disconnect() {
    this.InformacionCreditos.complete();
    this.CargandoInformacion.complete();
  }

  CargarPresupuestos(
    cliente:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarPresupuesto( cliente, fecha_inicio, fecha_fin, estado, pagina_inicio, pagina_final )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionCreditos.next(res['data'].presupuestos);
    });
  }

}