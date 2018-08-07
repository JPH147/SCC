import { ventanaseries } from './ventana-series/ventanaseries';
import { DialogData } from '../salida-vendedores/salida-vendedores.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styleUrls: ['./ingreso-productos.component.css'],
})

  export class IngresoProductosComponent implements OnInit {
    public IngProdCabeceraForm: FormGroup;
    public articulos: Array <articulo>;
    public contador: number;
    public almacenes: Array<any>;
    public seriventana: string;
    public almacen: string;
    public tipoingreso: string;      // Tipo de Ingreso Almacen
    public docreferencia: string; // documento referencia de ingreso almncen
    public proveedor: string;
    public fecingreso: Date;      // fecha de ingreso a almcen


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

    constructor(public DialogoSerie: MatDialog,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    ) {}

    ngOnInit() {
      this.IngProdCabeceraForm = this.FormBuilder.group({
          'almacen': [null, [Validators.required] ],
          'tipoingreso': [null, [Validators.required]],


      });

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


AgregarSerie() {
  const serieventana = this.DialogoSerie.open(ventanaseries, {
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

