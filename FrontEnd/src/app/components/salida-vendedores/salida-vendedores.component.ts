import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList, Optional } from '@angular/core';
import {MatDialog, MatChipInputEvent, MatSelect, MatSnackBar} from '@angular/material';
import { FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {Observable, fromEvent, BehaviorSubject} from 'rxjs';
import {COMMA, SPACE} from '@angular/cdk/keycodes';
import { tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SalidaVendedoresService} from './salida-vendedores.service';
import {ServiciosGenerales, Almacen, Talonario} from '../global/servicios';
import {ServiciosVentas} from '../global/ventas';
import {ProductoService} from '../productos/productos.service';
import {VentanaTalonarioComponent} from './ventana-talonario/ventana-talonario.component';
import { ventanaseriessv } from './ventana-seriessv/ventanaseriessv';
import {StockService} from '../stock/stock.service';
import {ServiciosProductoSerie} from '../global/productoserie';
import {SalidaProductosService} from '../salida-productos/salida-productos.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {Location} from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {ProductosDataSource , TalonariosDataSource } from '../retorno-vendedores/retorno-vendedores.component';
import {ViaticosDataSource} from '../retorno-vendedores-cierre/retorno-vendedores-cierre.component';

@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.scss'],
  providers: [SalidaVendedoresService,ServiciosGenerales,ServiciosVentas,ProductoService,StockService,ServiciosProductoSerie,SalidaProductosService]
})

export class SalidaVendedoresComponent implements OnInit {
  
  public Cargando = new BehaviorSubject<boolean>(true);

  @ViewChild('InputVendedor') FiltroVendedor: ElementRef;
  @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;
  @ViewChild('InputAlmacen') FiltroAlmacen: MatSelect;
  public SalidaVendedoresForm:FormGroup;
  public Sucursales: Array<any>;
  public Vendedor: Array<any>;
  public Almacenes:Almacen[];
  public Producto: Array<any>;
  public productos: FormArray;
  public Hoy= new Date();
  readonly separatorKeysCodes: number[] = [SPACE,COMMA];
  departamentos: any[] = [];

  // Para ver la salida
  public id_salida:number;

  public Series: Array<any>;
  public talonarios: Array<any>;
  public comision_retenida:number;

  // Tabla de vendedores
  ListadoVendedores: VendedoresDataSource;
  Columnas: string[] = [ 'numero','nombre', 'comision_efectiva', 'comision_retenida', 'opciones'];
  public Vendedores: Array<any> = [];

  // Tabla de productos
  ListadoProductos: ProductosDataSource;
  ColumnasProductos: string[] = [ 'numero','producto', 'serie', 'precio', 'estado'];

  // Tabla de talonarios
  ListadoTalonarios: TalonariosDataSource;
  ColumnasTalonarios: string[] = ['numero', 'contrato', 'estado', 'observaciones', 'opciones']

  // Tabla de viáticos
  ListadoViaticos: ViaticosDataSource;
  ColumnasViaticos: string[] = ['numero', 'vendedor', 'monto_grupal', 'monto_individual']


  constructor(
    private snackBar: MatSnackBar,
    private DialogoSerie: MatDialog,
    private Dialogotalon: MatDialog,
    private Servicio: SalidaVendedoresService,
    private FormBuilder: FormBuilder,
    private Global: ServiciosGenerales,
    private Ventas:ServiciosVentas,
    private Articulos: StockService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

 ngOnInit() {

    this.id_salida=62;
    this.SeleccionarSalida();
    this.ListadoProductos = new ProductosDataSource(this.Servicio);
    this.ListadoTalonarios = new TalonariosDataSource(this.Servicio);
    this.ListadoViaticos = new ViaticosDataSource(this.Servicio);

    this.talonarios=[];
    this.ListarVendedor("");

    this.ListadoVendedores = new VendedoresDataSource();

    this.ConsultarComisionRetenida();

    this.Global.ListarSucursal(null,"").subscribe(res=>this.Sucursales=res);
    this.Global.ListarAlmacen().subscribe(res=>this.Almacenes=res);

    this.CrearFormulario();

    // this.route.params.subscribe(params => {
    //   if(params['idsalida']){
    //     this.id_salida=params['idsalida'];
    //     this.SeleccionarSalida();
    //   }
    // })
  }

  CrearFormulario(){
    this.SalidaVendedoresForm = this.FormBuilder.group({
      pecosa: [null, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      sucursal: [null, [
        Validators.required
      ]],
      fecha_salida: [new Date(), [
        Validators.required
      ]],
      destino: ["", [
        Validators.required,
      ]],
      guia_remision: ["", [
        Validators.required
      ]],
      almacen: [false, [
        Validators.required
      ]],
      placa: [{value:"", disabled:false}, [
      ]],
      dni: [{value:"", disabled:false}, [
      ]],
      chofer: [{value:"", disabled:false}, [
      ]],
      observacion: [{value:"", disabled:false}, [
      ]],
      vendedor_nombre: [{value:null, disabled:false}, [
      ]],
      vendedor_comision_efectiva: [{value:null, disabled:false}, [
      ]],
      vendedor_comision_retenida:[{value:this.comision_retenida,disabled:false},[
      ]],
      productos: this.FormBuilder.array([this.CrearProducto()]),
      talonarios: [{value:null, disabled:false}, [
        Validators.required
      ]],
      vendedores: [{value:null, disabled:false}, [
        Validators.required
      ]],
    });
  }

  SeleccionarSalida(){
    this.Servicio.SeleccionarSalida(this.id_salida).subscribe(res=>{
      this.Cargando.next(false);
      this.SalidaVendedoresForm.get('pecosa').setValue(res['data'].pecosa);
      this.SalidaVendedoresForm.get('sucursal').setValue(res['data'].sucursal);
      this.SalidaVendedoresForm.get('guia_remision').setValue(res['data'].guia);
      this.SalidaVendedoresForm.get('fecha_salida').setValue(moment(res['data'].fecha).format('dd/mm/yyyy'));
      this.SalidaVendedoresForm.get('destino').setValue(res['data'].destino);
      this.SalidaVendedoresForm.get('observacion').setValue(res['data'].observacion ? res['data'].observacion : "No hay observaciones");
      this.SalidaVendedoresForm.get('placa').setValue(res['data'].vehiculo_placa);
      this.SalidaVendedoresForm.get('dni').setValue(res['data'].chofer_dni);
      this.SalidaVendedoresForm.get('chofer').setValue(res['data'].chofer_nombre);

      this.Vendedores=res['data'].vendedores.vendedores;
      this.Columnas = [ 'numero','nombre', 'comision_efectiva', 'comision_retenida']
      this.ListadoVendedores.AgregarInformacion(this.Vendedores)

      this.ListadoProductos.CargarInformacion(this.id_salida,0);
      this.ListadoTalonarios.CargarInformacion(this.id_salida, 0);
      this.ListadoViaticos.CargarInformacion(this.id_salida);
    })
    
  }

  ngAfterViewInit(){
    if(!this.id_salida){
      fromEvent(this.FiltroVendedor.nativeElement,'keyup')
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        tap(()=>{
          this.ListarVendedor(this.FiltroVendedor.nativeElement.value)
        })
      ).subscribe()
  
      this.FiltroProducto.changes.subscribe(res=>{
        for (let i in this.FiltroProducto['_results']) {
          fromEvent(this.FiltroProducto['_results'][i].nativeElement,'keyup')
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(()=>{
              if (this.FiltroProducto['_results'][i].nativeElement.value) {
                this.ListarProductos(this.FiltroProducto['_results'][i].nativeElement.value)
              }
            })
          ).subscribe()
        }
      })
    }
  }

  ConsultarComisionRetenida(){
    this.Ventas.ListarComisionRetenida().subscribe(res=>{
      this.comision_retenida=res[0].comision;
      this.SalidaVendedoresForm.get('vendedor_comision_retenida').setValue(this.comision_retenida);
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

  AgregarVendedor(){
      // console.log(this.SalidaVendedoresForm)
    if(this.Vendedores.length>0){
      if(!this.Vendedores.some(e=>e.id==this.SalidaVendedoresForm.value.vendedor_nombre.id)){
        this.AgregarVendedorEnVerdad()
      }else{
        this.ResetearVendedor();
      }
    }else{
      this.AgregarVendedorEnVerdad()
    }
  }

  AgregarVendedorEnVerdad(){
    this.Vendedores.push({
      numero: this.Vendedores.length+1,
      vendedor: this.SalidaVendedoresForm.value.vendedor_nombre,
      id: this.SalidaVendedoresForm.value.vendedor_nombre.id,
      nombre: this.SalidaVendedoresForm.value.vendedor_nombre.nombre,
      comision_efectiva: this.SalidaVendedoresForm.value.vendedor_comision_efectiva,
      comision_retenida: this.SalidaVendedoresForm.value.vendedor_comision_retenida
    }); 

    this.ResetearVendedor()

    this.SalidaVendedoresForm.get("vendedores").setValue(this.Vendedores);
    this.ListadoVendedores.AgregarInformacion(this.Vendedores);
  }

  ResetearVendedor(){
    this.SalidaVendedoresForm.get('vendedor_nombre').setValue("");
    this.SalidaVendedoresForm.get('vendedor_comision_efectiva').setValue(null);
    this.SalidaVendedoresForm.get('vendedor_comision_retenida').setValue(this.comision_retenida);
  }

  EliminarVendedor(id_vendedor){
    this.Vendedores.forEach((item,index)=>{
      if(item.id==id_vendedor){
        this.Vendedores.splice(index,1);
        // console.log("a")
      }
    })
    // this.Vendedores.filter( e => e.id !== id_vendedor);
    this.ListadoVendedores.AgregarInformacion(this.Vendedores);
  }

  CrearProducto():FormGroup{
    return this.FormBuilder.group({
      'id':[{value:null, disabled:false},[
      ]],
      'producto':[{value:null, disabled:false},[
      ]],
      'descripcion':[{value:null, disabled:false},[
      ]],
      'cantidad':[{value:null, disabled:false},[
      ]],
    })
  }

  AgregarProducto():void{
    this.productos = this.SalidaVendedoresForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto())
  };

  EliminarProducto(producto,i){
    this.productos.removeAt(i);
  };

  VendedorSeleccionado(event){
    this.SalidaVendedoresForm.get('vendedor_comision_efectiva').setValue(event.option.value.comision)
    this.ListarVendedor("");
  }
  
  ListarVendedor(nombre){
    this.Global.ListarVendedor("",nombre,"",1,5)
    .pipe(
      distinctUntilChanged(),
      debounceTime(200)
    )
    .subscribe( res => {
      this.Vendedor=res;
    });
  }

  ListarProductos(filtro){
    this.Articulos.ListarStock(this.FiltroAlmacen.value.nombre, '', '', '', filtro, 1, 20, 'descripcion asc').subscribe(res=>{
      this.Producto=res['data'].stock;
      for (let i of this.SalidaVendedoresForm['controls'].productos.value) {
        if (i.producto) {
          this.EliminarElemento(this.Producto,i.producto.id_producto)
        }
      }
    });
  }

  ProductoSeleccionado(event,index){
    this.SalidaVendedoresForm.get('productos')['controls'][index].get('descripcion').setValue(event.option.value.descripcion)
    this.SalidaVendedoresForm.get('productos')['controls'][index].get('id').setValue(event.option.value.id_producto)
    this.ListarProductos("");
  }

  EliminarElemento(array,value){
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
      data:{almacen:this.FiltroAlmacen.value.nombre, id_producto:producto.value.id, precio:producto.precio, series:this.Series}
    });

    serieventana.afterClosed().subscribe(res=>{
      if (res) {
        this.EliminarElemento(this.Series,res[0].id_producto);

        let ip:number=0;
        res.forEach((item,index)=>{
          this.Series.push({
            id_producto:item.id_producto,
            id_serie: item.id_serie,
            serie: item.serie,
            precio: item.precio,
            cantidad:item.cantidad,
            considerar:item.considerar
          })
          if(item.considerar){
            ip++
          }
          if(res.length==index+1){
            // this.SalidaVendedoresForm.get('productos')['controls'][index].get('cantidad').setValue(ip)
            producto.get('cantidad').setValue(ip)
          }
        }) 
      }
    })
  }

  AgregarTalonario() {
    const  VentanaTalonarios = this.Dialogotalon.open(VentanaTalonarioComponent, {
      width: '800px',
      data: this.talonarios,
    });

    VentanaTalonarios.afterClosed().subscribe(res=>{
      this.talonarios=res;
      this.SalidaVendedoresForm.get("talonarios").setValue(res);
    })

  }

  ResetearForm(event){
    this.ResetearFormArray(this.productos);
    this.Series=[];
    this.Articulos.ListarStock(event.value, '', '', '', '', 1, 20, 'descripcion asc').subscribe(res=>{
      this.Producto=res['data'].stock
    })
  }

  ResetearFormArray = (formArray: FormArray) => {
    if (formArray) {
      formArray.reset()
      while (formArray.length !== 1) {
        formArray.removeAt(0)
      }
    }
  }

  Atras(){
    this.location.back()
  }

  Guardar(formulario){

    let destinos:string="";
    let id_cabecera:number;

    for (let i of this.departamentos) {
      destinos=i.name +", " +destinos
    }

    this.Servicio.Agregar(
      formulario.value.pecosa,
      formulario.value.sucursal,
      formulario.value.fecha_salida,
      destinos,
      formulario.value.guia_remision,
      formulario.value.placa,
      formulario.value.dni,
      formulario.value.chofer,
      formulario.value.observacion
    ).subscribe(res=>{

      console.log(res);

      // Crear transaccion en el almacen
      console.log(this.Series)
      this.Series.forEach((item)=>{
        if(item.considerar){
          this.Servicio.AgregarProducto(
            res.data,
            item.id_serie,
            item.precio
          ).subscribe(res2=>console.log(res2))
        }
      })

      // Grabar datos de vendedor
      console.log(this.Vendedores);
      this.Vendedores.forEach((item)=>{
        this.Servicio.AgregarVendedor(
          res.data,
          item.id,
          item.comision_efectiva,
          item.comision_retenida
        ).subscribe(res2=>console.log(res2))
      })

      // Grabar datos de los talonarios
      this.talonarios.forEach((item)=>{
        for(let i=item.id_numero_inicio; i<=item.id_numero_fin; i++){
          this.Servicio.AgregarTalonarios(
            res.data,
            i
          ).subscribe(res2=>console.log(res2))
        }
      })

      this.snackBar.open("La salida se guardó satisfactoriamente", '', {
        duration: 2000,
      });

      setTimeout(()=>{
        this.Atras()
      },1000)

    });
  }
}

export class VendedoresDataSource implements DataSource<any> {

  public Informacion = new BehaviorSubject<any[]>([]);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect(){
    this.Informacion.complete();
  }

  AgregarInformacion(array){
    this.Informacion.next(array)
  }

}