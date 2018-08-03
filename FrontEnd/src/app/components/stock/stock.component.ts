import { StockService } from './stock.service';
import {StockDataSource} from './stock.dataservice';
import { FormControl } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers:[StockService]
})
export class StockComponent implements OnInit {
  displayedColumns: string[] = ['numero',  'almacen', 'tipo', 'marca', 'modelo', 'descripcion', 'unidad_medida', 'cantidad'];
  data: StockDataSource;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild('InputAlmacen') FiltroAlmacen: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: ElementRef;
  @ViewChild('InputMarca') FiltroMarca: ElementRef;
  @ViewChild('InputModelo') FiltroModelo: ElementRef;
  @ViewChild('InputDescripcion') FiltroDescripcion: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private Servicio:StockService
  ) { }

  ngOnInit() {
    this.data = new StockDataSource(this.Servicio);
    this.data.CargarStock('', '', '', '', '', 1, 20, 'almacen asc')
  }



}
/** An example database that the data source uses to retrieve data for the table. */

