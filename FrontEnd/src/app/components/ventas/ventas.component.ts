import { VentanaEmergenteArchivos } from './ventana-emergente/ventanaemergente';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VentaService} from './ventas.service';
import {VentaDataSource} from './ventas.dataservice';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule, MatIcon, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosTipoDocumento,TipoDocumento} from '../global/tipodocumento';
import {ServiciosTipoPago, TipoPago} from '../global/tipopago';
import {ClienteService, Cliente} from '../clientes/clientes.service';
import {ClienteDataSource} from '../clientes/clientes.dataservice';
import {Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {ServiciosTelefonos, Telefono} from '../global/telefonos';
import {ServiciosDirecciones, Direccion} from '../global/direcciones';

export interface PeriodicElement {
  numero: number;
  month: string;
  price: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {numero: 1, month: 'Agosto', price: '255.00'},
  {numero: 2, month: 'Setiembre', price: '255.00'}
];

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  providers: [VentaService, ServiciosTipoDocumento, ServiciosTipoPago, ClienteService, ServiciosTelefonos, ServiciosDirecciones]
})

export class VentasComponent implements OnInit {
  public ListadoCronograma: VentaDataSource;
  public ListadoCliente: ClienteDataSource;
  public LstTipoDocumento: TipoDocumento[] = [];
  public LstCliente: Array<any> = [];
  public VentasForm: FormGroup;
  public LstTipoPago: TipoPago[] = [];
  public telefono: Telefono;
  public direccion: Direccion;
  public typesdoc: string[] = [
    'Factura', 'Boleta'
  ];
  public idcliente: number;
  private sub: any;
  public states: string[] = [
    'Activo', 'Finalizado', 'Canjeado', 'Anulado'
  ];
  public displayedColumns: string[] = ['numero', 'month', 'price'];
  public dataSource = ELEMENT_DATA;
  public productos: any;
  public contador: number;

  @ViewChild('InputFechaPago') FiltroFecha: ElementRef;
  @ViewChild('InputMontoTotal') FiltroMonto: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;

  @ViewChild('Cliente') ClienteAutoComplete: ElementRef;

  constructor(
    /*@Inject(MAT_DIALOG_DATA) public data,*/
    private Servicio: VentaService,
    private ClienteServicio: ClienteService,
    private DireccionServicio: ServiciosDirecciones,
    private TelefonoServicio: ServiciosTelefonos,
    public DialogoArchivos: MatDialog,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private ServicioTipoDocumento: ServiciosTipoDocumento,
    private ServicioTipoPago: ServiciosTipoPago,
    private route: ActivatedRoute
  ) {
    this.contador = 1;
    this.productos = [{ producto: '', imei: ''} ];
    this.ListarTipoDocumento();
    this.ListarTipoPago();
    //this.ListarClientes('', '', '', '' , '', '');
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idcliente = +params['id'];
   });
    this.ObtenerClientexId();
    this.ObtenerDireccion();
    this.ObtenerTelefono();
    this.ListadoCronograma = new VentaDataSource(this.Servicio);
    this.ListadoCliente = new ClienteDataSource(this.ClienteServicio);
    this.ListarClientes('', '', '', '' , this.ClienteAutoComplete.nativeElement.value , '');
    this.ListadoCronograma.GenerarCronograma('', '', 0);
    this.VentasForm = this.FormBuilder.group({
      'talonario': [null, [
        Validators.required
      ]],
      'contrato': [null, [
        Validators.required
      ]],
      'tipodoc': [null, [
        Validators.required
      ]],
      'estado': [null, [
        Validators.required
      ]],
      'cliente': [null, [
        Validators.required
      ]],
      'cargo': [null, [
        Validators.required
      ]],
      'trabajo': [null, [
        Validators.required
      ]],
      'domicilio': [null, [
        Validators.required
      ]],
      'lugar': [null, [
        Validators.required
      ]],
      'telefono': [null, [
        Validators.required
      ]],
      'vendedor': [null, [
        Validators.required
      ]],
      'fechaventa': [null, [
        Validators.required
      ]],
      'fechapago': [null, [
        Validators.required
      ]],
      'tipopago': [null, [
        Validators.required
      ]],
      'montototal': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'cuotas':[null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'observaciones': [null, [
        Validators.required
      ]],
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    fromEvent(this.ClienteAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarClientes('', '', '', '' , this.VentasForm.value.cliente , '');
      })
     ).subscribe();
  }

  displayCliente(cliente?: any): string | undefined {
    if (cliente) {
      return (cliente.nombre + ' ' + cliente.apellido) ;
    }
  }

  displayVendedor(vendedor?: any): string | undefined {
    return vendedor ? vendedor.nombre : undefined;
  }



  /* Agregar productos */
 Agregar() {
  // tslint:disable-next-line:prefer-const
  let VentanaAdjuntos = this.DialogoArchivos.open(VentanaEmergenteArchivos, {
    width: '800px'
  });
  }

  /*Cronograma */
  GeneraCronograma() {
    this.ListadoCronograma.GenerarCronograma(this.VentasForm.value.fechapago.toISOString() ,
    this.FiltroMonto.nativeElement.value, this.FiltroCuota.nativeElement.value);

  }
  /*VentanaAdjuntos.afterClosed().subscribe(res => {
    this.CargarData();
  });*/
  AgregaProductos() {
    this.contador++;
    this.productos.push({ producto: '', imei: ''});
  }

  EliminarProductos() {
    this.contador--;
    this.productos.splice(1);
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

   ListarTipoDocumento() {
    this.ServicioTipoDocumento.ListarTipoDocumento().subscribe( res => {
      this.LstTipoDocumento = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.LstTipoDocumento.push ( res[i] );
      }
   });

  }

  ListarClientes(inst: string, sede: string, subsede: string, dni: string, nombre: string,apellido: string ) {
    this.ClienteServicio.Listado(inst, sede, subsede, dni, nombre, apellido).subscribe( res => {
      this.LstCliente = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.LstCliente.push(res[i]);
      }
    });
  }

  ObtenerClientexId() {
    if (this.idcliente) {
    this.ClienteServicio.Seleccionar(this.idcliente).subscribe(res => {
      if (res) {
        this.VentasForm.get('cliente').setValue(res);
        this.VentasForm.get('cargo').setValue(res.cargo);
        this.VentasForm.get('trabajo').setValue(res.trabajo);
        //this.VentasForm.get('domicilio').setValue(res.)
      }
    });
    }
  }

  ObtenerDireccion() {
    if (this.idcliente) {
        this.DireccionServicio.ListarDireccion( this.idcliente.toString() , '1').subscribe(res => {
          if (res) {
            this.VentasForm.get('domicilio').setValue(res[0].direccion);
          }
        });
    }
  }

  ObtenerTelefono() {
    if (this.idcliente) {
        this.TelefonoServicio.ListarTelefono( this.idcliente.toString() , '1').subscribe(res => {
          if (res) {
            this.VentasForm.get('telefono').setValue(res[0].tlf_numero);
          }
        });
    }
  }

}
