import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {HistorialMovimientosService} from './historial-movimientos.service'
import {HistorialMovimientosDataService} from './historial-movimientos.dataservice'
import {MatPaginator, MatSort} from '@angular/material'
import {merge, Observable, of as observableOf, from, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay, catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.component.html',
  styleUrls: ['./historial-movimientos.component.css'],
  providers: [HistorialMovimientosService]
})
export class HistorialMovimientosComponent implements OnInit {

	@ViewChild('InputAlmacen') FiltroAlmacen: ElementRef;
	@ViewChild('InputTipo') FiltroTipo: ElementRef;
	@ViewChild('InputReferente') FiltroReferente: ElementRef;
	@ViewChild('InputDocumento') FiltroDocumento: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

	public fecha_inicio:Date;
	public fecha_fin:Date;

  ListadoMovimientos: HistorialMovimientosDataService;
  Columnas: string[] = ['numero','almacen', 'tipo', 'referencia', 'referente', 'fecha', 'opciones'];

  constructor(
  	private Servicio: HistorialMovimientosService
  ) { }

  ngOnInit() {

  	this.fecha_inicio= new Date((new Date()).valueOf() - 1000*60*60*24*120);
  	this.fecha_fin= new Date();

  	this.ListadoMovimientos = new HistorialMovimientosDataService(this.Servicio);
    this.ListadoMovimientos.CargarDatos("","","",this.fecha_inicio,this.fecha_fin,"",1,10,"fecha desc");
  }

  ngAfterViewInit(){
  	merge(
      this.paginator.page
    )
    .pipe(
      tap(() =>
      	this.CargarInformacion()
      )
    ).subscribe();

    merge(
      fromEvent(this.FiltroAlmacen.nativeElement, 'keyup'),
      fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
      fromEvent(this.FiltroReferente.nativeElement, 'keyup'),
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup'),
      this.sort.sortChange
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.CargarInformacion();
      })
     ).subscribe();
  }

  CargarInformacion(){
  	this.ListadoMovimientos.CargarDatos(
			this.FiltroAlmacen.nativeElement.value,
			this.FiltroTipo.nativeElement.value,
			this.FiltroReferente.nativeElement.value,
			this.fecha_inicio,
			this.fecha_fin,
			this.FiltroDocumento.nativeElement.value,
			this.paginator.pageIndex+1,
			this.paginator.pageSize,
			this.sort.active + " " + this.sort.direction
		)
  }

}
