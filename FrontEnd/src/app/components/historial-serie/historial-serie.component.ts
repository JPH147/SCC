import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HistorialSerieService } from './historial-serie.service';
import { HistorialSerieDataService } from './historial-serie.data.service';
import { MatPaginator, MatSort, MatDialog, MatSelect, MatSnackBar } from '@angular/material';
import { merge, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-historial-serie',
  templateUrl: './historial-serie.component.html',
  styleUrls: ['./historial-serie.component.css'],
  providers:[ HistorialSerieService]
})
export class HistorialSerieComponent implements OnInit {
  [x: string]: any;

  ListadoProductos: HistorialSerieDataService;
  Columnas: string[] = ['numero','serie', 'movimiento', 'producto', 'transaccion','tenedor', 'documento','fecha'];

  @ViewChild('InputserieProducto') FiltroProductos: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private Servicio: HistorialSerieService,
    public DialogoProductos: MatDialog,
    public snackBar: MatSnackBar,
    public DialogFileUpload: MatDialog,

  ) { }

  ngOnInit() {
    this.ListadoProductos = new HistorialSerieDataService(this.Servicio);
    // tslint:disable-next-line:quotemark
    this.ListadoProductos.CargarProductos('', 1, 10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    )
    .pipe(
      tap(() => this.CargarData())
    ).subscribe();
  
    merge(
     fromEvent(this.FiltroProductos.nativeElement, 'keyup')
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
    this.ListadoProductos.CargarProductos(this.FiltroProductos.nativeElement.value,
    this.paginator.pageIndex + 1,
    this.paginator.pageSize);
  }
}