import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { SalidaProductosService } from './salida-productos.service';
import { ServiciosGenerales, Almacen, ListarCliente, ListarVendedor } from './../global/servicios';
import { ventanaseriesalida } from './ventana-seriesalida/ventanaseriesalida';
import {FormControl, FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import {map, startWith, debounceTime, tap, distinctUntilChanged} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatSnackBar} from '@angular/material';
import { MatDialog } from '@angular/material';
import {StockService} from '../stock/stock.service'
import {ServiciosProductoSerie} from '../global/productoserie'
import {IngresoProductoService} from '../ingreso-productos/ingreso-productos.service'
import {ServiciosDocumentos} from '../global/documentos';

@Component({
  selector: 'app-salida-productos',
  templateUrl: './salida-productos.component.html',
  styleUrls: ['./salida-productos.component.css'],
  providers: [ServiciosGenerales,StockService,ServiciosProductoSerie,IngresoProductoService,ServiciosDocumentos]
})

export class SalidaProductosComponent implements OnInit {

  public SalidaProductosForm: FormGroup;
  public contador: number;
  public almacenes: Array<any> = [];
  public almacen_origen: Array<any> = [];
  public almacen_destino: Array<any> = [];
  public productos: FormArray;
  public serieventana: string;
  public documento_serie:string;
  public documento_numero:number;
  public fechamov: Date;
  public producto: string;
  public Producto: Array<any>;
  public Series: any[]=[];
  public enviado:boolean;
  public Hoy: Date = new Date();
  public nuevo_documento:boolean;

  @ViewChild('InputDocumento') FiltroDocumento: ElementRef;
  @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;

  constructor (
    public DialogoSerie: MatDialog,
    private FormBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private Servicios: ServiciosGenerales,
    private SalidaProductosServicios: SalidaProductosService,
    private Articulos: StockService,
    private SSeries:ServiciosProductoSerie,
    private IServicios: IngresoProductoService,
    private SDocumentos: ServiciosDocumentos,
  ) {}


  ngOnInit() {

    this.ListarAlmacen();
    this.enviado=false;

    this.SalidaProductosForm = this.FormBuilder.group({
      'almacen': [null, [
        Validators.required
      ] ],
      'almacen1': [null, [
        Validators.required
      ] ],
      'fechaingreso': [null, [
        Validators.required
      ]],
      'documento': ["", [
        Validators.required
      ]],
      productos: this.FormBuilder.array([this.CrearProducto()])
    });
    this.CrearProducto();

  }

  ngAfterViewInit(){

    this.FiltroProducto.changes.subscribe(res=>{
      for (let i in this.FiltroProducto['_results']) {
        fromEvent(this.FiltroProducto['_results'][i].nativeElement,'keyup')
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(()=>{
            if (this.FiltroProducto['_results'][i]) {
              if (this.FiltroProducto['_results'][i].nativeElement.value) {
                this.ProductoElegido(this.FiltroProducto['_results'][i].nativeElement.value)
              }
            }
          })
        ).subscribe()
      }
    })

    fromEvent(this.FiltroDocumento.nativeElement,'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.ValidarDocumento()
      })
     ).subscribe()


  }

  CrearProducto():FormGroup{
    return this.FormBuilder.group({
      'id_producto':[{value:null, disabled:false},[
      ]],
      'descripcion':[{value:null, disabled:false},[
      ]],
      'producto':[{value:null, disabled:false},[
        Validators.required
      ]],
      'cantidad':[{value:null, disabled:true},[
      ]],
      'cantidad-validacion':[{value:null, disabled:false},[
        Validators.required,
        Validators.min(1)
      ]],

    })
  }

  ResetearForm(event){
    this.ResetearFormArray(this.productos);
    this.SalidaProductosForm['controls'].productos['controls'][0].get('descripcion').enable();
    this.SalidaProductosForm['controls'].productos['controls'][0].reset();
    this.Series=[];
    this.Articulos.ListarStock(event.value.nombre, '', '', '', '', 1, 20, 'descripcion asc').subscribe(res=>this.Producto=res['data'].stock);
    this.almacen_destino=this.almacenes;
    this.almacen_destino=this.almacen_destino.filter(e=>e.id!=event.value.id);
    this.ObtenerNumeroDocumento(event.value.id);
  }

  Reset(){
    this.SalidaProductosForm.reset();
    // this.SalidaProductosForm.controls['control'].markAsPristine();
    this.ResetearFormArray(this.productos);
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
    if (producto) {
      this.EliminarElemento(this.Series,producto.id_producto);
    }
    if (this.productos) {
      this.productos.removeAt(i);
    }
  };

  ValidarDocumento(){
    if(this.SalidaProductosForm.value.documento == ""){
      this.nuevo_documento = true
    } else {
      if (this.SalidaProductosForm.value.almacen && this.SalidaProductosForm.value.documento) {
        this.SDocumentos.ValidarDocumento(5,this.SalidaProductosForm.value.almacen.id,this.SalidaProductosForm.value.documento).subscribe(res=>{
          if (res.total==0) {
            this.nuevo_documento = true
          }else{
            this.nuevo_documento = false
          }
        })
      }
    }
  }

  // Se asigna el valor al id del producto para que se active la opción de elegir cantidad
  ProductoSeleccionado(index,evento){
    if (typeof(index) == 'number') {
      if (evento.option.value.id_producto) {
        this.SalidaProductosForm['controls'].productos['controls'][index].get('id_producto').setValue(evento.option.value.id_producto)
      }
    }
    this.SalidaProductosForm['controls'].productos['controls'][index].get('producto').setValue(evento.option.value);
    this.SalidaProductosForm['controls'].productos['controls'][index].get('descripcion').disable();
    this.ProductoElegido("");
  }

  // Con esta función se aplica el filtro a los inputs
  ProductoElegido(filtro){
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

  ObtenerNumeroDocumento(id_almacen){
   
    this.IServicios.ObtenerNumeroDocumento(id_almacen,2).subscribe(res=>{
      if(res)
      {
        this.documento_serie=res['data'].serie;
        this.documento_numero=res['data'].numero;
      }
    })
  }

  AgregarSerieSalida(producto,index) {

    // console.log(producto,index)

    const serieventana = this.DialogoSerie.open(ventanaseriesalida, {
      width: '1200px',
      data:{almacen:this.SalidaProductosForm.get('almacen').value.nombre, id_producto:producto.id_producto, precio:producto.precio, series:this.Series}
    });

    serieventana.afterClosed().subscribe(res=>{

      let ip:number;
      // console.log(res)
      
      if (res) {
        ip=0;
        this.EliminarElemento(this.Series,res[0].id_producto);
      }

      for (let i in res) {
        this.Series.push({id_producto:res[i].id_producto,id_serie:res[i].id_serie, serie:res[i].serie,precio:res[i].precio, almacenamiento:res[i].almacenamiento,color:res[i].color,cantidad:res[i].cantidad, considerar:res[i].considerar})
        // Saber cuántos elementos de RES son del producto
        if (res[i].id_producto=producto.id_producto && res[i].considerar==true) {
          ip++
        }
      }
      if (ip >= 0) {
        this.SalidaProductosForm.get('productos')['controls'][index].get('cantidad').setValue(ip);
        this.SalidaProductosForm.get('productos')['controls'][index].get('cantidad-validacion').setValue(ip);
      }
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
    this.almacenes=res;
    this.almacen_origen=res;
    this.almacen_destino=res;
  })
}

AlmacenSeleccionado(evento){
  this.almacen_origen=this.almacenes;
  this.almacen_origen=this.almacen_origen.filter(e=>e.id!=evento.value)
}


GuardarTransferenciaAlmacen(formulario) {

  this.enviado=true;
  
  this.SDocumentos.ValidarDocumento(5,this.SalidaProductosForm.value.almacen.id,this.SalidaProductosForm.value.documento).subscribe(res=>{
    if (res.total==0) {
      this.SalidaProductosServicios.SalidaTransferenciaAlmacen(
        formulario.value.almacen.id,
        5,
        4,
        formulario.value.almacen1.id,
        formulario.value.fechamov,
        formulario.value.documento,
        this.documento_numero
      ).subscribe (res=>{
        // console.log(res)
        // Grabar datos de productos
        for (let i of this.Series) {
          if (i.considerar) {
            this.SalidaProductosServicios.AgregarProducto(
              res['data'],
              i.id_serie,
              i.precio,
              -1
            ).subscribe(res=>{
              // console.log(res)
                // this.SSeries.RegistrarProductoOUT(i.id_serie).subscribe(res=>{
                  // console.log(res)
              // })
            })
          }
        }
        this.snackBar.open("Se guardó la transferencia satisfactoriamente", '', {
          duration: 2000,
        });
        this.Reset();
        this.enviado=false;
      });    
    }else{
      this.snackBar.open("Ya se ha registrado este documento", '', {
        duration: 2000,
      });
      this.enviado=false;
    }
  })
}

}
