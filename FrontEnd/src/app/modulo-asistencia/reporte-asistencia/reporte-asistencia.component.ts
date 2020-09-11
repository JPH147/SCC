import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { TrabajadoresService } from '../trabajadores/trabajadores.service';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reporte-asistencia',
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css']
})

export class ReporteAsistenciaComponent implements OnInit, AfterViewInit {

  public fecha_inicio : Date;
  public fecha_fin : Date;
  public id_trabajador : number;
  public trabajador : string;

  @ViewChild('InputDocumento', { static: true }) FiltroDocumento : ElementRef;
  @ViewChild('InputTrabajador', { static: true }) FiltroTrabajador : ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator : MatPaginator;

  public ListadoTareo : TareoDataSource;
  public Columnas : Array <string> = [ "numero", "documento", "trabajador", "fecha", "ingreso", "tardanza_ingreso", "salida", "tardanza_salida", "horas_trabajadas" ];

  constructor(
    private Servicio : TrabajadoresService
  ) { }

  ngOnInit() {
    this.fecha_inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.fecha_fin = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    this.ListadoTareo = new TareoDataSource(this.Servicio);
    this.ListadoTareo.CargarInformacion("","",this.fecha_inicio, this.fecha_fin, 1, 10);

  }

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup'),
      fromEvent(this.FiltroTrabajador.nativeElement, 'keyup')
    )
    .pipe(
      distinctUntilChanged(),
      debounceTime(200),
      tap(()=>{
        this.CargarData();
        this.paginator.pageIndex=0;
      })
    ).subscribe();

    this.paginator.page
    .pipe(
      tap(()=>{
        this.CargarData()
      })
    ).subscribe()

  }

  CargarData(){
    this.ListadoTareo.CargarInformacion(
      this.FiltroDocumento.nativeElement.value,
      this.FiltroTrabajador.nativeElement.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

}

export class TareoDataSource implements DataSource<any> {

  private InformacionTareo = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: TrabajadoresService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionTareo.asObservable();
  }

  disconnect() {
  this.InformacionTareo.complete();
  this.CargandoInformacion.complete();
  }

  CargarInformacion(
    documento : string,
    nombre : string,
    fecha_inicio : Date,
    fecha_fin : Date,
    numero_pagina : number,
    total_pagina : number
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarTareo( documento, nombre, fecha_inicio, fecha_fin, numero_pagina, total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionTareo.next(res['data'].tareo);
    });
  }

}
