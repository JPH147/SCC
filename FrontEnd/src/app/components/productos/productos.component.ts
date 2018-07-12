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
  providers:[ProductoService]
})

export class ProductosComponent implements OnInit {

  ListadoProductos: ProductoDataSource;
  Columnas: string[] = ['numero', 'tipo', 'marca', 'modelo','descripcion','unidad_medida'];

  @ViewChild('input') input:ElementRef;

  constructor(private Servicio: ProductoService) {}

  ngOnInit() {
   this.ListadoProductos=new ProductoDataSource(this.Servicio);
   this.ListadoProductos.CargarProductos("","","","")
 }

 ngAfterViewInit(){
   fromEvent(this.input.nativeElement,'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(()=>{
       this.CargarData();
       console.log(this.input.nativeElement.value)
     })
    ).subscribe();
 }

 CargarData(){
   this.ListadoProductos.CargarProductos("","","",this.input.nativeElement.value)
 }

}

// Jean Paul es gay