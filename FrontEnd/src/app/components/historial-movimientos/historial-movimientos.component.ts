import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {HistorialMovimientosService} from './historial-movimientos.service'
import {HistorialMovimientosDataService} from './historial-movimientos.dataservice'
import {MatPaginator, MatSort, MatSelect} from '@angular/material'
import {merge, Observable, of as observableOf, from, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay, catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ServiciosGenerales} from '../global/servicios';
import * as moment from 'moment';

@Component({
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.component.html',
  styleUrls: ['./historial-movimientos.component.css'],
  providers: [HistorialMovimientosService,ServiciosGenerales]
})
export class HistorialMovimientosComponent implements OnInit {

	@ViewChild('InputAlmacen') FiltroAlmacen: ElementRef;
	@ViewChild('InputTipo') FiltroTipo: MatSelect;
  @ViewChild('InputEstadoTransferencia') FiltroEstadoTransferencia: MatSelect;
	@ViewChild('InputReferente') FiltroReferente: ElementRef;
	@ViewChild('InputDocumento') FiltroDocumento: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public tipo_transaccion:Array<any>;
	public fecha_inicio:Date;
	public fecha_fin:Date;

  ListadoMovimientos: HistorialMovimientosDataService;
  Columnas: string[] = ['numero', 'movimiento','tipo','almacen', 'referencia', 'referente', 'documento', 'fecha', 'opciones'];

  constructor(
  	private Servicio: HistorialMovimientosService,
    private SGenerales: ServiciosGenerales
  ) { }

  ngOnInit() {

  	this.fecha_inicio= moment(new Date()).subtract(5,'year').toDate();
  	this.fecha_fin= new Date();

  	this.ListadoMovimientos = new HistorialMovimientosDataService(this.Servicio);
    this.ListadoMovimientos.CargarDatos("",0,0,"",this.fecha_inicio,this.fecha_fin,"",1,10,"fecha desc");

    this.SGenerales.ListarTransaccionTipo("").subscribe(res=>{
      this.tipo_transaccion=res
    })

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
      fromEvent(this.FiltroReferente.nativeElement, 'keyup'),
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup'),
      this.sort.sortChange,
      this.FiltroTipo.valueChange,
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

  CargarInformacionEspecial(){
    this.paginator.pageIndex = 0;
    this.CargarInformacion();
  }

  CargarInformacion(){
    let estado_transaccion:number;

    if (this.FiltroEstadoTransferencia) {
      estado_transaccion=this.FiltroEstadoTransferencia.value
    }else{
      estado_transaccion=0
    }

  	this.ListadoMovimientos.CargarDatos(
			this.FiltroAlmacen.nativeElement.value,
			this.FiltroTipo.value,
      estado_transaccion,
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
