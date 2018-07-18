import { ventanaseriesalida } from './ventana-seriesalida/ventanaseriesalida';
import { DialogData } from './../salida-vendedores/salida-vendedores.component';
import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import { MatDialog } from '@angular/material';

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-salida-productos',
  templateUrl: './salida-productos.component.html',
  styleUrls: ['./salida-productos.component.css']
})

export class SalidaProductosComponent implements OnInit {
  public articulos: Array <articulo>;
  public contador: number;
  public almacenes: Array<any>;
  public serieventana: string;


  selected = 'option2';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  selection = new SelectionModel<PeriodicElement>(true, []);
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Almacen Principal'},
    {value: 'pizza-1', viewValue: 'Almacen Dos'},
    {value: 'tacos-2', viewValue: 'Almacen Tres'}
  ];

  constructor (public DialogoSerie: MatDialog) {
  }

  ngOnInit() {

    this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

      this.contador = 1;
      this.articulos = [
        {numero: this.contador, nombre: '', cantidad: null, precio: null}
      ];
  }
     private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();

      return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  isAllSelected() {
  }

/** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
  }

  agregar() {
    this.contador++;
    this.articulos.push({numero: this.contador, nombre: '', cantidad: null, precio: null});
  }

  Aceptar() {
    console.log(this.articulos);
  }


  AgregarSerieS() {
    const serieventana = this.DialogoSerie.open(ventanaseriesalida, {
      width: '600px'
    });
  }
}


  export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;

  }
  // tslint:disable-next-line:class-name
  export interface articulo {
    numero: number;
    nombre: string;
    cantidad: number;
    precio: number;
  }

