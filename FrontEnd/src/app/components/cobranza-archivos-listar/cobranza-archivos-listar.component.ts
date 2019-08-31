import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-cobranza-archivos-listar',
  templateUrl: './cobranza-archivos-listar.component.html',
  styleUrls: ['./cobranza-archivos-listar.component.scss']
})
export class CobranzaArchivosListarComponent implements OnInit {
  
  public ListadoCobranzas: CobranzasDataSource;
  public Columnas: string[] = ['numero', 'fecha_creacion','institucion', 'tipo_pago', 'fecha_inicio', 'cantidad', 'monto', 'opciones'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private Servicio : CobranzasService
  ) { }

  ngOnInit() {

    this.ListadoCobranzas = new CobranzasDataSource(this.Servicio);
    this.ListadoCobranzas.CargarCronograma(1,10);

  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

  }

  CargarData(){
    this.ListadoCobranzas.CargarCronograma(this.paginator.pageIndex+1, this.paginator.pageSize);
  }

  AbrirArchivo(nombre_archivo){
    this.Servicio.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      saveAs(res, nombre_archivo);
    })
  }
  
}

export class CobranzasDataSource implements DataSource<any> {

  private InformacionCobranzas = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: CobranzasService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionCobranzas.asObservable();
  }

  disconnect() {
  this.InformacionCobranzas.complete();
  this.CargandoInformacion.complete();
  }

  CargarCronograma(
    numero_pagina : number,
    total_pagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCobranzas( numero_pagina, total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionCobranzas.next(res['data'].cobranzas);
    });
  }

}