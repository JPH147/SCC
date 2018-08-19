import { ServiciosGenerales, Almacen, ListarCliente, ListarVendedor } from './../global/servicios';
import { ventanaseriesalida } from './ventana-seriesalida/ventanaseriesalida';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import {map, startWith, debounceTime, tap, distinctUntilChanged} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import { MatDialog } from '@angular/material';
import {StockService} from '../stock/stock.service'


@Component({
  selector: 'app-salida-productos',
  templateUrl: './salida-productos.component.html',
  styleUrls: ['./salida-productos.component.css'],
  providers: [ServiciosGenerales,StockService]
})

export class SalidaProductosComponent implements OnInit {

  // @ViewChild ('')

  public SalidaProductosForm: FormGroup;
  public articulos: Array <articulo>;
  public contador: number;
  public almacenes: Array<any> = [];
  public productos: FormArray;
  public serieventana: string;
  public almacen: string;
  public almacen1: string;
  public fechaingreso: Date;
  public producto: string;
  public Producto: Array<any>;
  public Series: any[]=[];

  @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;

  constructor (
    public DialogoSerie: MatDialog,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private Articulos: StockService
  ) {}

  ngOnInit() {
    this.ListarAlmacen();

    this.SalidaProductosForm = this.FormBuilder.group({
      'almacen': [null, [Validators.required] ],
      'almacen1': [null, [Validators.required] ],
      'cantidad': [null, [Validators.required] ],
      'fechaingreso': [null, [Validators.required]],
      productos: this.FormBuilder.array([this.CrearProducto()])
    });

      this.contador = 1;
      this.articulos = [
        {numero: this.contador, nombre: '', cantidad: null, precio: null}
      ];
  }

  ngAfterViewInit(){

    this.FiltroProducto.changes.subscribe(res=>{

      for (let i in this.FiltroProducto['_results']) {
        fromEvent(this.FiltroProducto['_results'][i].nativeElement,'keyup')
        .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(()=>{
              if (this.FiltroProducto['_results'][i].nativeElement.value) {
                this.ProductoSeleccionado(this.FiltroProducto['_results'][i].nativeElement.value)
              }
            })
          ).subscribe()
      }
    })
  }

  CrearProducto():FormGroup{
    return this.FormBuilder.group({
      'producto':[{value:null, disabled:false},[
      ]],
      'cantidad':[{value:null, disabled:false},[
      ]],
    })
  }

  ResetearForm(event){
    console.log(event)
    this.ResetearFormArray(this.productos);
    this.Series=[];
    this.Articulos.ListarStock(event.value.nombre, '', '', '', '', 1, 20, 'descripcion asc').subscribe(res=>this.Producto=res['data'].stock)
  }

  ResetearFormArray = (formArray: FormArray) => {
    if (formArray) {
      formArray.reset()
      while (formArray.length !== 1) {
        formArray.removeAt(0)
      }
    }
  }

  AgregarProducto():void{
    this.productos = this.SalidaProductosForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto())
  };

  EliminarProducto(producto,i){
    this.productos.removeAt(i);
  };

  ProductoSeleccionado(filtro){
    this.Articulos.ListarStock(this.SalidaProductosForm.get('almacen').value, '', '', '', filtro, 1, 20, 'descripcion asc').subscribe(res=>{
      this.Producto=res['data'].stock;
      for (let i of this.SalidaProductosForm['controls'].productos.value) {
        if (i.producto) {
          this.EliminarProducto(this.Producto,i.producto.id_producto)
        }
      }
    });
  }

  Aceptar() {
    console.log(this.articulos);
  }


  AgregarSerieSalida(articulo) {
    console.log(articulo);
    const serieventana = this.DialogoSerie.open(ventanaseriesalida, {
      width: '600px'
    });

    serieventana.afterClosed().subscribe(res=>{
      console.log(res)
    })
  }

  displayFn2(producto) {
    if (producto){
      return producto.descripcion 
    }else{
      return ""
    }
  }

// Selector Almacenes Activos
ListarAlmacen() {
  this.Servicios.ListarAlmacen().subscribe( res => {
    this.almacenes = res;
  });

}

// ListarProductos(nombre: string) {
//   this.Servicios.ListarProductos(nombre).subscribe( res => {
//     this.productos = [];
//     // tslint:disable-next-line:forin
//     for ( let i in res) {
//        this.productos.push(res [i]);

//       }

//   });
// }

// AlmacenSeleccionado(event){

//   // this.EliminarAlmacen(this.almacenes,event.value)
// }

EliminarAlmacen(array,value){
   array.forEach( (item, index) => {
     if(item.id === value) array.splice(index,1);
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

