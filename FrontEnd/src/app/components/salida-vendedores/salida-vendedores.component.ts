import { Component, OnInit,  ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl} from '@angular/forms';
import {Observable, fromEvent, BehaviorSubject} from 'rxjs';
import {COMMA} from '@angular/cdk/keycodes';
import { tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SalidaVendedoresService} from './salida-vendedores.service';
import {ServiciosGenerales, Almacen} from '../global/servicios';
import {ServiciosVentas} from '../global/ventas';
import { ventanaseriessv } from './ventana-seriessv/ventanaseriessv';
import {StockService} from '../stock/stock.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {Location} from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {ProductosDataSource , TalonariosDataSource } from '../retorno-vendedores/retorno-vendedores.component';
import {ViaticosDataSource} from '../retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import {ListadoSalidaVendedoresService} from '../listado-salida-vendedores/listado-salida-vendedores.service';
// import {GastosSalidaDataSource} from '../listado-salida-vendedores/ventana-emergente-gastos/ventanaemergente-gastos';
import {ServiciosProductoSerie} from '../global/productoserie';

@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.scss'],
  providers: [SalidaVendedoresService,ServiciosGenerales,ServiciosVentas,StockService,ListadoSalidaVendedoresService,ServiciosProductoSerie]
})

export class SalidaVendedoresComponent implements OnInit {
  
  public Cargando = new BehaviorSubject<boolean>(false);

  @ViewChild('InputVendedor') FiltroVendedor: ElementRef;
  @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;
  @ViewChild('InputAlmacen') FiltroAlmacen: MatSelect;
  @ViewChild('InputProductoEditar') FiltroProductoEditar: ElementRef;
  public SalidaVendedoresForm:FormGroup;
  public Sucursales: Array<any>;
  public Vendedor: Array<any>;
  public Almacenes:Almacen[];
  public Producto: Array<any>;
  public ProductoEditar: Array<any>;
  public Talonarios: Array<any>;
  public Numeros: Array<any>;
  public productos: FormArray;
  public Hoy= new Date();
  public editar_productos: boolean;
  readonly separatorKeysCodes: number[] = [ COMMA];
  public departamentos: any[] = [];

  // Ver la salida
  public id_salida:number;

  public Series: Array<any>;

  public TalonarioSeries: Array<any>;
  public talonarios: Array<any>;
  public comision_retenida:number;

  // Editar la salida
  public id_salida_editar:number;

  // Tabla de vendedores
  public ListadoVendedores: VendedoresDataSource;
  public Columnas: string[];
  public Vendedores: Array<any> = [];

  // Tabla de productos cuando para ver la salida
  public ListadoProductos: ProductosDataSource;
  public ColumnasProductos: string[] = [ 'numero','producto', 'serie', 'precio_venta', 'precio_minimo', 'estado', 'opciones'];

  // Tabla de productos cuando se va a editar
  public ListadoProducto : ProductoDataSource;
  public ColumnasProducto: string[] = [ 'numero','descripcion', 'cantidad', 'fecha_grande', 'opciones'];

  // Tabla de talonarios para ver
  public ListadoTalonarios: TalonariosDataSource;
  public ColumnasTalonarios: string[] = ['numero', 'contrato', 'estado', 'observaciones', 'opciones'];
  
  // Tabla de talonarios para agregar y editar
  public ListadoTalonario: TalonarioDataSource;
  public ColumnasTalonario: string[]; // Se definen cuando se selecciona la salida

  // Tabla de viáticos
  //------ Para vista
  public ListadoViaticos: ViaticosDataSource;
  public ColumnasViaticos: string[] = ['numero', 'vendedor', 'monto_grupal', 'monto_individual']

  //------ Para edición
  public ListadoGastos: GastosDataSource;
  public GastosColumnas: string[] = [ 'numero', 'fecha', 'vendedor', 'monto', 'tipo', 'observacion', 'opciones'];
  public VendedoresViaticos: Array<any> = [];
  public Viaticos : Array<any> = [];

  constructor(
    private snackBar: MatSnackBar,
    private DialogoSerie: MatDialog,
    private Servicio: SalidaVendedoresService,
    private FormBuilder: FormBuilder,
    private Global: ServiciosGenerales,
    private Ventas:ServiciosVentas,
    private Articulos: StockService,
    private route: ActivatedRoute,
    private location: Location,
    private LServicios: ListadoSalidaVendedoresService,
    private PServicio: ServiciosProductoSerie
  ) { }

  ngOnInit() {
    
    this.ListadoVendedores = new VendedoresDataSource();
    this.ListadoTalonarios = new TalonariosDataSource(this.Servicio);
    this.ListadoTalonario = new TalonarioDataSource();
    this.ListadoViaticos = new ViaticosDataSource(this.Servicio);
    this.ListadoGastos = new GastosDataSource();
    this.ListadoProductos = new ProductosDataSource(this.Servicio);
    this.ListadoProducto = new ProductoDataSource();

    this.talonarios=[];
    this.Talonarios=[];
    this.ListarVendedor("");
    this.ListarTalonarios();
    this.Series = [];

    this.ConsultarComisionRetenida();

    this.Global.ListarSucursal(null,"").subscribe(res=>this.Sucursales=res);
    // this.Global.ListarAlmacen().subscribe(res=>this.Almacenes=res);

    this.CrearFormulario();

    this.route.params.subscribe(params => {
      // Verifica si 'params' tiene datos
      if(Object.keys(params).length>0){

        this.Cargando.next(true);

        if(params['idsalida']){
          this.id_salida=params['idsalida'];
          this.SeleccionarSalida(this.id_salida);
        }

        if(params['idsalidaeditar']){
          this.id_salida_editar=params['idsalidaeditar'];
          // this.id_salida_editar=67;
          this.SeleccionarSalida(this.id_salida_editar);
        }

      }else{
       this.NuevaSalida();
      }
    })
  }

  CrearFormulario(){
    this.SalidaVendedoresForm = this.FormBuilder.group({
      numero_pecosa: [{value: null, disabled: false}, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      pecosa: [{value: null, disabled: false}, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      sucursal: [{value: null, disabled: false}, [
        Validators.required
      ]],
      fecha_salida: [{value: new Date(), disabled: false}, [
        Validators.required
      ]],
      destino: ["", [
        Validators.required,
      ]],
      guia_remision: ["", [
        Validators.required
      ]],
      observacion: [{value:"", disabled:false}, [
      ]],
      estado: [{value:null, disabled: false},[
      ]],
      // Movilidad de la cooperativa -----------------------------------
      movilidad_propia:[{value:false, disabled:false},[
      ]],
      placa: [{value:"", disabled:false}, [
      ]],
      dni: [{value:"", disabled:false}, [
      ]],
      chofer: [{value:"", disabled:false}, [
      ]],
      //-----------------------------------------------
      // Para los vendedores ----------------------------------------------
      vendedor: [{value:null, disabled:false}, [
      ]],
      vendedor_id: [{value:null, disabled:false}, [
      ]],
      vendedor_nombre: [{value:null, disabled:false}, [
      ]],
      vendedor_comision_efectiva: [{value:null, disabled:false}, [
        Validators.max(99),
        Validators.pattern ('[0-9- ]+')
      ]],
      vendedor_comision_retenida:[{value:this.comision_retenida,disabled:false},[
        Validators.max(99),
        Validators.pattern ('[0-9- ]+')
      ]],
      vendedores: [{value:0, disabled:false}, [
        Validators.required,
        Validators.min(1)
      ]],
      // ------------------------------------------------
      // Para los talonarios ---------------------------------------------
      fecha_talonarios: [{value:new Date(), disabled:false}, [
      ]],
      talonarios: [{value:0, disabled:false}, [
        Validators.min(1)
      ]],
      serie:[{value:0, disabled:false},[
        Validators.required,
      ]],
      numero_inicio:[{value:null, disabled:false},[
        Validators.required,
      ]],
      numero_fin:[{value:null, disabled:false},[
        Validators.required,
      ]],
      id_numero_inicio:[{value:null, disabled:false},[
      ]],
      id_numero_fin:[{value:null, disabled:false},[
      ]],
      // -----------------------------------------
      // Para los gastos de viáticos --------------------------------------
      gasto_vendedor:[{value: 0, disabled: false},[
      ]],
      gasto_monto:[{value: null, disabled: false},[
        // Validators.required
      ]],
      gasto_fecha:[{value: new Date(), disabled: false},[
        // Validators.required
      ]],
      gasto_tipo:[{value: null, disabled: false},[
        // Validators.required
      ]],
      gasto_observacion:[{value: "", disabled: false},[
      ]],
      // -----------------------------------------
      // Para los productos -----------------------------------------------
      almacen: [{value: null, disabled: false}, [
        Validators.required
      ]],
      producto_editar: [{value: null, disabled: false}, [
      ]],
      id_producto_editar: [{value: null, disabled: false}, [
      ]],
      descripcion_editar: [{value: null, disabled: false}, [
      ]],
      cantidad_editar: [{value: 0, disabled: false}, [
      ]],
      fecha_productos: [{value: new Date(), disabled: false}, [
        Validators.required
      ]],
      productos: this.FormBuilder.array([this.CrearProducto()])
    });
  }

  NuevaSalida(){
    this.ProximoNumero();
    this.SalidaVendedoresForm.get('fecha_salida').setValue(new Date());
    this.Columnas = ["numero", "nombre", "comision_efectiva", "comision_retenida", "opciones"];
    this.ColumnasTalonario= [ 'numero','serie', 'inicio', 'fin', 'fecha_talonario','opciones'];
  }

  ProximoNumero(){
    let codigo: string;
    let largo: number;

    this.Servicio.ObtenerNumero().subscribe(res=>{
      if(res>0){
        this.SalidaVendedoresForm.get('numero_pecosa').setValue(res);
        codigo=res.toString();
        largo=codigo.length;
        
        for(let i=0; i<8-largo; i++){
          codigo="0"+codigo;
          this.SalidaVendedoresForm.get('pecosa').setValue(codigo);
        }
      }
    })
  }

  SeleccionarSalida(id_salida){

    this.Servicio.SeleccionarSalida(id_salida).subscribe(res=>{

      this.Cargando.next(false);
      this.SalidaVendedoresForm.get('numero_pecosa').setValue(res['data'].pecosa);
      this.SalidaVendedoresForm.get('pecosa').setValue(res['data'].pecosa);
      this.SalidaVendedoresForm.get('sucursal').setValue(res['data'].sucursal);
      this.SalidaVendedoresForm.get('guia_remision').setValue(res['data'].guia);
      this.SalidaVendedoresForm.get('destino').setValue(res['data'].destino);
      this.SalidaVendedoresForm.get('almacen').setValue(res['data'].almacen);
      this.SalidaVendedoresForm.get('estado').setValue(res['data'].estado);

      if(res['data'].vehiculo_placa){
        this.SalidaVendedoresForm.get('movilidad_propia').setValue(true);
        this.SalidaVendedoresForm.get('placa').setValue(res['data'].vehiculo_placa);
        this.SalidaVendedoresForm.get('dni').setValue(res['data'].chofer_dni);
        this.SalidaVendedoresForm.get('chofer').setValue(res['data'].chofer_nombre);
      }

      // Se quita la opción de obligatorio en el FormArray que se crea
      this.SalidaVendedoresForm['controls'].productos['controls'][0].get('id').setValue("JP")
      this.SalidaVendedoresForm['controls'].productos['controls'][0].get('cantidad').setValue(null)

      this.Vendedores=res['data'].vendedores.vendedores;
      this.VendedoresViaticos=res['data'].vendedores.vendedores;
      // console.log(this.VendedoresViaticos);
      // this.ListadoVendedores.AgregarInformacion(this.Vendedores)
      
      this.ListadoProductos.CargarInformacion(id_salida,0);
      this.ListadoTalonarios.CargarInformacion(id_salida, 0);
      this.ListadoViaticos.CargarInformacion(id_salida);
      
      if(this.id_salida){
        // Para los vendedores
        this.Columnas = [ 'numero','nombre', 'comision_efectiva', 'comision_retenida'];
        this.ColumnasTalonario = [ 'numero','serie', 'inicio', 'fin', 'opciones'];

        this.SalidaVendedoresForm.get('fecha_salida').setValue(moment(res['data'].fecha).format('DD/MM/YYYY'));
        this.SalidaVendedoresForm.get('observacion').setValue(res['data'].observacion ? res['data'].observacion : "No hay observaciones");

        if(res['data'].id_estado == 2){
          this.Servicio.ListarComisiones(this.id_salida).subscribe(res=>{
            this.ListadoVendedores.AgregarInformacion(res);
          })
        }else{
          this.ListadoVendedores.AgregarInformacion(this.Vendedores);
        }

      }
      
      if(this.id_salida_editar){

        this.SalidaVendedoresForm.get('fecha_salida').setValue( new Date(res['data'].fecha));
        
        // Para los vendedores
        this.Columnas = [ 'numero','nombre', 'comision_efectiva', 'comision_retenida', 'opciones']
        this.ListadoVendedores.AgregarInformacion(this.Vendedores);
        this.ColumnasTalonario= [ 'numero','serie', 'inicio', 'fin', 'fecha_talonario','opciones'];

        // Datos que no se cambian
        this.SalidaVendedoresForm.get('numero_pecosa').clearValidators();
        this.SalidaVendedoresForm.get('pecosa').clearValidators();
        this.SalidaVendedoresForm.get('sucursal').clearValidators();
        this.SalidaVendedoresForm.get('pecosa').disable();
        this.SalidaVendedoresForm.get('sucursal').disable();
        // this.SalidaVendedoresForm.get('almacen').setValue(res['data'].almacen);
        this.SalidaVendedoresForm.get('almacen').clearValidators();

        // Inicialmente, ningún campo es obligatorio
        this.SalidaVendedoresForm.get('gasto_monto').clearValidators();
        this.SalidaVendedoresForm.get('gasto_tipo').clearValidators();
        this.SalidaVendedoresForm.get('numero_inicio').clearValidators();
        this.SalidaVendedoresForm.get('numero_fin').clearValidators();
        this.SalidaVendedoresForm.get('vendedores').clearValidators();
        this.SalidaVendedoresForm.get('talonarios').clearValidators();
        this.SalidaVendedoresForm.get('gasto_monto').setValue(null);
        this.SalidaVendedoresForm.get('gasto_tipo').setValue(null);
        this.SalidaVendedoresForm.get('numero_inicio').setValue(null);
        this.SalidaVendedoresForm.get('numero_fin').setValue(null);
        this.SalidaVendedoresForm.get('vendedores').setValue(0);
        this.SalidaVendedoresForm.get('talonarios').setValue(0);

        // Para los productos
        this.editar_productos=false;
        this.ProductoEditar=res['data'].productos.productos;
        this.ListadoProducto.AgregarInformacion(this.ProductoEditar);
        this.ListarProductos("");
        // this.PServicio.ListarAlmacenSucursal(res['data'].id_almacen).subscribe(res=>{
        //   this.Almacenes=res;
        // })

        // Para los viáticos
        this.Viaticos = res['data'].viaticos.gastos;
        this.ListadoGastos.AgregarInformacion(this.Viaticos);

        // Para los talonarios
        this.Talonarios=res['data'].talonarios.talonarios;
        this.ListarTalonarios()
        this.SalidaVendedoresForm.get('talonarios').setValue(this.TalonarioSeries.length);
        this.ListadoTalonario.AgregarInformacion(this.Talonarios);
      }

    })
    
  }

  ngAfterViewInit(){

    if(!this.id_salida && !this.id_salida_editar){
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

    if(this.id_salida_editar){
      fromEvent(this.FiltroProductoEditar.nativeElement,'keyup')
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        tap(()=>{
          this.ListarProductos(this.FiltroProductoEditar.nativeElement.value)
        })
      ).subscribe()
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

  SucursalSeleccionada(evento){
    this.SalidaVendedoresForm.get('almacen').setValue(null);
    this.PServicio.ListarAlmacenSucursal(evento.value).subscribe(res=>{
      this.Almacenes=res;
    })
  }

  CambioMovilidad(evento){
    if(evento.checked){
      this.SalidaVendedoresForm.get('placa').setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(7)]);
      this.SalidaVendedoresForm.get('dni').setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
      this.SalidaVendedoresForm.get('chofer').setValidators([Validators.required]);
    }else{
      this.SalidaVendedoresForm.get('placa').clearValidators();
      this.SalidaVendedoresForm.get('dni').clearValidators();
      this.SalidaVendedoresForm.get('chofer').clearValidators();
      this.SalidaVendedoresForm.get('placa').setValue("");
      this.SalidaVendedoresForm.get('dni').setValue("");
      this.SalidaVendedoresForm.get('chofer').setValue("");
    }
  }

  AgregarVendedor(){
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
      vendedor: this.SalidaVendedoresForm.value.vendedor,
      id: this.SalidaVendedoresForm.value.vendedor.id,
      nombre: this.SalidaVendedoresForm.value.vendedor_nombre,
      comision_efectiva: this.SalidaVendedoresForm.value.vendedor_comision_efectiva,
      comision_retenida: this.SalidaVendedoresForm.value.vendedor_comision_retenida
    }); 

    this.ResetearVendedor()

    this.SalidaVendedoresForm.get("vendedores").setValue(this.Vendedores.length);
    this.ListadoVendedores.AgregarInformacion(this.Vendedores);
  }

  ListarVendedor(nombre){
    this.Global.ListarVendedor("",nombre,"",1,5)
    .pipe(
      distinctUntilChanged(),
      debounceTime(200)
    )
    .subscribe( res => {
      this.Vendedor=res;

      if (this.Vendedores.length>0) {
        this.Vendedores.forEach((item)=>{
          this.Vendedor=this.Vendedor.filter(e=>e.id!=item.id)
        })
      }

    });
  }

  VendedorSeleccionado(event){
    this.SalidaVendedoresForm.get('vendedor_comision_efectiva').setValue(event.option.value.comision);
    this.SalidaVendedoresForm.get('vendedor_nombre').setValue(event.option.value.nombre);
    this.SalidaVendedoresForm.get('vendedor_id').setValue(event.option.value.id);
    this.ListarVendedor("");
  }

  RemoverVendedor(){
    this.SalidaVendedoresForm.get('vendedor_comision_efectiva').setValue(null);
    this.SalidaVendedoresForm.get('vendedor_nombre').setValue(null);
    this.SalidaVendedoresForm.get('vendedor').setValue("");
    this.SalidaVendedoresForm.get('vendedor_nombre').setValue("");
    this.SalidaVendedoresForm.get('vendedor_id').setValue(null);
    this.ListarVendedor("");
  }

  ResetearVendedor(){
    this.SalidaVendedoresForm.get('vendedor_id').setValue(null);
    this.SalidaVendedoresForm.get('vendedor').setValue(null);
    this.SalidaVendedoresForm.get('vendedor_nombre').setValue("");
    this.SalidaVendedoresForm.get('vendedor_comision_efectiva').setValue(null);
    this.SalidaVendedoresForm.get('vendedor_comision_retenida').setValue(this.comision_retenida);
  }

  EliminarVendedor(id_vendedor){
    this.Vendedores = this.Vendedores.filter(e => e.id != id_vendedor)
    this.ListadoVendedores.AgregarInformacion(this.Vendedores);
  }

  EditarVendedor(vendedor){
    this.SalidaVendedoresForm.get('vendedor_id').setValue(vendedor.id);
    this.SalidaVendedoresForm.get('vendedor_nombre').setValue(vendedor.vendedor);
    this.SalidaVendedoresForm.get('vendedor_comision_efectiva').setValue(vendedor.comision_efectiva);
    this.SalidaVendedoresForm.get('vendedor_comision_retenida').setValue(vendedor.comision_retenida);
  }

  ActualizarVendedor(){
    this.EliminarVendedor(this.SalidaVendedoresForm.value.vendedor_id);

    this.Vendedores.push({
      numero: this.Vendedores.length+1,
      id_salida_vendedor: this.SalidaVendedoresForm.value.vendedor_id,
      id: 147, // Se coloca para que no haya problemas con el botón de actualizar que se desactiva
      vendedor: this.SalidaVendedoresForm.value.vendedor_nombre,
      comision_efectiva: this.SalidaVendedoresForm.value.vendedor_comision_efectiva,
      comision_retenida: this.SalidaVendedoresForm.value.vendedor_comision_retenida,
      nuevo: true
    }); 

    this.ResetearVendedor()

    this.SalidaVendedoresForm.get("vendedores").setValue(this.Vendedores.length);
    this.ListadoVendedores.AgregarInformacion(this.Vendedores);

  }

  CrearProducto():FormGroup{
    return this.FormBuilder.group({
      'id':[{value:null, disabled:false},[
        Validators.required
      ]],
      'producto':[{value:null, disabled:false},[
      ]],
      'descripcion':[{value:null, disabled:false},[
      ]],
      'cantidad':[{value:0, disabled:false},[
        Validators.min(1)
      ]],
    })
  }

  AgregarProducto():void{
    this.productos = this.SalidaVendedoresForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto())
  };

  EliminarProducto(id,i){
    this.productos.removeAt(i);
    this.EliminarElemento(id,1);
  };

  EliminarProductoEditar(id_producto){
    this.ProductoEditar=this.ProductoEditar.filter(e=>(e.id_producto != id_producto && e.nuevo) || !e.nuevo);
    this.ListadoProducto.AgregarInformacion(this.ProductoEditar);
    this.EliminarElemento(id_producto,1);
  }

  ListarProductos(filtro){
    if(this.id_salida_editar){
      this.Articulos.ListarStock(this.SalidaVendedoresForm.value.almacen, '', '', '', filtro, 1, 20, 'descripcion asc').subscribe(res=>{
        this.Producto=res['data'].stock;
        this.ProductoEditar.forEach((item)=>{
          if(item.nuevo){
            // console.log("Nuevo")
            // console.log(item);
            this.EliminarElemento(item.id_producto, 2)
          }
        })
      });
    }else{
      this.Articulos.ListarStock(this.FiltroAlmacen.value.nombre, '', '', '', filtro, 1, 20, 'descripcion asc').subscribe(res=>{
        this.Producto=res['data'].stock;
        for (let i of this.SalidaVendedoresForm['controls'].productos.value) {
          if (i.producto) {
            this.EliminarElemento(i.producto.id_producto, 2)
          }
        }
      });
    }
  }

  ProductoSeleccionado(event,index){
    this.SalidaVendedoresForm.get('productos')['controls'][index].get('descripcion').setValue(event.option.value.descripcion)
    this.SalidaVendedoresForm.get('productos')['controls'][index].get('id').setValue(event.option.value.id_producto)
    this.ListarProductos("");
  }

  ProductoSeleccionadoEditar(event){
    this.SalidaVendedoresForm.get('id_producto_editar').setValue(event.option.value.id_producto);
    this.SalidaVendedoresForm.get('descripcion_editar').setValue(event.option.value.descripcion);
    this.ListarProductos("");
  }

  RemoverProductoEditar(){
    this.SalidaVendedoresForm.get('id_producto_editar').setValue(null);
    this.SalidaVendedoresForm.get('descripcion_editar').setValue(null);
    this.SalidaVendedoresForm.get('producto_editar').setValue("");
    this.ListarProductos("");
  }

  EditarSeries(id_producto, descripcion, fecha){

    const serieventana = this.DialogoSerie.open(ventanaseriessv, {
      width: '800px',
      data:{almacen:this.SalidaVendedoresForm.value.almacen, id_producto:id_producto, series:this.Series, ver: true}
    });

    serieventana.afterClosed().subscribe(res=>{

      let productos: Array<any> = this.ProductoEditar;
      let productos_completo: Array<any> = this.ProductoEditar;
      let ip:number=0;
      let numero=this.ProductoEditar.length+this.Series.length;

      if (res) {
        
        // console.log(this.Series);

        this.ProductoEditar=this.ProductoEditar.filter(e=>(e.id_producto != id_producto && e.nuevo) || !e.nuevo);

        this.EliminarElemento(id_producto,1);

        // console.log(this.Series);

        res.forEach((item,index)=>{

          numero = numero+1;

          this.Series.push({
            numero: numero,
            id_producto: item.id_producto,
            descripcion: descripcion,
            fecha: fecha,
            id_serie: item.id_serie,
            serie: item.serie,
            precio: item.precio,
            cantidad: 1,
            considerar:item.considerar
          })

          if(item.considerar){
            ip++
          }

          if(res.length==index+1){
            this.SalidaVendedoresForm.get('cantidad_editar').setValue(ip);
          }
        }) 

        // console.log(this.Series)        

      }

      // Se agrega el resumen de los productos
      if(ip>0){
        this.ProductoEditar.push({
          numero: this.ProductoEditar.length+1,
          id_producto: id_producto,
          descripcion: descripcion,
          fecha: fecha,
          cantidad: ip,
          nuevo: true
        })
      }

      this.ListadoProducto.AgregarInformacion(this.ProductoEditar);
    })
  }

  EliminarElemento(value,numero){
    // 1 si item.id_producto
    if(numero == 1){
      this.Series = this.Series.filter(e=> e.id_producto != value)
    }
    // 2 si item.id
    if(numero == 2){
      this.Producto = this.Producto.filter(e=> e.id_producto != value)
    }
  }

  AgregarSerieSalidaV(producto,index) {

    const serieventana = this.DialogoSerie.open(ventanaseriessv, {
      width: '800px',
      maxHeight : "80vh",
      data:{almacen:this.FiltroAlmacen.value.nombre, id_producto:producto.value.id, precio:producto.precio, series:this.Series}
    });

    serieventana.afterClosed().subscribe(res=>{
      if (res) {
        this.EliminarElemento(res[0].id_producto,1);

        let ip:number=0;
        res.forEach((item,index)=>{
          this.Series.push({
            id_producto:item.id_producto,
            id_serie: item.id_serie,
            serie: item.serie,
            precio: item.precio,
            cantidad:1,
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

  AgregarSerieSalidaVEditar(){

    // console.log(this.SalidaVendedoresForm.value.producto_editar);

    let serieventana = this.DialogoSerie.open(ventanaseriessv, {
      width: '800px',
      data:{ 
        almacen:this.SalidaVendedoresForm.value.almacen,
        id_producto:this.SalidaVendedoresForm.value.id_producto_editar,
        precio:this.SalidaVendedoresForm.value.producto_editar.precio,
        series:this.Series
      }
    });

    serieventana.afterClosed().subscribe(res=>{

      let productos: Array<any> = this.ProductoEditar;
      let productos_completo: Array<any> = this.ProductoEditar;
      let ip:number=0;
      let numero=this.ProductoEditar.length+this.Series.length;

      if (res) {

        // console.log(this.Series)

        this.EliminarElemento(res[0].id_producto,1);

        // console.log(this.Series)

        res.forEach((item,index)=>{

          numero = numero+1;

          this.Series.push({
            numero: numero,
            id_producto:item.id_producto,
            descripcion: this.SalidaVendedoresForm.value.descripcion_editar,
            fecha: this.SalidaVendedoresForm.value.fecha_productos,
            id_serie: item.id_serie,
            serie: item.serie,
            precio: item.precio,
            cantidad: 1,
            considerar:item.considerar
          })

          if(item.considerar){
            ip++
          }

          if(res.length==index+1){
            this.SalidaVendedoresForm.get('cantidad_editar').setValue(ip);
          }
        })

      }

      if(ip>0){
        this.ProductoEditar.push({
          numero: this.ProductoEditar.length+1,
          id_producto: this.SalidaVendedoresForm.value.id_producto_editar,
          descripcion: this.SalidaVendedoresForm.value.descripcion_editar,
          fecha: this.SalidaVendedoresForm.value.fecha_productos,
          cantidad: ip,
          nuevo: true
        })
      }

      // console.log(this.Producto)
      this.ListarProductos("");
      // console.log(this.Producto)
      this.ListadoProducto.AgregarInformacion(this.ProductoEditar);

      this.SalidaVendedoresForm.get('producto_editar').setValue(null);
      this.SalidaVendedoresForm.get('id_producto_editar').setValue(null);
      this.SalidaVendedoresForm.get('descripcion_editar').setValue(null);
      this.SalidaVendedoresForm.get('cantidad_editar').setValue(0);
      this.SalidaVendedoresForm.get('fecha_productos').setValue(new Date());

    })

  }

  ListarTalonarios(){
    this.Ventas.ListarTalonarioSerie().subscribe(res=>{
      this.TalonarioSeries=res;
      if (this.Talonarios.length>0) {
        this.Talonarios.forEach((item)=>{
          this.TalonarioSeries=this.TalonarioSeries.filter(e=>e.serie!=item.serie)
        })
      }

      this.Numeros=[];

    })
  }

  AgregarNumeros(event){
    if(event.value!=0){
      // Cuando se selecciona una serie, los datos de los números son obligatorios
      this.SalidaVendedoresForm.get('numero_inicio').setValidators([Validators.required]);
      this.SalidaVendedoresForm.get('numero_fin').setValidators([Validators.required]);
      this.Ventas.ListarTalonarioNumero(event.value).subscribe(res=>{
        this.Numeros=res;
      })

    }else{
      // Si no se selecciona serie, no son obligatorios los números
      this.SalidaVendedoresForm.get('numero_inicio').clearValidators();
      this.SalidaVendedoresForm.get('numero_fin').clearValidators();
      this.Numeros=[];
    }
  }

  AgregarTalonario(){
    
    this.SalidaVendedoresForm.get('talonarios').setValue(this.Talonarios.length+1);

    this.Talonarios.push({
      numero:this.Talonarios.length+1,
      fecha:this.SalidaVendedoresForm.value.fecha_talonarios,
      serie:this.SalidaVendedoresForm.value.serie,
      numero_inicio:this.SalidaVendedoresForm.value.numero_inicio.numero,
      numero_fin:this.SalidaVendedoresForm.value.numero_fin.numero,
      id_numero_inicio:this.SalidaVendedoresForm.value.numero_inicio.id,
      id_numero_fin:this.SalidaVendedoresForm.value.numero_fin.id,
      nuevo: true
    })

    this.SalidaVendedoresForm.get('serie').setValue(0);
    this.SalidaVendedoresForm.get('numero_inicio').clearValidators();
    this.SalidaVendedoresForm.get('numero_fin').clearValidators();
    this.SalidaVendedoresForm.get('numero_inicio').setValue(null)
    this.SalidaVendedoresForm.get('numero_fin').setValue(null)

    this.ListadoTalonario.AgregarInformacion(this.Talonarios);
    this.ListarTalonarios();

  }

  EliminarTalonario(serie){
    this.SalidaVendedoresForm.get('talonarios').setValue(this.SalidaVendedoresForm.value.talonarios-1);
    this.Talonarios=this.Talonarios.filter(e=>e.serie!=serie);
    this.ListadoTalonario.AgregarInformacion(this.Talonarios);
    this.ListarTalonarios()
  };

  MinimoSeleccionado(){
    this.SalidaVendedoresForm.get('numero_fin').setValidators([
      (control: AbstractControl) => Validators.min(this.SalidaVendedoresForm.value.numero_inicio)(control),
      Validators.required
    ]);
  }
  
  MaximoSeleccionado(){
    this.SalidaVendedoresForm.get('numero_inicio').setValidators([
      (control: AbstractControl) => Validators.max(this.SalidaVendedoresForm.value.numero_fin)(control),
      Validators.required
    ]);
  }

  ResetearForm(event){
    this.ResetearFormArray(this.productos);
    this.Series=[];
    this.Articulos.ListarStock(event.value, '', '', '', '', 1, 20, 'descripcion asc').subscribe(res=>{
      this.Producto=res['data'].stock
    })
  }

  ResetearFormArray = (formArray: FormArray) => {
    let longitud: number;
    let ip : number = 0;
    if (formArray) {
      longitud=formArray.length
      formArray.reset()
      while (formArray.length > 0) {
        ip++;
        formArray.removeAt(0)
      }
      // console.log(ip, longitud)
      if(ip==longitud){
        if(!this.id_salida_editar){
          this.AgregarProducto()
        }
      }
    }
  }

  ViaticoSeleccionado(evento){

    // console.log(evento);

    this.SalidaVendedoresForm.get('gasto_monto').setValue(null);
    this.SalidaVendedoresForm.get('gasto_tipo').setValue(null);
    this.SalidaVendedoresForm.get('gasto_fecha').setValue(new Date());
    this.SalidaVendedoresForm.get('gasto_observacion').setValue("");
    
    if(evento.value==0){
      this.SalidaVendedoresForm.get('gasto_monto').clearValidators();
      this.SalidaVendedoresForm.get('gasto_tipo').clearValidators();
      this.SalidaVendedoresForm.get('gasto_monto').setValue(null);
      this.SalidaVendedoresForm.get('gasto_tipo').setValue(null);
    }else{
      this.SalidaVendedoresForm.get('gasto_monto').setValidators([Validators.required]);
      this.SalidaVendedoresForm.get('gasto_tipo').setValidators([Validators.required]);
      this.SalidaVendedoresForm.get('gasto_monto').setValue(0);
      this.SalidaVendedoresForm.get('gasto_tipo').setValue(null);
    }
  }

  AgregarGasto(){

    this.Viaticos.push({
      numero: this.Viaticos.length+1,
      fecha: this.SalidaVendedoresForm.value.gasto_fecha,
      id_vendedor: this.SalidaVendedoresForm.value.gasto_vendedor.id_vendedor,
      vendedor: this.SalidaVendedoresForm.value.gasto_vendedor.vendedor,
      monto: this.SalidaVendedoresForm.value.gasto_monto,
      id_tipo: this.SalidaVendedoresForm.value.gasto_tipo.id,
      tipo: this.SalidaVendedoresForm.value.gasto_tipo.nombre,
      observacion: this.SalidaVendedoresForm.value.gasto_observacion,
      nuevo: true
    })
    
    this.ListadoGastos.AgregarInformacion(this.Viaticos);

    this.SalidaVendedoresForm.get('gasto_monto').clearValidators();
    this.SalidaVendedoresForm.get('gasto_tipo').clearValidators();

    this.SalidaVendedoresForm.get('gasto_vendedor').setValue(0);
    this.SalidaVendedoresForm.get('gasto_monto').setValue(null);
    this.SalidaVendedoresForm.get('gasto_tipo').setValue(null);
    this.SalidaVendedoresForm.get('gasto_fecha').setValue(new Date());
    this.SalidaVendedoresForm.get('gasto_observacion').setValue("");

  }

  EliminarGasto(gasto){
    this.Viaticos = this.Viaticos.filter(e => e.numero != gasto.numero);
    this.ListadoGastos.AgregarInformacion(this.Viaticos);
  }

  SerieSeleccionada(evento){
    this.SalidaVendedoresForm.get('numero_inicio').setValue(null)
    this.SalidaVendedoresForm.get('numero_fin').setValue(null)
    if(evento.value==0){
      this.SalidaVendedoresForm.get('numero_inicio').clearValidators();
      this.SalidaVendedoresForm.get('numero_fin').clearValidators();
      this.SalidaVendedoresForm.get('numero_inicio').setValue(null)
      this.SalidaVendedoresForm.get('numero_fin').setValue(null)
    }else{
      this.SalidaVendedoresForm.get('numero_inicio').setValidators([Validators.required]);
      this.SalidaVendedoresForm.get('numero_fin').setValidators([Validators.required]);
    }
  }

  Atras(){
    this.location.back()
  }

  Guardar(formulario){
    if(!this.id_salida_editar){
      this.CrearSalida(formulario);
    }else{
      this.ActualizarSalida(formulario);
    }
  }

  CrearSalida(formulario){

    let destinos:string="";

    for (let i of this.departamentos) {
      destinos=i.name +", " +destinos
    }

    this.Servicio.Agregar(
      formulario.value.pecosa,
      formulario.value.sucursal,
      formulario.value.almacen.id,
      formulario.value.fecha_salida,
      destinos.replace(/,(\s+)?$/, ''),
      formulario.value.guia_remision,
      formulario.value.movilidad_propia,
      formulario.value.placa,
      formulario.value.dni,
      formulario.value.chofer,
      formulario.value.observacion
    ).subscribe(res=>{

      // console.log(res);

      // Crear transaccion en el almacen
      this.Series.forEach((item)=>{
        if(item.considerar){
          this.Servicio.AgregarProducto(
            res.data,
            item.id_serie,
            item.precio,
            formulario.value.fecha_salida,
          ).subscribe()
        }
      })

      // Grabar datos de vendedor
      this.Vendedores.forEach((item)=>{
        this.Servicio.AgregarVendedor(
          res.data,
          item.id,
          item.comision_efectiva,
          item.comision_retenida
        ).subscribe()
      })

      // Grabar datos de los talonarios
      // console.log(this.Talonarios)
      this.Talonarios.forEach((item)=>{
        // console.log(item)
        for(let i=item.id_numero_inicio; i<=item.id_numero_fin; i++){
          this.Servicio.AgregarTalonarios(
            res.data,
            i,
            formulario.value.fecha_salida,
          ).subscribe()
        }
      })

      if(res['codigo']==0){
        this.snackBar.open("La salida se creó satisfactoriamente", '', {
          duration: 2000,
        });
      }else{
        this.snackBar.open("Ocurrió un error al crear la salida", '', {
          duration: 2000,
        });
      }

      setTimeout(()=>{
        this.Atras()
      },1000)

    });
  }

  ActualizarSalida(formulario){

    let destinos:string="";

    // console.log(this.departamentos, this.SalidaVendedoresForm.value.destino)

    if(this.departamentos.length>0){
      for (let i of this.departamentos) {
        destinos=i.name +", " +destinos
      }
    }else{
      destinos=this.SalidaVendedoresForm.value.destino
    }

    this.Servicio.Actualizar(
      this.id_salida_editar,
      formulario.value.fecha_salida,
      destinos,
      formulario.value.guia_remision,
      formulario.value.movilidad_propia,
      formulario.value.placa,
      formulario.value.dni,
      formulario.value.chofer,
      formulario.value.observacion
    ).subscribe(res=>{

      // Se agregan los nuevos productos
      this.Series.forEach((item)=>{
        if(item.considerar){
          this.Servicio.AgregarProducto(
            this.id_salida_editar,
            item.id_serie,
            item.precio,
            formulario.value.fecha_salida,
          ).subscribe()
        }
      })

      // Se actualizan los vendedores
      this.Vendedores.forEach((item)=>{
        if(item.nuevo){
          this.Servicio.ActualizarComisionesVendedor(
            item.id_salida_vendedor,
            item.comision_efectiva,
            item.comision_retenida
          ).subscribe()
        }
      })

      // Se agregan los nuevos viáticos
      this.Viaticos.forEach((item)=>{
        if(item.nuevo){
          this.LServicios.CrearGasto(
            this.id_salida_editar,
            item.fecha,
            item.id_vendedor,
            item.monto,
            item.id_tipo,
            item.observacion
          ).subscribe()
        }
      })

      // Se agregan los nuevo talonarios
      this.Talonarios.forEach((item)=>{
        if(item.nuevo){
          for(let i=item.id_numero_inicio; i<=item.id_numero_fin; i++){
            this.Servicio.AgregarTalonarios(
              this.id_salida_editar,
              i,
              formulario.value.fecha_salida,
            ).subscribe()
          }
        }
      })

      if(res['codigo']==0){
        this.snackBar.open("La salida se actualizó satisfactoriamente", '', {
          duration: 2000,
        });
      }else{
        this.snackBar.open("Ocurrió un error al actualizar la salida", '', {
          duration: 2000,
        });
      }

      setTimeout(()=>{
        this.Atras()
      },1000)

    })
  }

  ImprimirFormulario(){
    console.log(this.SalidaVendedoresForm);
  }

}

export class VendedoresDataSource implements DataSource<any> {

  public Informacion = new BehaviorSubject<any[]>([]);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect(){
    // this.Informacion.complete();
  }

  AgregarInformacion(array){
    this.Informacion.next(array)
  }

}

export class TalonarioDataSource implements DataSource<any> {

  public InformacionTalonarios = new BehaviorSubject<any[]>([]);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTalonarios.asObservable();
  }

  disconnect(){
    // this.InformacionTalonarios.complete();
  }

  AgregarInformacion(array){
    this.InformacionTalonarios.next(array)
  }

}

export class ProductoDataSource implements DataSource<any> {

  public InformacionProductos = new BehaviorSubject<any[]>([]);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionProductos.asObservable();
  }

  disconnect(){
    // this.InformacionProductos.complete();
  }

  AgregarInformacion(array){
    // console.log(array)
    this.InformacionProductos.next(array)
  }

}

export class GastosDataSource implements DataSource<any>{

  public InformacionGastos = new BehaviorSubject<any[]>([]);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionGastos.asObservable();
  }

  disconnect(){
    // this.InformacionGastos.complete();
  }

  AgregarInformacion(array){
    this.InformacionGastos.next(array)
  }
}