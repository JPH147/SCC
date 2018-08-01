import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales } from '../../global/servicios';
import { NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { SelectionModel } from '../../../../../node_modules/@angular/cdk/collections';


export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-ventanaemergentedet',
  templateUrl: './ventanaemergentedet.html',
  styleUrls: ['./ventanaemergentedet.css'],
  providers: [ServiciosGenerales]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteDet {
  [x: string]: any;
  public selectedValue: string;
  public GastosForm: FormGroup;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteDet>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }


  // tslint:disable-next-line:use-life-cycle-interface
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

//  private _filter(value: string): string[] {
//    const filterValue = value.toLowerCase();

  //  return this.options.filter(option => option.toLowerCase().includes(filterValue));
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


 AgregarSerieSalida() {
  // const serieventana = this.DialogoSerie.open(ventanaseriesalida, {
  // width: '600px'
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


