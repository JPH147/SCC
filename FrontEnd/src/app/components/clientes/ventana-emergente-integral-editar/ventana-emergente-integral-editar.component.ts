import { Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ServiciosGenerales, Institucion, Sede, Subsede} from 'src/app/core/servicios/servicios';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { ClienteService} from '../clientes.service';
import { ServiciosDirecciones} from 'src/app/core/servicios/direcciones';
import { ServiciosTelefonos} from 'src/app/core/servicios/telefonos';
import { MatPaginator } from '@angular/material/paginator';
import { ClienteCuentaDataSource, ClienteTelefonoDataSource, ClienteDireccionDataSource } from '../ventana-emergentecontacto/ventanaemergenteservice.dataservice';
import { debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { VentanaConfirmarComponent} from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { VentanaEditarTelefonoComponent } from '../ventana-editar-telefono/ventana-editar-telefono.component';
import { VentanaEditarDireccionComponent } from '../ventana-editar-direccion/ventana-editar-direccion.component';
import { VentanaEditarCuentaComponent } from '../ventana-editar-cuenta/ventana-editar-cuenta.component';

@Component({
  selector: 'app-ventana-emergente-integral-editar',
  templateUrl: './ventana-emergente-integral-editar.component.html',
  styleUrls: ['./ventana-emergente-integral-editar.component.css'],
  providers: [ServiciosGenerales, ClienteService, ServiciosDirecciones,ServiciosTelefonos,ServiciosVentas]
})
export class VentanaEmergenteIntegralEditarComponent implements OnInit {
  
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

    // Telefonos
    public ListadoTelefonos: ClienteTelefonoDataSource;
    public ColumnasTelefonos: string[] = [ 'telefono-numero', 'telefono-tipo', 'telefono-numero_telefono', 'telefono-relevancia', 'telefono-opciones'];
    public TelefonosForm: FormGroup;
    public Tipos: any;
    public Relevancias: any;
    @ViewChild('PaginadorTelefonos', { static: true }) paginatorTelefonos: MatPaginator;
  
    // Direcciones
    public ListadoDirecciones: ClienteDireccionDataSource;
    public ColumnasDirecciones: string[] = [ 'direccion-numero', 'direccion-nombre', 'direccion-relevancia', 'direccion-opciones']; 
    public DireccionesForm: FormGroup;
    public RelevanciaDireccion: any;
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
    public ventana: MatDialogRef<VentanaEmergenteIntegralEditarComponent>,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ClienteServicios: ClienteService,
    private SVentas: ServiciosVentas,
    private ServicioDireccion: ServiciosDirecciones,
    private ServicioTelefono: ServiciosTelefonos,
    private Dialogo: MatDialog
  ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit() {

    this.ListarDepartamento();

    /* Crear formulario */
    this.CrearFormulario();

    this.Servicios.ListarInstitucion().subscribe( res => {
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Institucion.push(res[i]);
      }
    });

    if (this.data) {
      this.Cargando.next(true) ;
      this.ClienteServicios.Seleccionar(this.data.id).subscribe(res => {
        this.Cargando.next(false) ;
        this.AsignarInformacion(res);
      })
    }

    // Telefonos
    this.ListarTipos();
    this.ListarRelevancia();

    this.ListadoTelefonos = new ClienteTelefonoDataSource(this.ServicioTelefono);
    this.ListadoTelefonos.CargarTelefonos(this.data.id, 1, 5);

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
    this.ListarDepartamento2();
    this.ListarRelevanciaDireccion();

    this.ListadoDirecciones = new ClienteDireccionDataSource(this.ServicioDireccion);
    this.ListadoDirecciones.CargarDirecciones(this.data.id,1,5);

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

    this.ListadoCuentas = new ClienteCuentaDataSource(this.ClienteServicios);
    this.ListadoCuentas.CargarCuentas(this.data.id, 1, 5);

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
    ).subscribe() ;

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

  CrearFormulario(){
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

  AsignarInformacion(objeto){
    this.ClientesForm.get('institucion').setValue(objeto.institucion);
    this.ListarSede(objeto.institucion);
    this.ClientesForm.get('sede').setValue(objeto.sede);
    this.ListarSubsede(objeto.sede);
    this.ClientesForm.get('subsede').setValue(objeto.subsede);
    this.ListarCargos(objeto.sede);
    this.ClientesForm.get('cargo').setValue(objeto.id_cargo);
    this.ListarEstadosCargo(objeto.sede);
    this.ClientesForm.get('cargo_estado').setValue(objeto.id_cargo_estado);

    this.ClientesForm.get('codigo').setValue(objeto.codigo);
    this.ClientesForm.get('dni').setValue(objeto.dni);
    this.ClientesForm.get('nombre').setValue(objeto.nombre);
    this.ClientesForm.get('cip').setValue(objeto.cip);
    this.ClientesForm.get('email').setValue(objeto.email ? objeto.email : "");
    this.ClientesForm.get('casilla').setValue(objeto.casilla ? objeto.casilla : "");
    this.ClientesForm.get('estado').setValue(objeto.estado);

    if(!this.data.confirmar){
      if( objeto.id_distrito_trabajo > 0 ) {
        this.ListarProvincia(objeto.departamento);
        this.ListarDistrito(objeto.provincia);
        this.ClientesForm.get('departamento').setValue(objeto.departamento);
        this.ClientesForm.get('provincia').setValue(objeto.provincia);
        this.ClientesForm.get('distrito').setValue(objeto.id_distrito_trabajo);
      }
      if( objeto.trabajo ) {
        this.ClientesForm.get('trabajo').setValue(objeto.trabajo);
      }
    }

    this.ClientesForm.get('capacidad_pago').setValue(objeto.capacidad_pago);
    this.ClientesForm.get('descuento_maximo').setValue(objeto.maximo_descuento);
    this.ClientesForm.get('calificacion_personal').setValue(objeto.calificacion_personal);
    this.ClientesForm.get('aporte').setValue(objeto.aporte);
    this.ClientesForm.controls['sede'].enable();
    this.ClientesForm.controls['subsede'].enable();

    this.ObtenerDireccion(this.data.id);
    this.ObtenerTelefono(this.data.id);
    this.ObtenerCuenta(this.data.id);
  }

  ObtenerDireccion(id) {
    this.ServicioDireccion.ListarDireccion( id, '1',1,1).subscribe(res => {
      // console.log(id,res);
      if (res['data']) {
        this.ClientesForm.get('direccion').setValue(res['data'].direcciones[0].direccioncompleta);
      }else{
        this.ClientesForm.get('direccion').setValue("No registra")
      }
    });
  }

  ObtenerTelefono(id) {
    this.ServicioTelefono.ListarTelefono( id, '1',1,1).subscribe(res => {
      if (res['data']) {
        this.ClientesForm.get('telefono').setValue(res['data'].telefonos[0].tlf_numero);
      }else{
        this.ClientesForm.get('telefono').setValue("No registra")
      }
    });
  }

  ObtenerCuenta(id) {
    this.ClienteServicios.ListarCuenta( id, '1',1,1).subscribe(res => {
      if (res['data']) {
        this.ClientesForm.get('cuenta').setValue(res['data'].cuentas[0].cuenta_numero);
      }else{
        this.ClientesForm.get('cuenta').setValue("No registra")
      }
    });
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

  /* Enviar al formulario */
  Guardar(formulario) {
    this.Cargando.next(true) ;
    //console.log(formulario.value.subsede);
    if (this.data) {

      this.ClienteServicios.Actualizar(
        this.data.id,
        formulario.value.subsede,
        formulario.value.cargo,
        formulario.value.cargo_estado,
        formulario.value.codigo,
        formulario.value.dni,
        formulario.value.nombre,
        formulario.value.cip,
        formulario.value.email,
        formulario.value.casilla,
        formulario.value.distrito,
        formulario.value.trabajo,
        formulario.value.capacidad_pago,
        formulario.value.descuento_maximo,
        formulario.value.calificacion_personal,
        formulario.value.aporte,
        this.data.confirmar ? 1 : formulario.value.estado
      ).subscribe(res =>{
        // this.ClientesForm.reset();
        this.Cargando.next(false) ;
        this.ventana.close(true);
      });
    }

    if (!this.data) {
      this.ClienteServicios.Agregar(
        formulario.value.subsede,
        formulario.value.cargo,
        formulario.value.cargo_estado,
        formulario.value.codigo,
        formulario.value.dni,
        formulario.value.nombre,
        formulario.value.cip,
        formulario.value.email,
        formulario.value.casilla,
        formulario.value.distrito,
        formulario.value.trabajo,
        formulario.value.capacidad_pago,
        formulario.value.descuento_maximo,
        formulario.value.calificacion_personal,
        formulario.value.aporte,
        1
      ).subscribe(res =>{
        // this.ClientesForm.reset();
        this.Cargando.next(false) ;
        this.ventana.close(true);
      });
    }
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

  Imprimir(){
    console.log(this.ClientesForm)
  }

  // -----------------
  CargarDataTelefonos(){
    this.ListadoTelefonos.CargarTelefonos(this.data.id, this.paginatorTelefonos.pageIndex+1, this.paginatorTelefonos.pageSize);
  }

  CargarDataDirecciones(){
    this.ListadoDirecciones.CargarDirecciones(this.data.id, this.paginatorDirecciones.pageIndex+1, this.paginatorDirecciones.pageSize); 
  }

  CargarDataCuentas(){
    this.ListadoCuentas.CargarCuentas(this.data.id, this.paginatorCuentas.pageIndex+1, this.paginatorCuentas.pageSize);
  }

  AgregarTelefono(){
    this.Cargando.next(true) ;
    this.ServicioTelefono.CrearTelefono(this.data.id, this.TelefonosForm.value.telefono, this.TelefonosForm.value.tipo).subscribe(res=>{
      this.Cargando.next(false) ;
      this.CargarDataTelefonos();
      this.TelefonosForm.reset() ;
      this.TelefonosForm.get("tipo").setValue(1) ;
    })
  }

  AgregarDireccion(){
    this.Cargando.next(true) ;
    this.ServicioDireccion.CrearDireccion(this.data.id, this.DireccionesForm.value.nombre, this.DireccionesForm.value.distrito).subscribe(res=>{
      this.Cargando.next(false) ;
      this.CargarDataDirecciones();
      this.DireccionesForm.reset() ;
    })
  }

  AgregarCuenta(){
    this.Cargando.next(true) ;
    this.ClienteServicios.CrearCuenta(this.data.id, this.CuentasForm.value.banco, this.CuentasForm.value.cuenta, this.CuentasForm.value.cci).subscribe(res=>{
      this.Cargando.next(false) ;
      this.CargarDataCuentas();
      this.CuentasForm.reset() ;
    })
  }

  EstablecerTelefonoPrimario(id){
    this.ListadoTelefonos.CargandoInformacion.next(true);
    this.ServicioTelefono.EstablecerTelefono(id).subscribe(res=>{
      this.ListadoTelefonos.CargarTelefonos(this.data.id, 1, 5);
    })
  }

  EstablecerDireccionPrimaria(id){
    this.ListadoDirecciones.CargandoInformacion.next(true);
    this.ServicioDireccion.EstablecerDireccion(id).subscribe(res=>{
      this.ListadoDirecciones.CargarDirecciones(this.data.id, 1, 5);
    })
  }

  EstablecerCuentaPrimaria(id){
    this.ListadoCuentas.CargandoInformacion.next(true);
    this.ClienteServicios.EstablecerCuenta(id).subscribe(res=>{
      this.ListadoCuentas.CargarCuentas(this.data.id, 1, 5);
    })
  }

  EditarTelefono( telefono ) {
    let Ventana = this.Dialogo.open(VentanaEditarTelefonoComponent, {
      width: '900px',
      data: { tipos : this.Tipos, telefono: telefono }
    });
    Ventana.afterClosed().subscribe(res => {
      if (res === true) {
        this.CargarDataTelefonos()
      }
    });
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

  EditarDireccion( direccion ) {
    let Ventana = this.Dialogo.open(VentanaEditarDireccionComponent, {
      width: '900px',
      data: { direccion: direccion }
    });
    Ventana.afterClosed().subscribe(res => {
      if (res === true) {
        this.CargarDataDirecciones()
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

  EditarCuenta( cuenta ) {
    console.log(cuenta) ;
    let Ventana = this.Dialogo.open(VentanaEditarCuentaComponent, {
      width: '900px',
      data: { cuenta: cuenta }
    });
    Ventana.afterClosed().subscribe(res => {
      if (res === true) {
        this.CargarDataCuentas()
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
       this.ClienteServicios.EliminarCuenta(cuenta.id).subscribe(res => {
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
    this.DireccionesForm.get('provincia').setValue('');
    this.DireccionesForm.get('distrito').setValue('');
  }

  ProvinciaSeleccionada2(event) {
    this.ServicioDireccion.ListarDistritos('', event.value, '' , 1, 50).subscribe(res => {
      this.LstDistrito = res['data'].distritos
    });
    this.DireccionesForm.get('distrito').setValue('');
  }
}
