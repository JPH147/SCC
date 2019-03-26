import { Component, OnInit, Inject } from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ServiciosTipoPago} from '../../global/tipopago';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {SeleccionarClienteComponent} from '../seleccionar-cliente/seleccionar-cliente.component';
import {ServiciosTelefonos} from '../../global/telefonos';
import {ServiciosDirecciones} from '../../global/direcciones';

@Component({
  selector: 'app-agregar-venta',
  templateUrl: './agregar-venta.component.html',
  styleUrls: ['./agregar-venta.component.css'],
  providers: [ServiciosTipoPago, ServiciosTelefonos, ServiciosDirecciones]
})
export class AgregarVentaComponent implements OnInit {

  public ClienteForm: FormGroup;
  public VentaForm: FormGroup;
  public DocumentoForm: FormGroup;
  public ProductoForm: FormGroup;
  public productos: FormArray;
  public LstTipoPago: Array<any>;
  public LstContrato: Array<any>;
  public cliente:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<AgregarVentaComponent>,
    private Builder: FormBuilder,
    private ServicioTipoPago: ServiciosTipoPago,
    private TelefonoServicio: ServiciosTelefonos,
    private DireccionServicio: ServiciosDirecciones,
    private Dialogo: MatDialog
  ) { }

  ngOnInit() {
    this.ListarTipoPago();
    this.LstContrato=this.data.talonario;
    this.CrearFormularios();
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
      ]],
      domicilio: [null, [
      ]],
      id_telefono: [null, [
      ]],
      telefono: [null, [
      ]],
    })

    this.VentaForm = this.Builder.group({
      fecha:[new Date(),[
        Validators.required
      ]],
      contrato:[null,[
        Validators.required
      ]],
      lugar:["",[

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
      montototal: [0, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      cuotas: [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      inicial: [0, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
    })

    this.ProductoForm = this.Builder.group({
      id_producto: [{value: null, disabled: false}, [
        Validators.required
      ]],
      descripcion: [{value: null, disabled: false}, [
      ]],
      id_serie: [{value: null, disabled: false}, [
        Validators.required
      ]],
      serie: [{value: null, disabled: false}, [
      ]],
      precio: [{value:null, disabled: false}, [
        Validators.required,
        Validators.min(1),
        Validators.pattern ('[0-9- ]+')
      ]],
      estado: [{value:1, disabled: false}, [
      ]],
    })
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago().subscribe( res => {
      this.LstTipoPago = [];
      // tslint:disable-next-line:forin
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
      console.log(res);
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
      if (res) {
        this.ClienteForm.get('id_direccion').setValue(res['data'].direcciones[0].id);
        this.ClienteForm.get('domicilio').setValue(res['data'].direcciones[0].direccioncompleta);
      }
    });
  }

  ObtenerTelefono(id_cliente) {
    this.TelefonoServicio.ListarTelefono( id_cliente , '1',1,20).subscribe(res => {
      if (res) {
        this.ClienteForm.get('id_telefono').setValue(res['data'].telefonos[0].id);
        this.ClienteForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
      }
    });
  }

}
