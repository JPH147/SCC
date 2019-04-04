import { Component, OnInit, Inject } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {ServiciosTipoPago} from '../../global/tipopago';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {SeleccionarClienteComponent} from '../seleccionar-cliente/seleccionar-cliente.component';
import {ServiciosTelefonos} from '../../global/telefonos';
import {ServiciosDirecciones} from '../../global/direcciones';
import { VentanaEmergenteContacto} from '../../clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {VentaService} from '../../ventas/ventas.service';
import {SalidaVendedoresService} from '../../salida-vendedores/salida-vendedores.service';

@Component({
  selector: 'app-agregar-venta',
  templateUrl: './agregar-venta.component.html',
  styleUrls: ['./agregar-venta.component.css'],
  providers: [SalidaVendedoresService,ServiciosTipoPago, ServiciosTelefonos, ServiciosDirecciones, VentaService]
})
export class AgregarVentaComponent implements OnInit {

  public ListadoProductos: ProductosDataSource;
  public Columnas: string[] = ["numero", "nombre", "serie", "precio_venta", "opciones"]

  public ClienteForm: FormGroup;
  public VentaForm: FormGroup;
  public DocumentoForm: FormGroup;
  public ProductoForm: FormGroup;
  public productos: FormArray;
  public LstTipoPago: Array<any>;
  public LstContrato: Array<any>;
  public LstProducto: Array<any>;
  public cliente:any;
  public Productos: Array<any>; // Este será el array que contenga los productos seleccionados

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<AgregarVentaComponent>,
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

    console.log(this.data);
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
      this.LstProducto=res['data'].productos
    })
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago().subscribe( res => {
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
      this.cliente=res;
      this.ClienteForm.get('id').setValue(res.id);
      this.ClienteForm.get('nombre').setValue(res.nombre);
      this.ClienteForm.get('cargo').setValue(res.cargo);
      this.ClienteForm.get('trabajo').setValue(res.trabajo);
      this.ObtenerDireccion(res.id);
      this.ObtenerTelefono(res.id);
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
      nombre: this.ProductoForm.value.producto.producto,
      serie: this.ProductoForm.value.producto.serie,
      precio_minimo: this.ProductoForm.value.producto.precio,
      precio_venta: this.ProductoForm.value.precio*1,
    })
    this.ProductoForm.reset();
    console.log(this.Productos);
    this.ListadoProductos.AgregarInformacion(this.Productos);
    this.CalcularTotal();
  }

  EliminarProducto(id_producto){
    this.Productos.forEach((item,index)=>{
      if(item.id==id_producto){
        this.Productos.splice(index,1);
      }
    })
    this.ListadoProductos.AgregarInformacion(this.Productos);
  }

  CalcularTotal(){
    this.DocumentoForm.get('montototal').setValue(0);
    this.Productos.forEach((item)=>{
      this.DocumentoForm.get('montototal').setValue(item.precio_venta+this.DocumentoForm.value.montototal)
    });
    this.DocumentoForm.get('inicial').setValidators([(control: AbstractControl) => Validators.max(this.DocumentoForm.value.montototal)(control)]);
  }

  GuardarVenta(){

    this.VentaServicio.CrearVenta(
      this.VentaForm.value.fecha,
      0,
      this.VentaForm.value.id_contrato,
      0,
      this.ClienteForm.value.id,
      this.ClienteForm.value.id_direccion,
      this.ClienteForm.value.id_telefono,
      this.ClienteForm.value.cargo,
      this.VentaForm.value.lugar,
      0,
      2,
      this.data.salida,
      6,
      this.DocumentoForm.value.tipopago,
      this.DocumentoForm.value.inicial,
      this.DocumentoForm.value.cuotas,
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
      this.VentaForm.value.observaciones
    ).subscribe(res=>{
      console.log(res)
      this.Servicio.ActualizarSalidaTalonarios(this.data.talonario.id, res['data'])
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