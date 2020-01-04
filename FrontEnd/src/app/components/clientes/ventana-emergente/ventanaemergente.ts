import {Component, Inject, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, Institucion, Sede, Subsede} from '../../global/servicios';
import { fromEvent, BehaviorSubject } from 'rxjs';
import {ClienteService} from '../clientes.service';
import {ServiciosDirecciones} from '../../global/direcciones';
import {ServiciosTelefonos} from '../../global/telefonos';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales, ClienteService, ServiciosDirecciones,ServiciosTelefonos]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteClientes {
  
  public Cargando = new BehaviorSubject<boolean>(false) ;
  @ViewChild('InputCliente') FiltroCliente : ElementRef;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteClientes>,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
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
      console.log(res);
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

}
