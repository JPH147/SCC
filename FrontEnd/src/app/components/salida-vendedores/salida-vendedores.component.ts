import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatSelect} from '@angular/material';
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

@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.css'],
  providers: [SalidaVendedoresService,ServiciosGenerales,ServiciosVentas,ProductoService,StockService]
})

export class SalidaVendedoresComponent implements OnInit {
  
  public talonarioSalidaForm: FormGroup;
  public talonarioForm: FormGroup;
  public contador: number;
  public almacenes: Array<any>;
  public serieventana: string;
  public talonventana: string;
  public serietalorarios: Array<any>;
  public Agregatalonarion: any;
  public selectedValue: string;
  public serie: Array<any>;
  public inicio: number;
  public fin: number;
  public numero: number;


  @ViewChildren('InputVendedor') FiltroVendedor: QueryList<any>;
  @ViewChild('InputProducto') FiltroProducto: ElementRef;
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
    public dialog: MatDialog,
    public DialogoSerie: MatDialog,
    public Dialogotalon: MatDialog,
    private Servicio: SalidaVendedoresService,
    private FormBuilder: FormBuilder,
    private Global: ServiciosGenerales,
    private Ventas:ServiciosVentas,
    private Articulos: StockService
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
        Validators.required
      ]],
      'dni': [{value:null, disabled:true}, [
        Validators.required,
        Validators.pattern ('[0-9- ]+'),
        Validators.minLength(8)
      ]],
      'chofer': [{value:null, disabled:true}, [
        Validators.required
      ]],
      vendedores: this.FormBuilder.array([this.CrearVendedor()]),
      productos: this.FormBuilder.array([this.CrearProducto()])
    });
 }

 ngAfterViewInit(){

   // fromEvent(this.FiltroVendedor.nativeElement,'keyup')
   // .pipe(
   //   debounceTime(10),
   //   distinctUntilChanged(),
   //   tap(() => {
   //     this.Ventas.ListarVendedor(null,this.FiltroVendedor.nativeElement.value,"").subscribe(res=>this.Vendedor=res['data'].vendedores);
   //   })
   //  ).subscribe();
 
  this.FiltroVendedor.changes.subscribe(res=>{
     // console.log(this.FiltroVendedor['_results'])
    for (let i in this.FiltroVendedor['_results']) {
      fromEvent(this.FiltroVendedor['_results'][i].nativeElement,'keyup')
      .pipe(
          tap(()=>{
            this.Ventas.ListarVendedor(null,this.FiltroVendedor['_results'][i].nativeElement.value,"").subscribe(res=>this.Vendedor=res['data'].vendedores);
          })
        ).subscribe()
    }
  })



   fromEvent(this.FiltroProducto.nativeElement,'keyup')
   .pipe(
     debounceTime(10),
     distinctUntilChanged(),
     tap(() => {
        this.Articulos.ListarStock(this.FiltroAlmacen.value, '', '', '', this.FiltroProducto.nativeElement.value, 1, 20, 'descripcion asc').subscribe(res=>this.Producto=res['data'].stock)
     })
    ).subscribe();

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

  EliminarProducto(index){
    this.productos.removeAt(index);
  };

  Guardar(formulario){
    let destinos:string="";

    for (let i of this.departamentos) {
      destinos=destinos +", "+ i.name
    }

    this.Servicio.Agregar(
      formulario.value.pecosa,
      formulario.value.sucursal,
      formulario.value.fecha_salida,
      destinos,
      formulario.value.guia_remision,
      formulario.value.tipo_movilidad
      ).subscribe(res=>console.log(res));
  }
  
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

  VendedorSeleccionado(event,i){
    this.Ventas.ListarVendedor(null,"","").subscribe(res=>this.Vendedor=res['data'].vendedores);
    this.SalidaVendedoresForm.get('vendedores').value[i].nombre=event.option.value.id;
    this.SalidaVendedoresForm.get('vendedores')['controls'][i].get('comision').setValue(event.option.value.comision)
  }
  
  ProductoSeleccionado(event,i){
    this.Articulos.ListarStock(this.FiltroAlmacen.value, '', '', '', '', 1, 20, 'descripcion asc').subscribe(res=>{
      this.Producto=res['data'].stock;
      for (let i of this.SalidaVendedoresForm['controls'].productos.value) {
        this.EliminarElemento(this.Producto,i.producto.id_producto)
      }
    });


   // this.EliminarElemento(this.Producto,"JP")

    // console.log(this.Producto);
    for (let i of this.SalidaVendedoresForm['controls'].productos.value) {
       this.EliminarElemento(this.Producto,i.producto.id_producto)
    }
  }

  EliminarElemento(array,value){
     array.forEach( (item, index) => {
       if(item.id_producto === value) array.splice(index,1);
     });
  }

  AgregarSerieSalidaV(producto) {
    const serieventana = this.DialogoSerie.open(ventanaseriessv, {
      width: '800px',
      data:{almacen:this.FiltroAlmacen.value,id_producto:producto.id_producto,precio:producto.precio, }
    });

    serieventana.afterClosed().subscribe(res=>{
      for (let i in res) {
        this.Series.push({id_serie:res[0].id_serie, precio:res[0].precio, cantidad:res[0].cantidad})
      }
      console.log(this.Series);
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
}

export interface ProductosSalida{
  id_serie:number,
  precio:number,
  cantidad:number
}