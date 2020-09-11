import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {FormGroup, FormBuilder, FormArray , Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosTelefonos} from 'src/app/core/servicios/telefonos';
import {ServiciosDirecciones} from 'src/app/core/servicios/direcciones';
import { NgControl } from '@angular/forms';
import { ClienteCuentaDataSource, ClienteTelefonoDataSource, ClienteDireccionDataSource } from './ventanaemergenteservice.dataservice';
import { ClienteService } from '../../../modulo-clientes/clientes/clientes.service'
import {ServiciosVentas} from 'src/app/core/servicios/ventas';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import {VentanaConfirmarComponent} from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventanaemergentecontacto',
  templateUrl: './ventanaemergentecontacto.html',
  styleUrls: ['./ventanaemergentecontacto.css'],
  providers: []
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteContacto {
  public Cargando = new BehaviorSubject<boolean>(false) ;

  // Telefonos
  public ListadoTelefonos: ClienteTelefonoDataSource;
  public ColumnasTelefonos: string[] = [ 'telefono-numero', 'telefono-tipo', 'telefono-numero_telefono', 'telefono-relevancia', 'telefono-opciones'];
  public TelefonosForm: FormGroup;
  public Tipos: TipoTelefono[];
  public Relevancias: RelevanciaTelefono[];
  @ViewChild('PaginadorTelefonos', { static: true }) paginatorTelefonos: MatPaginator;

  // Direcciones
  public ListadoDirecciones: ClienteDireccionDataSource;
  public ColumnasDirecciones: string[] = [ 'direccion-numero', 'direccion-nombre', 'direccion-relevancia', 'direccion-opciones']; 
  public DireccionesForm: FormGroup;
  public RelevanciaDireccion: RelevanciaDireccion[];
  public LstDepartamento: any;
  public LstProvincia: any;
  public LstDistrito: any;
  @ViewChild('PaginadorDirecciones', { static: true }) paginatorDirecciones: MatPaginator;

  // Cuentas
  public ListadoCuentas: ClienteCuentaDataSource;
  public ColumnasCuentas: string[] = [ 'cuenta-numero', 'cuenta-banco', 'cuenta-cuenta', 'cuenta-cci', 'cuenta-relevancia', 'cuenta-opciones'];  
  public CuentasForm: FormGroup;
  public Bancos: Array<any>;
  @ViewChild('PaginadorCuentas', { static: true }) paginatorCuentas: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteContacto>,
    private Servicio: ClienteService,
    private SVentas: ServiciosVentas,
    private FormBuilder: FormBuilder,
    private ServicioTelefono: ServiciosTelefonos,
    private ServicioDireccion: ServiciosDirecciones,
    private Dialogo: MatDialog
  ) { }

  ngOnInit() {

    // Telefonos
    this.ListarTipos();
    this.ListarRelevancia();

    this.ListadoTelefonos = new ClienteTelefonoDataSource(this.ServicioTelefono);
    this.ListadoTelefonos.CargarTelefonos(this.data, 1, 5);

    this.TelefonosForm = this.FormBuilder.group({
      telefono: ["",[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(9),
        Validators.pattern('[0-9- ]+')
      ]],
      tipo: [{value:1,disabled:false},[
        Validators.required,
      ]],
    });

    // Direcciones
    this.ListarDepartamento();
    this.ListarRelevanciaDireccion();

    this.ListadoDirecciones = new ClienteDireccionDataSource(this.ServicioDireccion);
    this.ListadoDirecciones.CargarDirecciones(this.data,1,5);

    this.DireccionesForm = this.FormBuilder.group({
      nombre: [null,[
        Validators.required
      ]],
      departamento: [null,[
        Validators.required
      ]],
      provincia: [null,[
        Validators.required
      ]],
      distrito: [null,[
        Validators.required
      ]],
    })

    //Cuentas
    this.ListarBancos();

    this.ListadoCuentas = new ClienteCuentaDataSource(this.Servicio);
    this.ListadoCuentas.CargarCuentas(this.data, 1, 5);

    this.CuentasForm = this.FormBuilder.group({
      banco: [null,[
        Validators.required,
      ]],
      cuenta:[null,[
        Validators.required,
      ]],
      cci:["",[
        // Validators.required,
        Validators.minLength(20),
        Validators.maxLength(20)
      ]]
    });

  }

  ngAfterViewInit(){

    this.paginatorTelefonos.page
    .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarDataTelefonos();
     })
    ).subscribe();

    this.paginatorDirecciones.page
    .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarDataDirecciones();
     })
    ).subscribe();

    this.paginatorCuentas.page
    .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarDataCuentas();
     })
    ).subscribe();
  }

  CargarDataTelefonos(){
    this.ListadoTelefonos.CargarTelefonos(this.data, this.paginatorTelefonos.pageIndex+1, this.paginatorTelefonos.pageSize);
  }

  CargarDataDirecciones(){
    this.ListadoDirecciones.CargarDirecciones(this.data, this.paginatorDirecciones.pageIndex+1, this.paginatorDirecciones.pageSize); 
  }

  CargarDataCuentas(){
    this.ListadoCuentas.CargarCuentas(this.data, this.paginatorCuentas.pageIndex+1, this.paginatorCuentas.pageSize);
  }

  AgregarTelefono(){
    this.Cargando.next(true) ;
    this.ServicioTelefono.CrearTelefono(this.data, this.TelefonosForm.value.telefono, this.TelefonosForm.value.tipo).subscribe(res=>{
      this.Cargando.next(false) ;
      this.CargarDataTelefonos();
    })
  }

  AgregarDireccion(){
    this.Cargando.next(true) ;
    this.ServicioDireccion.CrearDireccion(this.data, this.DireccionesForm.value.nombre, this.DireccionesForm.value.distrito).subscribe(res=>{
      this.Cargando.next(false) ;
      this.CargarDataDirecciones();
    })
  }

  AgregarCuenta(){
    this.Cargando.next(true) ;
    this.Servicio.CrearCuenta(this.data, this.CuentasForm.value.banco, this.CuentasForm.value.cuenta, this.CuentasForm.value.cci).subscribe(res=>{
      this.Cargando.next(false) ;
      this.CargarDataCuentas();
    })
  }

  EstablecerTelefonoPrimario(id){
    this.ListadoTelefonos.CargandoInformacion.next(true);
    this.ServicioTelefono.EstablecerTelefono(id).subscribe(res=>{
      this.ListadoTelefonos.CargarTelefonos(this.data, 1, 5);
    })
  }

  EstablecerDireccionPrimaria(id){
    this.ListadoDirecciones.CargandoInformacion.next(true);
    this.ServicioDireccion.EstablecerDireccion(id).subscribe(res=>{
      this.ListadoDirecciones.CargarDirecciones(this.data, 1, 5);
    })
  }

  EstablecerCuentaPrimaria(id){
    this.ListadoCuentas.CargandoInformacion.next(true);
    this.Servicio.EstablecerCuenta(id).subscribe(res=>{
      this.ListadoCuentas.CargarCuentas(this.data, 1, 5);
    })
  }

  EliminarTelefono(telefono){
    let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el teléfono', valor: telefono.tlf_numero}
    });
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.ServicioTelefono.EliminarTelefono(telefono.id).subscribe(res=>{
          this.CargarDataTelefonos()
        })
      }
    });
  }

  EliminarDireccion(direccion){
    let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la dirección', valor: direccion.direccioncompleta}
    });
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.ServicioDireccion.EliminarDireccion(direccion.id).subscribe(res=>{
          this.CargarDataDirecciones()
        })
      }
    });
  }

  EliminarCuenta(cuenta){
    let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la cuenta', valor: cuenta.cuenta_numero}
    });
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
       this.Servicio.EliminarCuenta(cuenta.id).subscribe(res => {
         this.CargarDataCuentas();
       });
      }
    });
  }

  ListarBancos(){
    this.SVentas.ListarBancos().subscribe(res=>{
      this.Bancos=res
    })
  }

  ListarTipos() {
    this.Tipos = [
      {id: 1, viewValue: 'Celular'},
      {id: 2, viewValue: 'Casa'},
      {id: 3, viewValue: 'Trabajo'},
      {id: 4, viewValue: 'Otro'}
    ];
  }
  
  ListarRelevancia() {
    this.Relevancias = [
      {id: 1, viewValue: 'Principal'},
      {id: 2, viewValue: 'Secundario'},
      // {id: 0, viewValue: 'Inactivo'},
    ];
  }
  
  ListarRelevanciaDireccion() {
    this.RelevanciaDireccion = [
      {id: 1, viewValue: 'Primaria'},
      {id: 2, viewValue: 'Secundaria'},
    ];
  }

  ListarDepartamento() {
    this.ServicioDireccion.ListarDepartamentos('', 1, 50).subscribe( res => {
      this.LstDepartamento = res['data'].departamentos;
    });
  }

  ListarProvincia(departamento) {
    this.ServicioDireccion.ListarProvincias(departamento, '' , 1, 30).subscribe( res => {
      this.LstProvincia = res['data'].provincias;
    });
  }

  ListarDistrito(provincia) {
    this.ServicioDireccion.ListarDistritos('', provincia , '', 1, 50).subscribe( res => {
      this.LstDistrito = res['data'].distritos;
    });
  }

  DepartamentoSeleccionado(event) {
    this.ServicioDireccion.ListarProvincias(event.value, '' , 1, 30).subscribe(res => {
      this.LstProvincia = res['data'].provincias
    });
    this.DireccionesForm.get('provincia').setValue('');
    this.DireccionesForm.get('distrito').setValue('');
  }

  ProvinciaSeleccionada(event) {
    this.ServicioDireccion.ListarDistritos('', event.value, '' , 1, 50).subscribe(res => {
      this.LstDistrito = res['data'].distritos
    });
    this.DireccionesForm.get('distrito').setValue('');
  }

  onNoClick(): void {
    this.ventana.close();
  }

}

export interface TipoTelefono {
  id: number;
  viewValue: string;
}

export interface RelevanciaTelefono {
  id: number;
  viewValue: string;
}

export interface RelevanciaDireccion {
  id: number;
  viewValue: string;
}


