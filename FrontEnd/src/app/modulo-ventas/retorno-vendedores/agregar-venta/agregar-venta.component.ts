import { Component, OnInit, Inject } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {ServiciosTipoPago} from 'src/app/core/servicios/tipopago';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {SeleccionarClienteComponent} from '../../../compartido/componentes/seleccionar-cliente/seleccionar-cliente.component';
import {ServiciosTelefonos} from 'src/app/core/servicios/telefonos';
import {ServiciosDirecciones} from 'src/app/core/servicios/direcciones';
import { VentanaEmergenteContacto} from '../../../compartido/componentes/ventana-emergentecontacto/ventanaemergentecontacto';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {BehaviorSubject, Observable, forkJoin} from 'rxjs';
import {VentaService} from '../../ventas/ventas.service';
import {SalidaVendedoresService} from '../../salida-vendedores/salida-vendedores.service';
import {Notificaciones} from 'src/app/core/servicios/notificacion';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-venta',
  templateUrl: './agregar-venta.component.html',
  styleUrls: ['./agregar-venta.component.css'],
})
export class AgregarVentaComponent implements OnInit {

  public ListadoProductos: ProductosDataSource;
  public Columnas: string[] = ["numero", "nombre", "serie", "precio_venta", "opciones"]

  public cargando : boolean = false;
  public ClienteForm: FormGroup;
  public VentaForm: FormGroup;
  public DocumentoForm: FormGroup;
  public ProductoForm: FormGroup;
  public productos: FormArray;
  public LstTipoPago: Array<any>;
  public LstContrato: Array<any>;
  public LstProducto: Array<any>;
  public LstProductoTotal: Array<any>;
  public cliente:any;
  public Productos: Array<any>; // Este será el array que contenga los productos seleccionados
  public Cronograma: Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<AgregarVentaComponent>,
    private Notificacion: Notificaciones,
    private Builder: FormBuilder,
    private Servicio: SalidaVendedoresService,
    private VentaServicio: VentaService,
    private ServicioTipoPago: ServiciosTipoPago,
    private TelefonoServicio: ServiciosTelefonos,
    private DireccionServicio: ServiciosDirecciones,
    private Dialogo: MatDialog
  ) { }

  ngOnInit() {

    this.CrearFormularios();

    this.ListarTipoPago();

    // console.log(this.data);
    this.ListadoProductos = new ProductosDataSource();
    
    this.ListarProductos();
    this.Productos=[];
  }

  CrearFormularios(){

    this.ClienteForm=this.Builder.group({
      id: [null, [
        Validators.required
      ]],
      nombre: [null, [
        Validators.required
      ]],
      cargo: [null, [
      ]],
      trabajo: [null, [
      ]],
      id_direccion: [null, [
        Validators.required
      ]],
      domicilio: [null, [
      ]],
      id_telefono: [null, [
        Validators.required
      ]],
      telefono: [null, [
      ]],
    })

    this.VentaForm = this.Builder.group({
      fecha:[new Date(),[
        Validators.required,
        Validators.required
      ]],
      id_contrato:[this.data.talonario.id_talonario,[
        Validators.required
      ]],
      contrato:[this.data.talonario.contrato,[
        Validators.required
      ]],
      lugar:["",[
        Validators.required,
      ]],
      observaciones:["",[
      ]]
    })

    this.DocumentoForm = this.Builder.group({
      fechapago: [{value: new Date((new Date()).valueOf() + 1000*60*60*24*30), disabled: false}, [
        Validators.required
      ]],
      tipopago: [null, [
        Validators.required
      ]],
      cuotas: [1, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      montototal: [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      inicial: [0, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
    })

    this.ProductoForm = this.Builder.group({
      producto: [{value: null, disabled: false}, [
        Validators.required
      ]],
      precio: [{value:null, disabled: false}, [
        Validators.required,
        Validators.min(1),
        Validators.pattern ('[0-9- ]+')
      ]],
    })
  }

  ListarProductos(){
    this.Servicio.ListarSalidaProductos(this.data.salida, 1).subscribe(res=>{
      this.LstProductoTotal=res['data'].productos;
      this.LstProducto=this.LstProductoTotal;
    })
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago(2).subscribe( res => {
      this.LstTipoPago = [];
      for (let i in res) {
        this.LstTipoPago.push ( res[i] );
      }
    });
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.cliente=res;
        this.ClienteForm.get('id').setValue(res.id);
        this.ClienteForm.get('nombre').setValue(res.nombre);
        this.ClienteForm.get('cargo').setValue(res.cargo);
        this.ClienteForm.get('trabajo').setValue(res.trabajo);
        this.ObtenerDireccion(res.id);
        this.ObtenerTelefono(res.id);
      }
    })
  }

  ObtenerDireccion(id_cliente) {
    this.DireccionServicio.ListarDireccion( id_cliente, '1',1,20).subscribe(res => {
      if (res['data']) {
        this.ClienteForm.get('id_direccion').setValue(res['data'].direcciones[0].id);
        this.ClienteForm.get('domicilio').setValue(res['data'].direcciones[0].direccioncompleta);
      }
    });
  }

  ObtenerTelefono(id_cliente) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res['data']) {
        this.ClienteForm.get('id_telefono').setValue(res['data'].telefonos[0].id);
        this.ClienteForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
      }
    });
  }

  EditarContacto(){
    let VentanaContacto = this.Dialogo.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: this.cliente.id
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      this.ObtenerDireccion(this.cliente.id);
      this.ObtenerTelefono(this.cliente.id);
    })
  }

  TipoPagoSeleccionado(){
    if (this.DocumentoForm.value.tipopago==3) {
      this.DocumentoForm.get('cuotas').setValue(1);
      this.DocumentoForm.get('cuotas').disable();
      this.DocumentoForm.get('inicial').setValue(0);
      this.DocumentoForm.get('inicial').disable();
    }else{
      this.DocumentoForm.get('cuotas').enable();
      this.DocumentoForm.get('inicial').enable();
    }
  }

  AgregarProducto(){
    if(this.Productos.length>0){
      if(!this.Productos.some(e=>e.id==this.ProductoForm.value.producto.id)){
        this.AgregarProductoEnVerdad()
      }else{
        this.ProductoForm.reset();
      }
    }else{
      this.AgregarProductoEnVerdad()
    }
  }

  AgregarProductoEnVerdad(){
    this.Productos.push({
      numero: this.Productos.length+1,
      id: this.ProductoForm.value.producto.id,
      id_serie: this.ProductoForm.value.producto.id_serie,
      serie: this.ProductoForm.value.producto.serie,
      nombre: this.ProductoForm.value.producto.producto,
      precio_minimo: this.ProductoForm.value.producto.precio_minimo,
      precio_venta: this.ProductoForm.value.precio*1,
    })

    this.ProductoForm.reset();
    this.ListadoProductos.AgregarInformacion(this.Productos);
    this.CalcularTotal();
    this.VerificarProductos();
  }

  // Comprueba que los productos que se listan no estén ya agregados
  VerificarProductos(){
    if(this.Productos.length==0){
      this.LstProducto = this.LstProductoTotal;
    } else {
      this.Productos.forEach((item)=>{
        this.LstProducto = this.LstProductoTotal.filter(e => e.id != item.id)
      })
    }
  }

  EliminarProducto(id_producto){
    let ip=0;
    let longitud = this.Productos.length;
    this.Productos.forEach((item,index)=>{
      ip++;
      if(item.id==id_producto){
        this.Productos.splice(index,1);
      }
      if(ip==longitud){
        this.ListadoProductos.AgregarInformacion(this.Productos);
        this.VerificarProductos();
      }
    })
  }

  CalcularTotal(){
    this.DocumentoForm.get('montototal').setValue(0);
    this.Productos.forEach((item)=>{
      this.DocumentoForm.get('montototal').setValue(item.precio_venta+this.DocumentoForm.value.montototal)
    });
    this.DocumentoForm.get('inicial').setValidators([(control: AbstractControl) => Validators.max(this.DocumentoForm.value.montototal)(control)]);
  }

  CrearCronograma(){

    this.Cronograma=[];

    // let year = moment(this.DocumentoForm.value.fechapago).year();
    // let month = moment(this.DocumentoForm.value.fechapago).month();
    // let day = moment(this.DocumentoForm.value.fechapago).date();

    // let fecha_corregida:Date = new Date(year, month, day);

    let fecha_corregida = this.DocumentoForm.value.fechapago;

    let fecha:Date;

    // console.log(year, month, fecha_corregida)

    let monto=Math.round((this.DocumentoForm.value.montototal-this.DocumentoForm.value.inicial)*100/this.DocumentoForm.value.cuotas)/100

    for (var i = 1; i<=this.DocumentoForm.value.cuotas; i++) {

      fecha=moment(fecha_corregida).add(i-1, 'months').toDate();

      this.Cronograma.push({
        numero: i,
        fecha_vencimiento: fecha,
        monto_cuota: monto
      })

    }

  }

  Imprimir(){
    console.log(this.DocumentoForm.value.fechapago)
  }

  GuardarVenta(){

    this.cargando = true;

    this.CrearCronograma();

    this.VentaServicio.CrearVenta(
      0,
      this.VentaForm.value.fecha,
      0,
      this.VentaForm.value.id_contrato,
      0,
      this.ClienteForm.value.id,
      this.ClienteForm.value.id_direccion,
      this.ClienteForm.value.id_telefono,
      this.ClienteForm.value.cargo,
      "trabajo",
      this.VentaForm.value.lugar,
      0,
      2,
      this.data.salida,
      this.DocumentoForm.value.tipopago,
      this.DocumentoForm.value.tipopago==3 ? 0 : this.DocumentoForm.value.inicial,
      this.DocumentoForm.value.tipopago==3 ? 1 :this.DocumentoForm.value.cuotas,
      this.DocumentoForm.value.montototal,
      this.DocumentoForm.value.fechapago,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      this.VentaForm.value.observaciones,
      []
    ).subscribe(res=>{
      // console.log(res)

      // En las tablas de SALIDA ---------------------------------------->
      // Se registra la venta realizada en el talonario
      this.Servicio.ActualizarSalidaTalonarios(this.data.talonario.id, res['data']).subscribe();

      // Se registra que los productos se vendieron
      this.Productos.forEach((item)=>{
        this.Servicio.ActualizarSalidaProductos(item.id,res['data'],item.precio_venta).subscribe();
      })
      // ---------------------------------------------------------------->

      // En las tablas de ventas ---------------------------------------->
      // Se crea el cronograma
      // if (this.DocumentoForm.value.tipopago==3) { 
      //   this.VentaServicio.CrearVentaCronograma(res['data'],this.DocumentoForm.value.montototal,this.DocumentoForm.value.fechapago,2).subscribe()
      // }else{
        this.Cronograma.forEach((item)=>{
          this.VentaServicio.CrearVentaCronograma(res['data'],this.DocumentoForm.value.tipopago,item.monto_cuota,item.fecha_vencimiento,1).subscribe()
        });
      // }

        this.ventana.close(true);
        this.Notificacion.Snack("Se agregó la venta con éxito!","");
    })
  }

}

export class ProductosDataSource implements DataSource<any> {

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