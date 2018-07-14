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
  panelOpenState = false;
  public articulos: Array<articulo>;
  public contador: number;
  public condicion: boolean = true;


  @ViewChild('input') input: ElementRef;

  constructor(private Servicio: ProductoService) {}

  ngOnInit() {
    this.contador = 1;
    this.articulos = [
      {numero: this.contador, nombre: '', cantidad: null, precio: null, condicion: this.condicion}
    ];

  }




agregar() {
  this.contador++;
  this.condicion  = !this.condicion;
  this.articulos.push({numero: this.contador, nombre: '', cantidad: null, precio: null, condicion: this.condicion});
}

Aceptar() {
  console.log(this.articulos);
}

}

export interface articulo {
numero: number;
nombre: string;
cantidad: number;
precio: number;
condicion: boolean;
}
