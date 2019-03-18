import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatSelect, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {Observable, fromEvent, BehaviorSubject} from 'rxjs';
import {COMMA, SPACE} from '@angular/cdk/keycodes';
import {map, startWith, tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SalidaVendedoresService} from './salida-vendedores.service';
import {ServiciosGenerales, Almacen} from '../global/servicios';
import {ServiciosVentas} from '../global/ventas';
import {ProductoService} from '../productos/productos.service';
import {VentanaTalonarioComponent} from './ventana-talonario/ventana-talonario.component';
import { ventanaseriessv } from './ventana-seriessv/ventanaseriessv';
import {StockService} from '../stock/stock.service';
import {ServiciosProductoSerie} from '../global/productoserie';
import {SalidaProductosService} from '../salida-productos/salida-productos.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {Location} from '@angular/common';

@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.scss'],
  providers: [SalidaVendedoresService,ServiciosGenerales,ServiciosVentas,ProductoService,StockService,ServiciosProductoSerie,SalidaProductosService]
})

export class SalidaVendedoresComponent implements OnInit {
  
  @ViewChild('InputVendedor') FiltroVendedor: ElementRef;
  @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;
  @ViewChild('InputAlmacen') FiltroAlmacen: MatSelect;
  public SalidaVendedoresForm:FormGroup;
  public Sucursales: Array<any>;
  public Vendedor: Array<any>;
  public Almacenes:Almacen[];
  public Producto: Array<any>;
  public productos: FormArray;
  readonly separatorKeysCodes: number[] = [SPACE,COMMA];
  departamentos: any[] = [];

  public Series: Array<any>;
  public talonarios: Array<any>;
  public comision_retenida:number;

  public Hoy= new Date();

  // Tabla de vendedores
  ListadoVendedores: VendedoresDataSource;
  Columnas: string[] = [ 'numero','nombre', 'comision_efectiva', 'comision_retenida', 'opciones'];
  public Vendedores: Array<any> = [];

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
    private SSeries:ServiciosProductoSerie,
    private TransaccionService: SalidaProductosService,
    private location: Location
  ) { }

 ngOnInit() {

    this.talonarios=[];
    this.ListarVendedor("");

    this.ListadoVendedores = new VendedoresDataSource();

    // this.ListadoVendedores.AgregarInformacion();

    this.ConsultarComisionRetenida();

    this.Global.ListarSucursal(null,"").subscribe(res=>this.Sucursales=res);
    this.Global.ListarAlmacen().subscribe(res=>this.Almacenes=res);

    // El formulario se crea luego de que se obtiene la Comiión retenida actual
    this.CrearFormulario();
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
      destino: [null, [
        Validators.required,
      ]],
      guia_remision: [null, [
        Validators.required
      ]],
      almacen: [false, [
        Validators.required
      ]],
      placa: [{value:null, disabled:false}, [
        // Validators.required,
        // Validators.minLength(7)
      ]],
      dni: [{value:null, disabled:false}, [
        // Validators.required,
        // Validators.pattern ('[0-9- ]+'),
        // Validators.minLength(8)
      ]],
      chofer: [{value:null, disabled:false}, [
        // Validators.required
      ]],
      observacion: [{value:null, disabled:false}, [
      ]],
      vendedor_nombre: [{value:null, disabled:false}, [
      ]],
      vendedor_comision_efectiva: [{value:null, disabled:false}, [
      ]],
      vendedor_comision_retenida:[{value:this.comision_retenida,disabled:false},[
      ]],
      // vendedores: this.FormBuilder.array([this.CrearVendedor()]),
      productos: this.FormBuilder.array([this.CrearProducto()]),
      talonarios: [{value:null, disabled:false}, [
        Validators.required
      ]],
      vendedores: [{value:null, disabled:false}, [
        Validators.required
      ]],
    });
  }

  ngAfterViewInit(){

    fromEvent(this.FiltroVendedor.nativeElement,'keyup')
    .pipe(
      distinctUntilChanged(),
      debounceTime(200),
      tap(()=>{
        this.ListarVendedor(this.FiltroVendedor.nativeElement.value)
      })
    ).subscribe()

    this.FiltroProducto.changes.subscribe(res=>{
       // console.log(this.FiltroVendedor['_results'])
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
      this.Series.forEach((item)=>{
        if(item.considerar){
          this.Servicio.AgregarProducto(
            res.data,
            item.id_serie,
            item.precio,
            1
          ).subscribe(res2=>console.log(res2))
        }
      })

      // Grabar datos de vendedor
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