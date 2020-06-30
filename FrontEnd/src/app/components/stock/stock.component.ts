import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {merge, Observable, of as observableOf, from, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay, catchError, map, startWith, switchMap} from 'rxjs/operators';
import { VentanaEmergenteStock } from './ventana-emergentestock/ventanaemergentestock';
import { StockService } from './stock.service';
import {StockDataSource} from './stock.dataservice';
import { FormControl } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../usuarios/usuarios.reducer';
import { Rol } from '../usuarios/usuarios.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers: [StockService]
})
export class StockComponent implements OnInit {
  Listadodata: StockDataSource;
  displayedColumns: string[] = ['numero',  'almacen', 'tipo', 'marca', 'modelo', 'descripcion', 'unidad_medida', 'cantidad', 'opciones'];

  public TotalResultados = 0;

  @ViewChild('InputAlmacen', { static: true }) FiltroAlmacen: ElementRef;
  @ViewChild('InputTipo', { static: true }) FiltroTipo: ElementRef;
  @ViewChild('InputMarca', { static: true }) FiltroMarca: ElementRef;
  @ViewChild('InputModelo', { static: true }) FiltroModelo: ElementRef;
  @ViewChild('InputDescripcion', { static: true }) FiltroDescripcion: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Servicio: StockService,
    public DialogoStock: MatDialog,
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.Listadodata = new StockDataSource(this.Servicio);
    this.Listadodata.CargarStock('', '', '', '', '', 1, 10, 'descripcion asc');
    this.Listadodata.Totalresultados.subscribe(res => {
    this.TotalResultados = res;
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit () {

    merge(
      this.paginator.page
    )
    .pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroAlmacen.nativeElement, 'keyup'),
      fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
      fromEvent(this.FiltroMarca.nativeElement, 'keyup'),
      fromEvent(this.FiltroModelo.nativeElement, 'keyup'),
      fromEvent(this.FiltroDescripcion.nativeElement, 'keyup'),
      this.sort.sortChange
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

DetalleStock(almacen,producto) {
  const VentanaDetalleStock = this.DialogoStock.open(VentanaEmergenteStock, {
    width: '800px',
    data: {almacen:almacen,producto:producto}
  });

  VentanaDetalleStock.afterClosed().subscribe(res => {
      this.CargarData();
    });
  }

}

/** An example database that the data source uses to retrieve data for the table. */
