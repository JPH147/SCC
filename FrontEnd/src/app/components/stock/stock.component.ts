import { StockService } from './stock.service';
import {StockDataSource} from './stock.dataservice';
import { FormControl } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {merge, Observable, of as observableOf, from, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay, catchError, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers: [StockService]
})
export class StockComponent implements OnInit {
  Listadodata: StockDataSource;
  displayedColumns: string[] = ['numero',  'almacen', 'tipo', 'marca', 'modelo', 'descripcion', 'unidad_medida', 'cantidad'];

  public TotalResultados = 0;

  @ViewChild('InputAlmacen') FiltroAlmacen: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: ElementRef;
  @ViewChild('InputMarca') FiltroMarca: ElementRef;
  @ViewChild('InputModelo') FiltroModelo: ElementRef;
  @ViewChild('InputDescripcion') FiltroDescripcion: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private Servicio: StockService
  ) { }

  ngOnInit() {
    this.Listadodata = new StockDataSource(this.Servicio);
    this.Listadodata.CargarStock('', '', '', '', '', 1, 20, 'descripcion asc');
    this.Listadodata.Totalresultados.subscribe(res => {
    this.TotalResultados = res;
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit () {
    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });
    merge(
      this.paginator.page,
      this.sort.sortChange
    )
    .pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroAlmacen.nativeElement, 'keyup'),
      fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
      fromEvent(this.FiltroMarca.nativeElement, 'keyup'),
      fromEvent(this.FiltroModelo.nativeElement, 'keyup'),
      fromEvent(this.FiltroDescripcion.nativeElement, 'keyup')
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
    this.Listadodata.CargarStock(this.FiltroAlmacen.nativeElement.value,
    this.FiltroTipo.nativeElement.value,
    this.FiltroMarca.nativeElement.value,
    this.FiltroModelo.nativeElement.value,
    this.FiltroDescripcion.nativeElement.value,
    this.paginator.pageIndex + 1,
    this.paginator.pageSize,
    this.sort.active + ' ' + this.sort.direction
    // 'descripcion asc'
  );
  }


}
/** An example database that the data source uses to retrieve data for the table. */
