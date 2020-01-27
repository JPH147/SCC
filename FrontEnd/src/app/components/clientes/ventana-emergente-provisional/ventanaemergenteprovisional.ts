import {Component, Inject, OnInit, AfterViewInit, ElementRef, ViewChild, Optional, Output, EventEmitter} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, Institucion, Sede, Subsede} from '../../global/servicios';
import { fromEvent, BehaviorSubject } from 'rxjs';
import {ClienteService} from '../clientes.service';
import {ServiciosDirecciones} from '../../global/direcciones';
import {ServiciosTelefonos} from '../../global/telefonos';
import {ServiciosVentas} from '../../global/ventas';
import { debounceTime, distinctUntilChanged, tap, finalize } from 'rxjs/operators';
import { SeleccionarClienteComponent } from '../../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';

@Component({
  selector: 'app-ventanaemergenteprovisional',
  templateUrl: './ventanaemergenteprovisional.html',
  styleUrls: ['./ventanaemergenteprovisional.css'],
  providers: [ServiciosGenerales, ClienteService, ServiciosDirecciones,ServiciosTelefonos,ServiciosVentas]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteProvisionalClientes {
  
  public Cargando = new BehaviorSubject<boolean>(false) ;
  @Output() cliente_output = new EventEmitter();
  @ViewChild('InputCliente', { static: true }) FiltroCliente : ElementRef;
  
  public selectedValue: string;
  public ClientesForm: FormGroup;
  public Sede: any = [];
  public Subsede: any = [];
  public Institucion: any = [];
  public Departamentos: Array<any>;
  public Provincias: Array<any>;
  public Distritos: Array<any>;
  public Cargos: Array<any>;
  public Estados: Array<any>;
  public cliente_nuevo : number = 3;

  // Contacto
  public Tipos: any[];
  public Relevancias: any[];
  public RelevanciaDireccion: any[];
  public LstDepartamento: any;
  public LstProvincia: any;
  public LstDistrito: any;
  public Bancos: Array<any>;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    @Optional() public ventana: MatDialogRef<VentanaEmergenteProvisionalClientes>,
    private FormBuilder: FormBuilder,
    private Dialogo : MatDialog ,
    private Servicios: ServiciosGenerales,
    private SVentas: ServiciosVentas,
    private ClienteServicios: ClienteService,
    private ServicioDireccion: ServiciosDirecciones,
    private ServicioTelefono: ServiciosTelefonos,
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
      this.Institucion=res;
    });

    if (this.data) {
      // console.log(this.data);
      this.AsignarInformacion();
      this.ClientesForm.get('direccion_nombre').setValidators([]);
      this.ClientesForm.get('direccion_departamento').setValidators([]);
      this.ClientesForm.get('direccion_provincia').setValidators([]);
      this.ClientesForm.get('direccion_distrito').setValidators([]);
      this.ClientesForm.get('telefono_numero').setValidators([]);
      this.ClientesForm.get('telefono_tipo').setValidators([]);
    }

    // Contacto
    this.ListarBancos();
    this.ListarDepartamentoDireccion();
    this.ListarRelevanciaDireccion();
    this.ListarTipos();
    this.ListarRelevancia();

    //  Por los valores predeterminados
    this.ListarSede(4,true);
    this.ListarSubsede(3);
    this.ListarCargos(3);
    this.ListarEstadosCargo(3);
  }

  ngAfterViewInit(){
    // this.ClientesForm.get('nombre').valueChanges
    // .pipe(
    //   debounceTime(200),
    //   distinctUntilChanged(),
    //   tap(()=>{
    //     this.GenerarEmail();
    //   })
    // ).subscribe()

    fromEvent(this.FiltroCliente.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if( this.FiltroCliente.nativeElement.value.length == 8 ) {
          this.Cargando.next(true) ;
          this.VerificarDNI(this.FiltroCliente.nativeElement.value)
        }
      })
    ).subscribe();
    
    this.ClientesForm.get('dni_garante').valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if( this.ClientesForm.value.dni_garante.length == 8 ) {
          this.BuscarGarante()
        }
      })
    ).subscribe();

    // Se emite información para la vista express cada vez que hay un cambio
    this.ClientesForm.valueChanges.subscribe(res=>{
      this.EmitirInformacion();
    })
  }

  CrearFormulario(){
    this.ClientesForm = this.FormBuilder.group({
      cliente_nuevo : [ true, [
      ]],
      'institucion': [4, [
        Validators.required
      ]],
      'sede': [3, [
        Validators.required
      ]],
      'subsede': [7, [
        Validators.required
      ]],
      'subsede_nombre': ["Policía Nacional del Perú", [
        Validators.required
      ]],
      'codigo': ["", [
        Validators.maxLength(10)
      ]],
      'dni': ["", [
        Validators.required,
        Validators.pattern('[0-9- ]+'),
        Validators.minLength(8),
        Validators.maxLength(8)
      ]],
      'nombre': [null, [
        Validators.required
      ]],
      'id_cliente': [null, [
      ]],
      'cip': ["", [
        // Validators.required
      ]],
      'email': ["", [
        Validators.email
      ]],
      'casilla': [ "" , [
      ]],
      'email_real': [1, [
      ]],
      'casilla_real': [1, [
      ]],
      direccion_completa: [null,[
      ]],
      direccion_nombre: [null,[
        Validators.required
      ]],
      direccion_departamento: [null,[
        Validators.required
      ]],
      direccion_provincia: [null,[
        Validators.required
      ]],
      direccion_distrito: [null,[
        Validators.required
      ]],
      direccion_distrito_nombre: [null,[
      ]],
      telefono_numero: [null,[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(9),
        Validators.pattern('[0-9- ]+')
      ]],
      telefono_whatsapp: [{value:null,disabled:false},[
      ]],
      telefono_tipo: [{value:1,disabled:false},[
        Validators.required,
      ]],
      telefono_tipo_nombre: [{value:1,disabled:false},[
      ]],
      cuenta_banco: [1,[
        // Validators.required,
      ]],
      cuenta_banco_nombre: [1,[
        // Validators.required,
      ]],
      cuenta_numero:["0",[
        // Validators.required,
      ]],
      'cargo': [219, [
        Validators.required
      ]],
      'cargo_estado': [377, [
        Validators.required
      ]],
      'cargo_nombre': ["SUB OFICIAL", [
      ]],
      'cargo_estado_nombre': ["ACTIVIDAD", [
      ]],
      plantilla_ddjj : ["ddjj_1.docx", []],
      plantilla_autorizacion : ["autorizacion_1.docx", []],
      plantilla_transaccion : ["transaccion_1.docx", []],
      plantilla_compromiso : ["compromiso_1.docx", []],
      plantilla_tarjeta : ["tarjeta_1.docx", []],
      parametro_condicion : ["", []],
      parametro_domicilio_laboral : ["", []],
      parametro_autorizacion_1 : ["", []],
      parametro_autorizacion_2 : ["", []],
      hay_garante: [false,[
      ]],
      nombre_garante: ["",[
      ]],
      dni_garante: ["",[
      ]],
    });
  }

  VerificarDNI(dni){
    this.ClienteServicios.BuscarClienteDNI(dni)
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      // console.log(res);
      if(res['codigo']==1){
        this.cliente_nuevo = 1;
        this.ClientesForm.get("cliente_nuevo").setValue(true);
      } else {
        this.cliente_nuevo = 2;
        this.ClientesForm.get("cliente_nuevo").setValue(false);
        // Si es para la evaluación express
        if(!this.ventana){
          this.ClientesForm.get('institucion').setValue(res['data'].id_institucion) ;
          this.ListarSede(res['data'].id_institucion, true);
          
          this.ListarSubsede(res['data'].id_sede);
          this.ListarCargos(res['data'].id_sede);
          
          this.ClientesForm.get('sede').setValue(res['data'].id_sede) ;
          this.ClientesForm.get('subsede_nombre').setValue(res['data'].subsede) ;
          this.ClientesForm.get('subsede').setValue(res['data'].id_subsede) ;
          
          this.ClientesForm.get('cargo').setValue(res['data'].id_cargo) ;
          this.ClientesForm.get('cargo_nombre').setValue(res['data'].cargo_nombre) ;

          this.ListarEstadosCargo(res['data'].id_sede);
          this.ClientesForm.get('cargo_estado').setValue(res['data'].id_cargo_estado) ;
          this.ClientesForm.get('cargo_estado_nombre').setValue(res['data'].cargo_estado) ;

          this.ClientesForm.get('codigo').setValue(res['data'].codigo);
          this.ClientesForm.get('cip').setValue(res['data'].cip);
          this.ClientesForm.get('email').setValue(res['data'].email);
          this.ClientesForm.get('casilla').setValue(res['data'].casilla);
          this.ClientesForm.get('email_real').setValue(res['data'].email_real);
          this.ClientesForm.get('casilla_real').setValue(res['data'].casilla_real);
          this.ClientesForm.get('nombre').setValue(res['data'].nombre);
          this.ClientesForm.get('id_cliente').setValue(res['data'].id);

          this.ClientesForm.get('plantilla_ddjj').setValue(res['data'].plantilla_ddjj);
          this.ClientesForm.get('plantilla_autorizacion').setValue(res['data'].plantilla_autorizacion);
          this.ClientesForm.get('plantilla_transaccion').setValue(res['data'].plantilla_transaccion);
          this.ClientesForm.get('plantilla_compromiso').setValue(res['data'].plantilla_compromiso);
          this.ClientesForm.get('plantilla_tarjeta').setValue(res['data'].plantilla_tarjeta);

          this.ObtenerDireccion(res['data'].id);
          this.ObtenerTelefono(res['data'].id);
          this.ObtenerCuenta(res['data'].id);
          this.ObtenerNumeroCelular(res['data'].id);
        }
      }
    })
  }

  AsignarInformacion(){
      // console.log(this.data);
    this.ClientesForm.get('institucion').setValue(this.data.objeto.institucion);
    this.ListarSede(this.data.objeto.institucion, false);
    this.ClientesForm.get('sede').setValue(this.data.objeto.sede);
    this.ListarSubsede(this.data.objeto.sede);
    this.ClientesForm.get('subsede').setValue(this.data.objeto.subsede);
    this.ListarCargos(this.data.objeto.sede);
    this.ClientesForm.get('cargo').setValue(this.data.objeto.id_cargo);
    this.ListarEstadosCargo(this.data.objeto.sede);
    this.ClientesForm.get('cargo_estado').setValue(this.data.objeto.id_cargo_estado);

    this.ClientesForm.get('codigo').setValue(this.data.objeto.codigo);
    this.ClientesForm.get('dni').setValue(this.data.objeto.dni);
    this.ClientesForm.get('nombre').setValue(this.data.objeto.nombre);
    this.ClientesForm.get('cip').setValue(this.data.objeto.cip);
    this.ClientesForm.get('email').setValue(this.data.objeto.email);
    this.ClientesForm.get('casilla').setValue(this.data.objeto.casilla);
    
    // this.ClientesForm.get('trabajo').setValue(this.data.objeto.trabajo);
    // this.ListarProvincia(this.data.objeto.departamento);
    // this.ListarDistrito(this.data.objeto.provincia);
    // this.ClientesForm.get('departamento').setValue(this.data.objeto.departamento);
    // this.ClientesForm.get('provincia').setValue(this.data.objeto.provincia);
    // this.ClientesForm.get('distrito').setValue(this.data.objeto.id_distrito_trabajo);

    // this.ClientesForm.get('fecharegistro').setValue(this.data.fecharegistro);
    this.ClientesForm.controls['sede'].enable();
    this.ClientesForm.controls['subsede'].enable();

    // this.ObtenerDireccion(this.data.id);
    // this.ObtenerTelefono(this.data.id);
    // this.ObtenerCuenta(this.data.id);
  }

  ObtenerDireccion(id) {
    this.ServicioDireccion.ListarDireccion( id, '1',1,1).subscribe(res => {
      if (res['data']) {
        this.ListarDepartamento();
        this.ListarProvincia(res['data'].direcciones[0].departamento);
        this.ClientesForm.get('direccion_departamento').setValue(res['data'].direcciones[0].departamento);
        this.ListarDistrito(res['data'].direcciones[0].provincia);
        this.ClientesForm.get('direccion_provincia').setValue(res['data'].direcciones[0].provincia);
        this.ClientesForm.get('direccion_distrito').setValue(res['data'].direcciones[0].id_distrito);
        this.ClientesForm.get('direccion_distrito_nombre').setValue(res['data'].direcciones[0].distrito);
        this.ClientesForm.get('direccion_nombre').setValue(res['data'].direcciones[0].direccion);
        this.ClientesForm.get('direccion_completa').setValue(res['data'].direcciones[0].direccion_formateada);
      }else{
        this.ClientesForm.get('direccion_nombre').setValue("No registra")
      }
    });
  }

  ObtenerTelefono(id) {
    this.ServicioTelefono.ListarTelefono( id, '1',1,1).subscribe(res => {
      if(res['codigo']==0){
        if (res['data']) {
          this.ClientesForm.get('telefono_numero').setValue(res['data'].telefonos[0].tlf_numero);
          if(res['data'].telefonos[0].id_tipo==1){
            this.ClientesForm.get('telefono_tipo').setValue(res['data'].telefonos[0].id_tipo);
            this.ClientesForm.get('telefono_tipo_nombre').setValue("Celular de trabajo");
          } else {
            this.ClientesForm.get('telefono_tipo').setValue(res['data'].telefonos[0].id_tipo);
            this.ClientesForm.get('telefono_tipo_nombre').setValue("Teléfono de " + res['data'].telefonos[0].tipo);
          }
        }else{
          this.ClientesForm.get('telefono_numero').setValue("No registra")
          this.ClientesForm.get('telefono_tipo').setValue(null);
          this.ClientesForm.get('telefono_tipo_nombre').setValue("No registra")
        }
      }else{
        this.ClientesForm.get('telefono_numero').setValue(" No registra ")
        this.ClientesForm.get('telefono_tipo').setValue(null);
        this.ClientesForm.get('telefono_tipo_nombre').setValue(" No registra ")
      }
    });
  }

  ObtenerNumeroCelular(id){
    this.ClienteServicios.BuscarCelular(id).subscribe(res=>{
      if (res){
        this.ClientesForm.get('telefono_numero').setValue(res);
      } else {
        this.ClientesForm.get('telefono_numero').setValue(" No registra ");
      }
    })
  }

  ObtenerCuenta(id) {
    this.ClienteServicios.ListarCuenta( id, '1',1,1).subscribe(res => {
      // console.log(res)
      if (res['data']) {
        this.ClientesForm.get('cuenta_banco').setValue(res['data'].cuentas[0].id_banco);
        this.ClientesForm.get('cuenta_banco_nombre').setValue(res['data'].cuentas[0].nombre_banco);
        this.ClientesForm.get('cuenta_numero').setValue(res['data'].cuentas[0].cuenta_numero);
      }else{
        this.ClientesForm.get('cuenta_numero').setValue("No registra")
      }
    });
  }

  InstitucionSeleccionada(event) {
    this.ListarSede(event.value, true);
    this.ClientesForm.get('sede').setValue ('');
    this.ClientesForm.get('subsede').setValue ('');
    this.ClientesForm.controls['sede'].enable();
    this.ClientesForm.controls['subsede'].disable();
  }

/* Se muestran los modelos cuando se selecciona una marca */
  SedeSeleccionada(event, traer_info) {
    this.SeleccionarPlanilla(event.value);

    let sedeX = this.Sede.filter(e=>e.id==event.value);

    this.ClientesForm.get('plantilla_ddjj').setValue(sedeX[0].plantilla_ddjj);
    this.ClientesForm.get('plantilla_autorizacion').setValue(sedeX[0].plantilla_autorizacion);
    this.ClientesForm.get('plantilla_transaccion').setValue(sedeX[0].plantilla_transaccion);
    this.ClientesForm.get('plantilla_compromiso').setValue(sedeX[0].plantilla_compromiso);
    this.ClientesForm.get('plantilla_tarjeta').setValue(sedeX[0].plantilla_tarjeta_socio);

    this.ClientesForm.get('parametro_condicion').setValue(sedeX[0].parametro_condicion);
    this.ClientesForm.get('parametro_domicilio_laboral').setValue(sedeX[0].parametro_domicilio);
    this.ClientesForm.get('parametro_autorizacion_1').setValue(sedeX[0].parametro_autorizacion_1);
    this.ClientesForm.get('parametro_autorizacion_2').setValue(sedeX[0].parametro_autorizacion_2);

    if( !traer_info ) {
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
  }

  SubsedeSeleccionada(evento){
    let subsedeX = this.Subsede.filter(e=>e.id==evento.value);
    this.ClientesForm.get('subsede_nombre').setValue(subsedeX[0].nombre);
  }

  SeleccionarPlanilla( id_sede ){
    switch(id_sede){
      case 3: {
        this.ClientesForm.get('plantilla_autorizacion').setValue("autorizacion_1.docx")
        this.ClientesForm.get('plantilla_transaccion').setValue("transaccion_1.docx")
        this.ClientesForm.get('plantilla_compromiso').setValue("compromiso_1.docx")
        this.ClientesForm.get('plantilla_tarjeta').setValue("tarjeta_1.docx")
        break;
      }
      case 4: {
        this.ClientesForm.get('plantilla_autorizacion').setValue("autorizacion_3.docx")
        this.ClientesForm.get('plantilla_transaccion').setValue("transaccion_3.docx")
        this.ClientesForm.get('plantilla_compromiso').setValue("compromiso_1.docx")
        this.ClientesForm.get('plantilla_tarjeta').setValue("tarjeta_1.docx")
        break;
      }
      case 5: {
        this.ClientesForm.get('plantilla_autorizacion').setValue("autorizacion_2.docx")
        this.ClientesForm.get('plantilla_transaccion').setValue("transaccion_2.docx")
        this.ClientesForm.get('plantilla_compromiso').setValue("compromiso_1.docx")
        this.ClientesForm.get('plantilla_tarjeta').setValue("tarjeta_1.docx")
        break;
      }
    }

    if(id_sede == 9) {
      this.ClientesForm.get('plantilla_autorizacion').setValue("autorizacion_6.docx")
      this.ClientesForm.get('plantilla_transaccion').setValue("transaccion_6.docx")
      this.ClientesForm.get('plantilla_compromiso').setValue("compromiso_2.docx")
      this.ClientesForm.get('plantilla_tarjeta').setValue("tarjeta_2.docx")
    }

    if(id_sede >= 10 && id_sede<=39) {
      this.ClientesForm.get('plantilla_autorizacion').setValue("autorizacion_5.docx")
      this.ClientesForm.get('plantilla_transaccion').setValue("transaccion_5.docx")
      this.ClientesForm.get('plantilla_compromiso').setValue("compromiso_2.docx")
      this.ClientesForm.get('plantilla_tarjeta').setValue("tarjeta_2.docx")
    }

    if(id_sede >= 40 ) {
      this.ClientesForm.get('plantilla_autorizacion').setValue("autorizacion_4.docx")
      this.ClientesForm.get('plantilla_transaccion').setValue("transaccion_4.docx")
      this.ClientesForm.get('plantilla_compromiso').setValue("compromiso_2.docx")
      this.ClientesForm.get('plantilla_tarjeta').setValue("tarjeta_2.docx")
    }
  }  

  ListarDepartamento() {
    this.ServicioDireccion.ListarDepartamentos('', 0, 50).subscribe( res => {
      // console.log("dep",res);
      this.Departamentos = res['data'].departamentos;
    });
  }

  ListarProvincia(departamento) {
    this.ServicioDireccion.ListarProvincias(departamento, '' , 0, 30).subscribe( res => {
      this.Provincias = res['data'].provincias;
      // console.log(this.Provincias)
    });
  }

  ListarDistrito(privincia) {
    this.ServicioDireccion.ListarDistritos('', privincia , '', 0, 50).subscribe( res => {
      this.Distritos = res['data'].distritos;
      // console.log(this.Distritos)
    });
  }

  DepartamentoSeleccionado(event) {
    this.ListarProvincia(event.value);
    this.Distritos=[];
    this.ClientesForm.get('direccion_provincia').setValue('');
    this.ClientesForm.get('direccion_distrito').setValue('');
  }

  ProvinciaSeleccionada(event) {
    this.ListarDistrito(event.value)
    this.ClientesForm.get('direccion_distrito').setValue('');
  }

  DistritoSeleccionado(evento){
    let nombre : any = this.Distritos.filter(e=>e.id==evento.value);
    nombre = nombre[0].nombre ;
    this.ClientesForm.get('direccion_distrito_nombre').setValue(nombre);
  }

  ListarInstitucion() {
    this.Servicios.ListarInstitucion().subscribe( res => {
      this.Institucion = res;
   });
  }

  ListarSede(i, traer_info) {
    this.Servicios.ListarSede(i, '').subscribe(res => {
      this.Sede = res ;
      this.SedeSeleccionada({ value : this.ClientesForm.value.sede }, traer_info)
  })}

  ListarSubsede(i) {
    this.Servicios.ListarSubsede(i, '').subscribe(res => {
      this.Subsede = res ;
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

  GenerarEmail() : string {
    // if( !this.ClientesForm.value.email ){
      let apellido : string, nombres : string, primer_nombre : string ;
      let nombre : string = this.ClientesForm.value.nombre ;
      let email : string ;
      if( nombre && nombre.includes(',') ) {
        apellido = nombre.substring(0,nombre.search(" ") ) ;
        apellido = apellido.trim() ;
        nombres = nombre.substring(nombre.search(",")+1,nombre.length ) ;
        nombres = nombres.trim() ;
        primer_nombre = nombres.substring(0,nombres.length ) ;
        email = primer_nombre + apellido + "@gmail.com" ;
        this.ClientesForm.get("email").setValue(email) ;
        return email;
      }
    // }
  }

  Imprimir(){
    console.log(this.ClientesForm)
  }

  ListarBancos(){
    this.SVentas.ListarBancos().subscribe(res=>{
      this.Bancos=res
    })
  }

  ListarDepartamentoDireccion() {
    this.ServicioDireccion.ListarDepartamentos('', 1, 50).subscribe( res => {
      this.LstDepartamento = res['data'].departamentos;
    });
  }

  ListarProvinciaDireccion(departamento) {
    this.ServicioDireccion.ListarProvincias(departamento, '' , 1, 30).subscribe( res => {
      this.LstProvincia = res['data'].provincias;
    });
  }

  ListarDistritoDireccion(provincia) {
    this.ServicioDireccion.ListarDistritos('', provincia , '', 1, 50).subscribe( res => {
      this.LstDistrito = res['data'].distritos;
    });
  }

  ListarRelevanciaDireccion() {
    this.RelevanciaDireccion = [
      {id: 1, viewValue: 'Primaria'},
      {id: 2, viewValue: 'Secundaria'},
    ];
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

  EmitirInformacion(){
    // console.log("Salida",this.ClientesForm);
    this.cliente_output.emit(
      { reset : false ,formulario: this.ClientesForm }
    )
  }

  Resetear(){
    this.ClientesForm.reset();
    //  Por los valores predeterminados
    this.ClientesForm.get('institucion').setValue(4) ;
    this.ClientesForm.get('sede').setValue(3) ;
    this.ClientesForm.get('subsede').setValue(7) ;
    this.ClientesForm.get('subsede_nombre').setValue("Policía Nacional del Perú") ;
    this.ClientesForm.get('cargo').setValue(219) ;
    this.ClientesForm.get('cargo_estado').setValue(377) ;
    this.ClientesForm.get('cargo_nombre').setValue("SUB OFICIAL") ;
    this.ClientesForm.get('cargo_estado_nombre').setValue("ACTIVIDAD") ;
    this.ClientesForm.get('telefono_tipo').setValue(1) ;
    this.ClientesForm.get('cuenta_banco').setValue(1) ;
    this.ListarSede(4,true);
    this.ListarSubsede(3);
    this.ListarCargos(3);
    this.ListarEstadosCargo(4);
    this.cliente_output.emit(
      { reset : true ,formulario: this.ClientesForm }
    )
  }

  HayGarante(hay:boolean){
    if( hay ) {
      this.ClientesForm.get('hay_garante').setValue(true)
    } else {
      this.ClientesForm.get('hay_garante').setValue(false) ;
      this.ClientesForm.get('nombre_garante').setValue("");
      this.ClientesForm.get('dni_garante').setValue("");
    }
  }

  BuscarGarante() {
    this.ClienteServicios.BuscarClienteDNI(this.ClientesForm.value.dni_garante)
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      if(res['codigo']==0){
        this.ClientesForm.get('nombre_garante').setValue(res['data'].nombre); 
      }
    })
  }

  AbrirVentanaGarante(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px",
      data: { cliente : this.ClientesForm.value.id_cliente ? this.ClientesForm.value.id_cliente : 0 }
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        // console.log(res);
        // this.ClientesForm.get('id_garante').setValue(res.id);
        this.ClientesForm.get('nombre_garante').setValue(res.nombre);
        this.ClientesForm.get('dni_garante').setValue(res.dni);
        // this.ObtenerDireccionGarante(res.id,index);
        // this.ObtenerTelefonoGarante(res.id,index);
        // this.CServicios.Seleccionar(res.id).subscribe(res=>{
        //   // console.log(res)
        //   this.ClientesForm['controls'].garantes['controls'][index].get('plantilla_ddjj').setValue(res.plantilla_ddjj) ;
        //   this.ClientesForm['controls'].garantes['controls'][index].get('plantilla_autorizacion').setValue(res.plantilla_autorizacion) ;
        //   this.ClientesForm['controls'].garantes['controls'][index].get('plantilla_compromiso').setValue(res.plantilla_compromiso) ;
        // })
      }
    })
  }

  /* Enviar al formulario */
  Guardar(formulario) {
    this.Cargando.next(true) ;

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
        0,
        "",
        0,
        0,
        "",
        20,
        5
      )
      .pipe(
        finalize(()=>this.Cargando.next(false))
      )
      .subscribe(res =>{
        // this.ClientesForm.reset();
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
        0,
        "",
        0,
        0,
        "",
        20,
        5
      )
      .pipe(
      finalize(()=>this.Cargando.next(false))
      )
      .subscribe(res =>{
        // this.ClientesForm.reset();
        // console.log(res)

        if(this.ClientesForm.value.cuenta_numero){
          this.ClienteServicios.CrearCuenta(res['data'], this.ClientesForm.value.cuenta_banco, this.ClientesForm.value.cuenta_numero, "").subscribe(resultado=>{
            // console.log(resultado)
          })
        }

        this.ServicioTelefono.CrearTelefono(res['data'], this.ClientesForm.value.telefono_numero, this.ClientesForm.value.telefono_tipo).subscribe(resultado=>{
          // console.log(resultado)
        })

        this.ServicioDireccion.CrearDireccion(res['data'], this.ClientesForm.value.direccion_nombre, this.ClientesForm.value.direccion_distrito).subscribe(resultado=>{
          // console.log(resultado)
        })

        setTimeout(()=>{
          if(res['codigo']==0) {
            this.ventana.close(res['data']);
          } else {
            this.ventana.close(false);
          }
        }, 500)

      });
    }
  }

}
