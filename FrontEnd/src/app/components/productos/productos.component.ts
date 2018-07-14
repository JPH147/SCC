import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ProductoService} from './productos.service';
import {ProductoDataSource} from './productos.dataservice';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductoService]
})

export class ProductosComponent implements OnInit {

  ListadoProductos: ProductoDataSource;
  Columnas: string[] = ['numero', 'descripcion', 'tipo', 'marca', 'modelo', 'unidad_medida', 'opciones'];

  @ViewChild('InputProducto') FiltroProductos: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: ElementRef;
  @ViewChild('InputMarca') FiltroMarca: ElementRef;
  @ViewChild('InputModelo') FiltroModelo: ElementRef;

  constructor(private Servicio: ProductoService) {}

  ngOnInit() {
   this.ListadoProductos = new ProductoDataSource(this.Servicio);
   this.ListadoProductos.CargarProductos('', '', '', '');
 }

 ngAfterViewInit() {
   fromEvent(this.FiltroProductos.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

   fromEvent(this.FiltroTipo.nativeElement,'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

    fromEvent(this.FiltroMarca.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

   fromEvent(this.FiltroModelo.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(()=> {
       this.CargarData();
     })
    ).subscribe();
 }

 CargarData(){
   this.ListadoProductos.CargarProductos(this.FiltroTipo.nativeElement.value,this.FiltroMarca.nativeElement.value,this.FiltroModelo.nativeElement.value,this.FiltroProductos.nativeElement.value)
 }

}
