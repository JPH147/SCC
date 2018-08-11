
import { ServiciosGenerales, Almacen } from './../global/servicios';
import { ventanaseries } from './ventana-series/ventanaseries';
import { DialogData } from '../salida-vendedores/salida-vendedores.component';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, PatternValidator } from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import { map, startWith, subscribeOn } from 'rxjs/operators';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import { MatDialog } from '@angular/material';
import { eventNames } from 'cluster';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styleUrls: ['./ingreso-productos.component.css'],
  providers: [ServiciosGenerales]
})
  export class IngresoProductosComponent implements OnInit {

    @ViewChild('Proveedor') FiltroProveedor: ElementRef;

    public IngresoProductoForm: FormGroup;
    public articulos: Array <articulo>;
    public contador: number;
    public almacenes: Array<any> = [];
    public TipoIngresos: Array<any> = [];
    public proveedores: Array<any> = [];
    public seriventana: string;
   //  public Almacenes: Almacen [] = [];
    public tipoIngreso: string;      // Tipo de Ingreso Almacen
    public docReferencia: string; // documento referencia de ingreso almncen
    public proveedor: string;
    public fecingreso: Date;      // fecha de ingreso a almcen
    public  data;


    selected = 'option2';
    myControl = new FormControl();
    filteredOptions: Observable<string[]>;

    constructor(public DialogoSerie: MatDialog,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
   /* public data,*/
    private Servicios: ServiciosGenerales,
    ) {}

    ngOnInit() {

      this.ListarAlmacen();
      this.ListarTransaccionTipo();
      this.ListarProveedor(' ');

      this.IngresoProductoForm = this.FormBuilder.group({
          'almacen': [null, [Validators.required] ],
          'tipoIngreso': [null, [Validators.required]],
          'docReferencia': [null, [Validators.required, Validators.pattern('[0-9-]+')]],
          'proveedor': [null, [Validators.required]],
          'fecingreso': [null, [Validators.required]],
      });
/*
      this.Servicios.ListarAlmacen().subscribe(res => {
        // tslint:disable-next-line:forin
       for (let i in res) {
         this.Almacen.push(res [i]);
       }
     });
*/
      this.contador = 1;
      this.articulos = [
        {numero: this.contador, nombre: '', cantidad: null, precio: null}
      ];


    }

    // Selector Proveedores activos
    ListarProveedor(nombre: string) {
      this.Servicios.ListarProveedor(nombre).subscribe( res => {
        this.proveedores = [];
        console.log(res);
        // tslint:disable-next-line:forin
        for (let i in res) {
          this.proveedores.push(res[i]);
        }
      });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {

      fromEvent(this.FiltroProveedor.nativeElement,'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarProveedor(this.FiltroProveedor.nativeElement.value);
        })
       ).subscribe();

    }

    // Selector tipo de ingresos
    ListarTransaccionTipo() {
      this.Servicios.ListarTransaccionTipo().subscribe( res => {
        this.TipoIngresos = [];
        // tslint:disable-next-line:forin
        for (let i in res) {
            this.TipoIngresos.push(res[i]);

        }
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

  Guardar() {
    console.log(this.IngresoProductoForm);
    console.log(moment(this.IngresoProductoForm.get('fecingreso').value).format('DD/MM/YYYY'));
  }

  Cambio(evento){
    console.log(evento)
  }


}

// tslint:disable-next-line:class-name
export interface articulo {
  numero: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

