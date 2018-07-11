import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ProductoService} from './productos.service';
import {ProductoDataSource} from './productos.dataservice';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers:[ProductoService]
})

export class ProductosComponent implements OnInit {

  ListadoProductos: ProductoDataSource;
  Columnas: string[] = ['numero', 'tipo', 'marca', 'modelo','descripcion','unidad_medida'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  constructor(private Servicio: ProductoService) {}

  ngOnInit() {
   this.Servicio.Listado(null).subscribe(res=>console.log(res));
   this.ListadoProductos=new ProductoDataSource(this.Servicio);
   this.ListadoProductos.CargarProductos(null)
 }
}