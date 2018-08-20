import { SalidaProductosService } from './salida-productos.service';
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

  public SalidaProductosForm: FormGroup;
  public articulos: Array <articulo>;
  public contador: number;
  public almacenes: Array<any> = [];
  public productos: FormArray;
  public serieventana: string;
  public almacen: string;
  public almacen1: string;
  public fechamov: Date;
  public producto: string;
  public Producto: Array<any>;
  public Series: any[]=[];

  @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;

  constructor (
    public DialogoSerie: MatDialog,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private SalidaProductosServicios: SalidaProductosService,
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
    this.Articulos.ListarStock(this.SalidaProductosForm.get('almacen').value.nombre, '', '', '', filtro, 1, 20, 'descripcion asc').subscribe(res=>{
      this.Producto=res['data'].stock;
      for (let i of this.SalidaProductosForm['controls'].productos.value) {
        if (i.producto) {
          this.EliminarElemento(this.Producto,i.producto.id_producto)
        }
      }
    });
  }

  EliminarElemento(array,value){
     array.forEach( (item, index) => {
       if(item.id_producto === value) array.splice(index,1);
     });
  }

  Aceptar() {
    console.log(this.articulos);
  }


  AgregarSerieSalida(producto,index) {

    const serieventana = this.DialogoSerie.open(ventanaseriesalida, {
      width: '800px',
      data:{almacen:this.SalidaProductosForm.get('almacen').value.nombre, id_producto:producto.id_producto, precio:producto.precio, series:this.Series}
    });

    serieventana.afterClosed().subscribe(res=>{
      if (res) {
        this.EliminarElemento(this.Series,res[0].id_producto);
      }
      let ip:number=0;
      for (let i in res) {
        this.Series.push({id_producto:res[i].id_producto,id_serie:res[i].id_serie, serie:res[i].serie,precio:res[i].precio, cantidad:res[i].cantidad, considerar:res[i].considerar})
        // Saber cuántos elementos de RES son del producto
        if (res[i].id_producto=producto.id_producto && res[i].considerar==true) {
          ip++
        }
      }
      this.SalidaProductosForm.get('productos')['controls'][index].get('cantidad').setValue(ip)
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

GuardarTransferenciaAlmacen(formulario) {
  // console.log(this.SalidaProductosForm['controls'].productos)
  this.SalidaProductosServicios.SalidaTransferenciaAlmacen(
  formulario.value.almacen.id,
  5,
  4,
  formulario.value.almacen1,
  formulario.value.fechamov,
  ).subscribe (res=>{
    // Grabar datos de productos
    for (let i of this.Series) {
      if (i.considerar) {
        this.SalidaProductosServicios.AgregarProducto(
          res.data,
          i.id_serie,
          i.precio,
          i.cantidad * (-1)
        ).subscribe(res=>console.log(res))
      }
    }
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

