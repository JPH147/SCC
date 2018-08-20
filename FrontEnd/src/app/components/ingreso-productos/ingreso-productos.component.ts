import { Cliente } from './../clientes/clientes.service';
import { IngresoProductoService } from './ingreso-productos.service';
import { ServiciosGenerales, Almacen, ListarCliente, ListarVendedor } from './../global/servicios';
import { ventanaseries } from './ventana-series/ventanaseries';
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
import { disableDebugTools } from '@angular/platform-browser';


@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styleUrls: ['./ingreso-productos.component.css'],
  providers: [ServiciosGenerales, IngresoProductoService]
})
  export class IngresoProductosComponent implements OnInit {

    @ViewChild('Proveedor') FiltroProveedor: ElementRef;
    @ViewChild('Cliente') FiltroCliente: ElementRef;
    @ViewChild('Vendedor') FiltroVendedor: ElementRef;

    public IngresoProductoForm: FormGroup;
    public articulos: Array <articulo>;
    public productos: Array<any> = [];
    public contador: number;
    public almacenes: Array<any> = [];
    public TipoIngresos: Array<any> = [];
    public proveedores: Array<any> = [];
    public clientes: Array<any> = [];
    public Vendedores: Array<any> = [];
    public Sucursales: Array<any> = [];
    public seriventana: string;
    public tipoIngreso: string;      // Tipo de Ingreso Almacen
    public docReferencia: string; // documento referencia de ingreso almncen
    public proveedor: string;
    public cliente: string;
    public vendedor: string;
    public nombre: string;
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
      private IngresoProductoservicios: IngresoProductoService,
    ) {}

    ngOnInit() {

      this.ListarAlmacen();
      this.ListarTransaccionTipo();
      this.ListarProveedor('');
      this.ListarCliente('');
      this.ListarVendedor('');
      this.ListarProductos('');

      this.IngresoProductoForm = this.FormBuilder.group({
          'almacen': [null, [Validators.required] ],
          'almacen1': [null, [Validators.required] ],
          'tipoIngreso': [null, [Validators.required]],
          'docReferencia': [null, [Validators.required]],
          'proveedor': [null, [Validators.nullValidator] ],
          'cliente': [null, [Validators.nullValidator]],
          'vendedor': [null, [Validators.nullValidator]],
          'sucursal': [null, [Validators.nullValidator]],
          'documento': [null, [Validators.nullValidator]],
          'fecingreso': [null, [Validators.required]],
          'producto': [null, [Validators.required]],
          'cantidad': [null, [Validators.required]],
          'precioUnitario': [null, [Validators.required]],
      });

      this.contador = 1;
      this.articulos = [
        {numero: this.contador, nombre: '', cantidad: null, precio: null}
      ];

    }

    displayCliente(cliente?: any): string | undefined {
      return cliente ? cliente.nombre + ' ' + cliente.apellido : undefined;
    }

    displayProveedor(proveedor?: any): string | undefined {
      return proveedor ? proveedor.nombre : undefined;
    }

    displayVendedor(vendedor?: any): string | undefined {
      return vendedor ? vendedor.nombre : undefined;
    }

    // Selector Proveedores activos
    ListarProveedor(nombre: string) {
      this.Servicios.ListarProveedor(nombre).subscribe( res => {
        this.proveedores = [];
       // console.log(res);
        // tslint:disable-next-line:forin
        for (let i in res) {
          this.proveedores.push(res[i]);
        }
      });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {

      fromEvent(this.FiltroProveedor.nativeElement, 'keyup')
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

    ListarCliente(nombre: string) {
      this.Servicios.ListarCliente(nombre).subscribe( res => {
        this.clientes = [];
        // tslint:disable-next-line:forin
        for (let i in res) {

            this.clientes.push(res[i]);
            // console.log(res[i]);
        }
      });
    }

    ListarVendedor(nombre: string) {
      this.Servicios.ListarVendedor(nombre).subscribe( res => {
        this.Vendedores = [];

        // tslint:disable-next-line:forin
        for (let i in res) {
            this.Vendedores.push(res[i]);

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

    ListarProductos(nombre: string) {
      this.Servicios.ListarProductos(nombre).subscribe( res => {
        this.productos = [];
        // tslint:disable-next-line:forin
        for ( let i in res) {
           this.productos.push(res [i]);
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

  // Guardar Datos Formulario Ingreso Productos Almacen
  Guardar(formulario) {
   // console.log(this.IngresoProductoForm);
   // console.log(moment(this.IngresoProductoForm.get('fecingreso').value).format('DD/MM/YYYY'));

   // tslint:disable-next-line:prefer-const
   let tipoingreso = formulario.value.tipoIngreso;

   if (tipoingreso === 1) {
     console.log(tipoingreso);
    this.IngresoProductoservicios.AgregarCompraMercaderia(
      formulario.value.almacen,
      1,
      1,
      formulario.value.proveedor.id ,
      formulario.value.fecingreso,
      formulario.value.docReferencia).subscribe (res => console.log(res));
   }

   if (tipoingreso === 2) {
    this.IngresoProductoservicios.AgregarDevolucionCliente(
      formulario.value.almacen,
      2,
      2,
      formulario.value.cliente.id,
      formulario.value.fecingreso,
      formulario.value.docReferencia).subscribe (res => console.log(res));
   }

   if (tipoingreso === 6) {
    this.IngresoProductoservicios.AgregarDevolucionVendedor (
      formulario.value.almacen,
      6,
      5,
      formulario.value.vendedor.id,
      formulario.value.fecingreso,
      formulario.value.docReferencia).subscribe (res => console.log(res));
   }

   if (tipoingreso === 7) {
    this.IngresoProductoservicios.AgregarTransferenciaSucursal (
      formulario.value.almacen,
      7,
      4,
      formulario.value.almacen1,
      formulario.value.fecingreso,
       formulario.value.docReferencia).subscribe (res => console.log(res));
   }

     this.IngresoProductoForm.reset();

  }

  Cambio(evento) {
    console.log(evento);
  }

} // Fin de la Clase IngresoProductoComponent


// tslint:disable-next-line:class-name
export interface articulo {
  numero: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

