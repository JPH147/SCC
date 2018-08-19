import { ServiciosGenerales, Almacen, ListarCliente, ListarVendedor } from './../global/servicios';
import { ventanaseriesalida } from './ventana-seriesalida/ventanaseriesalida';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import { MatDialog } from '@angular/material';



@Component({
  selector: 'app-salida-productos',
  templateUrl: './salida-productos.component.html',
  styleUrls: ['./salida-productos.component.css'],
  providers: [ServiciosGenerales]
})

export class SalidaProductosComponent implements OnInit {

  // @ViewChild ('')

  public SalidaProductosForm: FormGroup;
  public articulos: Array <articulo>;
  public contador: number;
  public almacenes: Array<any> = [];
  public productos: Array<any> = [];
  public serieventana: string;
  public almacen: string;
  public almacen1: string;
  public fechaingreso: Date;
  public producto: string;


  selected = 'option2';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];



  constructor (public DialogoSerie: MatDialog,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
  ) {}

  ngOnInit() {
    this.ListarAlmacen();
    this.ListarProductos('');

    this.SalidaProductosForm = this.FormBuilder.group({
      'almacen': [null, [Validators.required] ],
      'almacen1': [null, [Validators.required] ],
      'cantidad': [null, [Validators.required] ],
      'fechaingreso': [null, [Validators.required]],
      'producto': [null, [Validators.required]],

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


  AgregarSerieSalida() {
    const serieventana = this.DialogoSerie.open(ventanaseriesalida, {
      width: '600px'
    });
  }

// Selector Almacenes Activos
ListarAlmacen() {
  this.Servicios.ListarAlmacen().subscribe( res => {
    this.almacenes = [];
    // tslint:disable-next-line:forin
    for ( let i in res) {
      this.almacenes.push(res [i]);
    }

  });

}

ListarProductos(nombre: string) {
  this.Servicios.ListarProductos(nombre).subscribe( res => {
    this.productos = [];
    // tslint:disable-next-line:forin
    for ( let i in res) {
       this.productos.push(res [i]);

      }

  });

}

// Guardar(formulario) {
  // this.SalidaProductoServicios.AgregarCompraMercaderia(formulario.value.almacen, formulario.value.tipoIngreso,
  //  formulario.value.docReferencia, formulario.value.proveedor.id ,
    // formulario.value.fecingreso, formulario.value.docReferencia).subscribe (res => console.log(res));

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

