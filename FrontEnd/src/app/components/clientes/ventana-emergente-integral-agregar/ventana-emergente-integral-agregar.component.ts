import {Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiciosGenerales, Institucion, Sede, Subsede } from 'src/app/core/servicios/servicios';
import { fromEvent, BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { ClienteService } from '../clientes.service';
import { ServiciosDirecciones } from 'src/app/core/servicios/direcciones';
import { debounceTime, distinctUntilChanged, tap, finalize } from 'rxjs/operators';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { ServiciosTelefonos } from 'src/app/core/servicios/telefonos';

@Component({
  selector: 'app-ventana-emergente-integral-agregar',
  templateUrl: './ventana-emergente-integral-agregar.component.html',
  styleUrls: ['./ventana-emergente-integral-agregar.component.css']
})
export class VentanaEmergenteIntegralAgregarComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  @ViewChild('InputCliente', { static: true }) FiltroCliente : ElementRef;
  public selectedValue: string;
  public ClientesForm: FormGroup;
  public Sede: Sede[] = [];
  public Subsede: Subsede[] = [];
  public Institucion: Institucion[] = [];
  public Departamentos: Array<any>;
  public Provincias: Array<any>;
  public Distritos: Array<any>;
  public Cargos: Array<any>;
  public Estados: Array<any>;
  public cliente_nuevo : number = 3;
  
  public DireccionesForm: FormGroup;
  public DireccionesAgregarForm: FormGroup;
  public LstDepartamento: any;
  public LstProvincia: any;
  public LstDistrito: any;
  public ListadoDirecciones : DireccionesDataSource ;
  public ColumnasDirecciones: string[] = [ 'direccion-numero', 'direccion-nombre', 'direccion-relevancia']; 
  public Direcciones : Array<any> = [] ;

  public ListadoTelefonos: TelefonosDataSource;
  public ColumnasTelefonos: string[] = [ 'telefono-numero', 'telefono-tipo', 'telefono-numero_telefono', 'telefono-relevancia'];
  public TelefonosForm: FormGroup;
  public TelefonosAgregarForm: FormGroup;
  public Tipos: any;
  public Relevancias: any;
  public Telefonos : Array<any> = [] ;

  public ListadoCuentas: CuentasDataSource;
  public ColumnasCuentas: string[] = [ 'cuenta-numero', 'cuenta-cuenta', 'cuenta-cci', 'cuenta-relevancia'];  
  public CuentasForm: FormGroup;
  public CuentasAgregarForm: FormGroup;
  public Bancos: Array<any>;
  public Cuentas: Array<any> = [];

  constructor(
    public ventana: MatDialogRef<VentanaEmergenteIntegralAgregarComponent>,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ClienteServicios: ClienteService,
    private ServicioDireccion: ServiciosDirecciones,
    private ServicioTelefono: ServiciosTelefonos,
    private VServicios : ServiciosVentas
  ) { }

  ngOnInit() {
    this.ListarDepartamento();

    /* Crear formulario */
    this.CrearFormularios();

    this.Servicios.ListarInstitucion().subscribe( res => {
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Institucion.push(res[i]);
      }
    });

    this.ListadoDirecciones = new DireccionesDataSource() ;
    this.ListarDepartamento2();

    this.ListadoTelefonos = new TelefonosDataSource() ;
    this.ListarTipos();
    this.ListarRelevancia();

    this.ListadoCuentas = new CuentasDataSource();
    this.ListarBancos();
  }

  ngAfterViewInit(){
    fromEvent(this.FiltroCliente.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        // console.log(this.FiltroCliente.nativeElement.value.length);
        if( this.FiltroCliente.nativeElement.value.length == 8 ) {
          this.VerificarDNI(this.FiltroCliente.nativeElement.value)
        }
      })
    ).subscribe()
  }

  CrearFormularios(){
    this.ClientesForm = this.FormBuilder.group({
      'institucion': [null, [
        Validators.required
      ]],
      'sede': [null, [
        Validators.required
      ]],
      'subsede': [null, [
        Validators.required
      ]],
      'codigo': ["", [
        Validators.maxLength(10)
      ]],
      'dni': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+'),
        Validators.minLength(8),
        Validators.maxLength(8)
      ]],
      'nombre': [null, [
        Validators.required
      ]],
      'cip': ["", [
        Validators.required
      ]],
      'email': ["", [
        // Validators.required,
        Validators.email
      ]],
      'casilla': [0, [
        // Validators.required
      ]],
      'departamento': [null, [
        // Validators.required
      ]],
      'provincia': [null, [
        // Validators.required
      ]],
      'distrito': [null, [
        // Validators.required
      ]],
      'direccion': [null, [
      ]],
      'telefono': [null, [
      ]],
      'cuenta': [null, [
      ]],
      'trabajo': ["", [
      ]],
      'cargo': [null, [
        Validators.required
      ]],
      'cargo_estado': [null, [
        Validators.required
      ]],
      'capacidad_pago': [0, [
        // Validators.required
      ]],
      'descuento_maximo': [0, [
        // Validators.required
      ]],
      'calificacion_personal': ["Buena", [
        // Validators.required
      ]],
      'aporte': [ 20, [
        // Validators.required,
        // Validators.pattern('[0-9- ]+')
      ]],
      'estado': [ 1, [
      ]],
    });

    this.DireccionesForm = this.FormBuilder.group({})

    this.DireccionesAgregarForm = this.FormBuilder.group({
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

    this.TelefonosForm = this.FormBuilder.group({})

    this.TelefonosAgregarForm = this.FormBuilder.group({
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

    this.CuentasForm = this.FormBuilder.group({})

    this.CuentasAgregarForm = this.FormBuilder.group({
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

  VerificarDNI(dni){
    this.ClienteServicios.BuscarClienteDNI(dni).subscribe(res=>{
      if(res['codigo']==1){
        this.cliente_nuevo = 1;
      } else {
        this.cliente_nuevo = 2;
      }
    })
  }

  InstitucionSeleccionada(event) {
    this.ListarSede(event.value);
    this.ClientesForm.get('sede').setValue ('');
    this.ClientesForm.get('subsede').setValue ('');
    this.ClientesForm.controls['sede'].enable();
    this.ClientesForm.controls['subsede'].disable();
  }

/* Se muestran los modelos cuando se selecciona una marca */
  SedeSeleccionada(event) {
    this.ListarSubsede(event.value);
    this.ClientesForm.get('subsede').setValue('');
    this.ClientesForm.controls['subsede'].enable();

    this.ListarCargos(event.value);
    this.ClientesForm.get('cargo').setValue('');
    this.ClientesForm.get('cargo').enable();

    this.ListarEstadosCargo(event.value);
    this.ClientesForm.get('cargo_estado').setValue('');
    this.ClientesForm.get('cargo_estado').enable();
  }

  ListarDepartamento() {
    this.ServicioDireccion.ListarDepartamentos('', 0, 50).subscribe( res => {
      // console.log(res);
      this.Departamentos = res['data'].departamentos;
      this.Departamentos.map((item)=>{
        item.nombre = item.nombre.toUpperCase() ;
        return item ;
      })
    });
  }

  ListarProvincia(i) {
    this.ServicioDireccion.ListarProvincias(i, '' , 0, 30).subscribe( res => {
      // console.log(i,res);
      this.Provincias = res['data'].provincias;
      this.Provincias.map((item)=>{
        item.nombre = item.nombre.toUpperCase() ;
        return item ;
      })
    });
  }

  ListarDistrito(i) {
    this.ServicioDireccion.ListarDistritos('', i , '', 0, 50).subscribe( res => {
      // console.log(i, res);
      this.Distritos = res['data'].distritos;
      this.Distritos.map((item)=>{
        item.nombre = item.nombre.toUpperCase() ;
        return item ;
      })
    });
  }

  DepartamentoSeleccionado(event) {
    this.ListarProvincia(event.value);
    this.Distritos=[];
    this.ClientesForm.get('provincia').setValue('');
    this.ClientesForm.get('distrito').setValue('');
  }

  ProvinciaSeleccionada(event) {
    this.ListarDistrito(event.value)
    this.ClientesForm.get('distrito').setValue('');
  }

  ListarInstitucion() {
    this.Servicios.ListarInstitucion().subscribe( res => {
      this.Institucion = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Institucion.push ( res[i] );
      }
   });

  }

  ListarSede(i) {
    this.Servicios.ListarSede(i, '').subscribe(res => {
      this.Sede =  [];
      // tslint:disable-next-line:forin
      for(let i in res){
        this.Sede.push(res [i] );
      }
  // tslint:disable-next-line:semicolon
  })}

  ListarSubsede(i) {
    this.Servicios.ListarSubsede(i, '').subscribe(res => {
      this.Subsede = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Subsede.push(res[i] );
      }
   });
  }

  ListarCargos(i){
    this.ClienteServicios.ListarCargo(i).subscribe(res=>{
      this.Cargos=res['cargos']
    })
  }

  ListarEstadosCargo(i){
    this.ClienteServicios.ListarCargoEstado(i).subscribe(res=>{
      this.Estados=res['estados']
    })
  }

  ListarDepartamento2() {
    this.ServicioDireccion.ListarDepartamentos('', 1, 50).subscribe( res => {
      this.LstDepartamento = res['data'].departamentos;
    });
  }

  ListarProvincia2(departamento) {
    this.ServicioDireccion.ListarProvincias(departamento, '' , 1, 30).subscribe( res => {
      this.LstProvincia = res['data'].provincias;
    });
  }

  ListarDistrito2(provincia) {
    this.ServicioDireccion.ListarDistritos('', provincia , '', 1, 50).subscribe( res => {
      this.LstDistrito = res['data'].distritos;
    });
  }

  DepartamentoSeleccionado2(event) {
    this.ServicioDireccion.ListarProvincias(event.value, '' , 1, 30).subscribe(res => {
      this.LstProvincia = res['data'].provincias
    });
    this.DireccionesAgregarForm.get('provincia').setValue('');
    this.DireccionesAgregarForm.get('distrito').setValue('');
  }

  ProvinciaSeleccionada2(event) {
    this.ServicioDireccion.ListarDistritos('', event.value, '' , 1, 50).subscribe(res => {
      this.LstDistrito = res['data'].distritos
    });
    this.DireccionesAgregarForm.get('distrito').setValue('');
  }

  EstablecerDireccionPrimaria( numero_direccion ) {
    this.Direcciones.forEach((item)=>{
      if( item.numero == numero_direccion ) {
        item.relevancia = 1  
      } else {
        item.relevancia = 2
      }
    })
  }

  AgregarDireccion() {
    let numero = this.Direcciones.length + 1;
    let direccion : Array<any> = this.DireccionesAgregarForm.value ;
    direccion['numero'] = numero ;
    direccion['relevancia'] = 2 ;

    this.Direcciones.push( direccion ) ;
    if( this.Direcciones.length == 1 ) {
      this.EstablecerDireccionPrimaria(1) ;
    } ;
    this.ListadoDirecciones.AsignarDirecciones(this.Direcciones) ;
    this.DireccionesAgregarForm.reset() ;
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
    ];
  }

  EstablecerTelefonoPrimario( numero_direccion ) {
    this.Telefonos.forEach((item)=>{
      if( item.numero == numero_direccion ) {
        item.relevancia = 1  
      } else {
        item.relevancia = 2
      }
    })
  }

  AgregarTelefono() {
    let numero = this.Telefonos.length + 1;
    let direccion : Array<any> = this.TelefonosAgregarForm.value ;
    direccion['numero'] = numero ;
    direccion['relevancia'] = 2 ;

    this.Telefonos.push( direccion ) ;
    if( this.Telefonos.length == 1 ) {
      this.EstablecerTelefonoPrimario(1) ;
    } ;
    this.ListadoTelefonos.AsignarTelefonos(this.Telefonos) ;
    this.TelefonosAgregarForm.reset() ;
  }

  ListarBancos(){
    this.VServicios.ListarBancos().subscribe(res=>{
      this.Bancos=res
    })
  }

  EstablecerCuentaPrimaria( numero_direccion ) {
    this.Cuentas.forEach((item)=>{
      if( item.numero == numero_direccion ) {
        item.relevancia = 1  
      } else {
        item.relevancia = 2
      }
    })
  }

  AgregarCuenta() {
    let numero = this.Cuentas.length + 1;
    let direccion : Array<any> = this.CuentasAgregarForm.value ;
    direccion['numero'] = numero ;
    direccion['relevancia'] = 2 ;

    this.Cuentas.push( direccion ) ;
    if( this.Cuentas.length == 1 ) {
      this.EstablecerCuentaPrimaria(1) ;
    } ;
    this.ListadoCuentas.AsignarCuentas(this.Cuentas) ;
    this.CuentasAgregarForm.reset() ;
  }

  Guardar(){
    this.Cargando.next(true) ;
    this.ClienteServicios.Agregar(
      this.ClientesForm.value.subsede,
      this.ClientesForm.value.cargo,
      this.ClientesForm.value.cargo_estado,
      this.ClientesForm.value.codigo,
      this.ClientesForm.value.dni,
      this.ClientesForm.value.nombre,
      this.ClientesForm.value.cip,
      this.ClientesForm.value.email,
      this.ClientesForm.value.casilla,
      this.ClientesForm.value.distrito,
      this.ClientesForm.value.trabajo,
      this.ClientesForm.value.capacidad_pago,
      this.ClientesForm.value.descuento_maximo,
      this.ClientesForm.value.calificacion_personal,
      this.ClientesForm.value.aporte,
      1
    )
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res =>{
      if( this.Direcciones.length > 0 || this.Telefonos.length>0 || this.Cuentas.length>0 ) {
        this.GuardarRelacionados(res['data']) ;
      } else {
        this.ventana.close(true) ;
      }
    });
  }

  GuardarRelacionados(id_cliente){
    this.Cargando.next(true) ;

    let relacionados : Array<Observable<any>> = [] ;

    this.Direcciones.forEach(item=>{
      relacionados.push(
        this.ServicioDireccion.CrearDireccion( id_cliente, item.nombre, item.distrito)
      )
    }) ;

    this.Telefonos.forEach(item=>{
      relacionados.push(
        this.ServicioTelefono.CrearTelefono(id_cliente, item.telefono, item.tipo)
      )
    })

    this.Cuentas.forEach(item=>{
      relacionados.push(
        this.ClienteServicios.CrearCuenta(id_cliente, item.banco, item.cuenta, item.cci)
      )
    })

    forkJoin(relacionados)
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      // console.log(res)
      this.ventana.close(true);
    })
  }
}

export class DireccionesDataSource implements DataSource<any> {

  private InformacionDirecciones = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionDirecciones.asObservable();
  }
  
  disconnect(){
    this.InformacionDirecciones.complete();
    this.CargandoInformacion.complete();
  }
  
  AsignarDirecciones(
    direcciones: Array<any>
  ){
    this.InformacionDirecciones.next( direcciones );
    this.TotalResultados.next( direcciones.length )
  }
}

export class TelefonosDataSource implements DataSource<any> {

  private InformacionTelefonos = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTelefonos.asObservable();
  }
  
  disconnect(){
    this.InformacionTelefonos.complete();
    this.CargandoInformacion.complete();
  }
  
  AsignarTelefonos(
    telefonos: Array<any>
  ){
    this.InformacionTelefonos.next( telefonos );
    this.TotalResultados.next( telefonos.length )
  }
}

export class CuentasDataSource implements DataSource<any> {
  private InformacionCuentas = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCuentas.asObservable();
  }
  
  disconnect(){
    this.InformacionCuentas.complete();
    this.CargandoInformacion.complete();
  }
  
  AsignarCuentas(
    cuentas: Array<any>
  ){
    this.InformacionCuentas.next( cuentas );
    this.TotalResultados.next( cuentas.length )
  }
}