import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatSelect, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import {COMMA, SPACE} from '@angular/cdk/keycodes';
import {map, startWith, tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SalidaVendedoresService} from './salida-vendedores.service';
import {ServiciosGenerales, Almacen} from '../global/servicios';
import {ServiciosVentas} from '../global/ventas';
import {ProductoService} from '../productos/productos.service'
import {VentanaTalonarioComponent} from './ventana-talonario/ventana-talonario.component'
import { ventanaseriessv } from './ventana-seriessv/ventanaseriessv';
import {StockService} from '../stock/stock.service'
import {ServiciosProductoSerie} from '../global/productoserie'

@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.css'],
  providers: [SalidaVendedoresService,ServiciosGenerales,ServiciosVentas,ProductoService,StockService,ServiciosProductoSerie]
})

export class SalidaVendedoresComponent implements OnInit {
  
  @ViewChildren('InputVendedor') FiltroVendedor: QueryList<any>;
  @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;
  @ViewChild('InputAlmacen') FiltroAlmacen: MatSelect;
  public SalidaVendedoresForm:FormGroup;
  public Sucursales: Array<any>;
  public Vendedor: Array<any>;
  public Almacenes:Almacen[];
  public Producto: Array<any>;
  public vendedores: FormArray;
  public productos: FormArray;
  readonly separatorKeysCodes: number[] = [SPACE,COMMA];
  departamentos: any[] = [];

  public Series: ProductosSalida[]=[];

  /***************/

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public DialogoSerie: MatDialog,
    public Dialogotalon: MatDialog,
    private Servicio: SalidaVendedoresService,
    private FormBuilder: FormBuilder,
    private Global: ServiciosGenerales,
    private Ventas:ServiciosVentas,
    private Articulos: StockService,
    private SSeries:ServiciosProductoSerie
    ) { }

 ngOnInit() {

    this.Global.ListarSucursal(null,"").subscribe(res=>this.Sucursales=res);
    this.Global.ListarAlmacen().subscribe(res=>this.Almacenes=res);
    this.Ventas.ListarVendedor(null,"","").subscribe(res=>this.Vendedor=res['data'].vendedores);


    this.SalidaVendedoresForm = this.FormBuilder.group({
      'pecosa': [null, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      'sucursal': [null, [
        Validators.required
      ]],
      'fecha_salida': [new Date(), [
        Validators.required
      ]],
      'destino': [null, [
        Validators.required,
      ]],
      'guia_remision': [null, [
        Validators.required
      ]],
      'tipo_movilidad': [false, [
        Validators.required
      ]],
      'placa': [{value:null, disabled:true}, [
        Validators.required,
        Validators.minLength(7)
      ]],
      'dni': [{value:null, disabled:true}, [
        Validators.required,
        Validators.pattern ('[0-9- ]+'),
        Validators.minLength(8)
      ]],
      'chofer': [{value:null, disabled:true}, [
        Validators.required
      ]],
      'observacion': [{value:null, disabled:false}, [
      ]],
      'comision':[{value:0.05,disabled:true},[
      ]],
      vendedores: this.FormBuilder.array([this.CrearVendedor()]),
      productos: this.FormBuilder.array([this.CrearProducto()])
    });
 }

 ngAfterViewInit(){

  this.FiltroVendedor.changes.subscribe(res=>{
     // console.log(this.FiltroVendedor['_results'])
    for (let i in this.FiltroVendedor['_results']) {
      fromEvent(this.FiltroVendedor['_results'][i].nativeElement,'keyup')
      .pipe(
          tap(()=>{
            if (this.FiltroVendedor['_results'][i].nativeElement.value) {
              this.VendedorSeleccionado2(this.FiltroVendedor['_results'][i].nativeElement.value)
            }
          })
        ).subscribe()
    }
  })

  this.FiltroProducto.changes.subscribe(res=>{
     // console.log(this.FiltroVendedor['_results'])
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

  /*******************/
  /*Chip*/
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.departamentos.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(departamento): void {
    const index = this.departamentos.indexOf(departamento);

    if (index >= 0) {
      this.departamentos.splice(index, 1);
    }
  }
  /*******************/

  displayFn(vendedor) {
    if (vendedor){
      return vendedor.nombre  
    }else{
      return ""
    }
  }

  displayFn2(producto) {
    if (producto){
      return producto.descripcion 
    }else{
      return ""
    }
  }

  CrearVendedor():FormGroup{
    return this.FormBuilder.group({
      'nombre':[{value:null, disabled:false},[
      ]],
      'comision':[{value:null, disabled:true},[
      ]]
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

  AgregarVendedor():void{
    this.vendedores = this.SalidaVendedoresForm.get('vendedores') as FormArray;
    this.vendedores.push(this.CrearVendedor())
  };

  EliminarVendedor(index){
    this.vendedores.removeAt(index);
  };


  AgregarProducto():void{
    this.productos = this.SalidaVendedoresForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto())
  };

  EliminarProducto(producto,i){
    this.productos.removeAt(i);
  };

  ActivarMovilidad(event){
    if (event.checked) {
      this.SalidaVendedoresForm.controls['placa'].enable();
      this.SalidaVendedoresForm.controls['dni'].enable();
      this.SalidaVendedoresForm.controls['chofer'].enable();
    }else{
      this.SalidaVendedoresForm.controls['placa'].disable();
      this.SalidaVendedoresForm.controls['dni'].disable();
      this.SalidaVendedoresForm.controls['chofer'].disable();
    }
  }

  VendedorSeleccionado(event,index){
    this.VendedorSeleccionado2("");
    this.SalidaVendedoresForm.get('vendedores')['controls'][index].get('comision').setValue(event.option.value.comision)
  }
  
  VendedorSeleccionado2(filtro){
    this.Ventas.ListarVendedor(null,filtro,"").subscribe(res=>{
      this.Vendedor=res['data'].vendedores;
      for (let i of this.SalidaVendedoresForm['controls'].vendedores.value) {
        if (i.nombre) {
          this.EliminarElemento(this.Vendedor,i.nombre.id)
        }
      }
    });
  }

  ProductoSeleccionado(filtro){
    this.Articulos.ListarStock(this.FiltroAlmacen.value, '', '', '', filtro, 1, 20, 'descripcion asc').subscribe(res=>{
      this.Producto=res['data'].stock;
      for (let i of this.SalidaVendedoresForm['controls'].productos.value) {
        if (i.producto) {
          this.EliminarElemento(this.Producto,i.producto.id_producto)
        }
      }
    });

    // for (let i of this.SalidaVendedoresForm['controls'].productos.value) {
    //    if (i.producto) {
    //      this.EliminarElemento(this.Producto,i.producto.id_producto)
    //    }
    // }
  }

  EliminarElemento(array,value){
    // console.log(array,value);
     array.forEach( (item, index) => {
       if (item.id_producto) {
         if(item.id_producto === value) array.splice(index,1);
       }
       else if (item.id) {
         if(item.id === value) array.splice(index,1);
       }
     });
  }

  AgregarSerieSalidaV(producto,index) {
    const serieventana = this.DialogoSerie.open(ventanaseriessv, {
      width: '800px',
      data:{almacen:this.FiltroAlmacen.value, id_producto:producto.id_producto, precio:producto.precio, series:this.Series}
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
      // console.log(this.Series);
      this.SalidaVendedoresForm.get('productos')['controls'][index].get('cantidad').setValue(ip)
    })
  }

  AgregarTalonario() {
    const  serietalorarios = this.Dialogotalon.open(VentanaTalonarioComponent, {
      width: '800px'
    });
  }

  ResetearForm(event){
    this.ResetearFormArray(this.productos);
    this.Series=[];
    this.Articulos.ListarStock(event.value, '', '', '', '', 1, 20, 'descripcion asc').subscribe(res=>this.Producto=res['data'].stock)
  }

  ResetearFormArray = (formArray: FormArray) => {
    if (formArray) {
      formArray.reset()
      while (formArray.length !== 1) {
        formArray.removeAt(0)
      }
    }
  }

  Guardar(formulario){
    let destinos:string="";

    for (let i of this.departamentos) {
      destinos=i.name +", " +destinos
    }

    // console.log("Series",this.Series);
   // console.log("Formulario", formulario.value.vendedores)

    this.Servicio.Agregar(
      formulario.value.pecosa,
      formulario.value.sucursal,
      formulario.value.fecha_salida,
      destinos,
      formulario.value.guia_remision,
      formulario.value.tipo_movilidad,
      formulario.value.observacion
      ).subscribe(res=>{

        // Grabar datos de chofer
        if (formulario.value.tipo_movilidad) {
          this.Servicio.AgregarMovilidad(
            res.data,
            formulario.value.placa,
            formulario.value.dni,
            formulario.value.chofer
          )
        }

        // Grabar datos de vendedor
        for (let i of formulario.value.vendedores) {
          this.Servicio.AgregarVendedor(
            res.data,
            i.nombre.id,
            this.SalidaVendedoresForm.get('comision').value
          ).subscribe()
        }

        // Grabar datos de productos
        for (let i of this.Series) {
          if (i.considerar) {
            this.Servicio.AgregarProducto(
              res.data,
              i.id_serie,
              i.precio,
              i.cantidad
            ).subscribe(res=>{
              this.SSeries.RegistrarProductoOUT(i.id_serie).subscribe(res=>{
            })
            })
          }
        }

        // this.SalidaVendedoresForm.reset()
        // this.Series=[];
        // this.ResetearFormArray(this.productos);
        this.snackBar.open("El producto se guardó satisfactoriamente", '', {
          duration: 2000,
        });
      });
  }
}

export interface ProductosSalida{
  id_producto:number,
  id_serie:number,
  serie:string,
  precio:number,
  cantidad:number,
  considerar:boolean
}