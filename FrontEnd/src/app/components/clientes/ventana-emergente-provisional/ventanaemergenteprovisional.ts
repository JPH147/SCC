import {Component, Inject, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, Institucion, Sede, Subsede} from '../../global/servicios';
import { fromEvent } from 'rxjs';
import {ClienteService} from '../clientes.service';
import {ServiciosDirecciones} from '../../global/direcciones';
import {ServiciosTelefonos} from '../../global/telefonos';
import {ServiciosVentas} from '../../global/ventas';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-ventanaemergenteprovisional',
  templateUrl: './ventanaemergenteprovisional.html',
  styleUrls: ['./ventanaemergenteprovisional.css'],
  providers: [ServiciosGenerales, ClienteService, ServiciosDirecciones,ServiciosTelefonos,ServiciosVentas]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteProvisionalClientes {
  
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

  // Contacto
  public Tipos: any[];
  public Relevancias: any[];
  public RelevanciaDireccion: any[];
  public LstDepartamento: any;
  public LstProvincia: any;
  public LstDistrito: any;
  public Bancos: Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteProvisionalClientes>,
    private FormBuilder: FormBuilder,
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
      for (let i in res) {
        this.Institucion.push(res[i]);
      }
    });

    if (this.data) {
      console.log(this.data);
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
    this.ListarSede(4);
    this.ListarSubsede(3);
    this.ListarCargos(3);
    this.ListarEstadosCargo(219);
  }

  ngAfterViewInit(){
    fromEvent(this.FiltroCliente.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        console.log(this.FiltroCliente.nativeElement.value.length);
        if( this.FiltroCliente.nativeElement.value.length == 8 ) {
          this.VerificarDNI(this.FiltroCliente.nativeElement.value)
        }
      })
    ).subscribe()
  }

  CrearFormulario(){
    this.ClientesForm = this.FormBuilder.group({
      'institucion': [4, [
        Validators.required
      ]],
      'sede': [3, [
        Validators.required
      ]],
      'subsede': [7, [
        Validators.required
      ]],
      'codigo': ["", [
        // Validators.required
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
      'cip': [null, [
        Validators.required
      ]],
      'email': ["", [
        // Validators.required,
        Validators.email
      ]],
      'casilla': ["", [
        // Validators.required
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
      telefono_numero: [null,[
        Validators.required,
        Validators.minLength(7),
        Validators.pattern('[0-9- ]+')
      ]],
      telefono_tipo: [{value:1,disabled:false},[
        Validators.required,
      ]],
      cuenta_banco: ["",[
        // Validators.required,
      ]],
      cuenta_numero:["",[
        // Validators.required,
      ]],
      'cargo': [219, [
        Validators.required
      ]],
      'cargo_estado': [204, [
        Validators.required
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

  AsignarInformacion(){
      // console.log(this.data);
    this.ClientesForm.get('institucion').setValue(this.data.objeto.institucion);
    this.ListarSede(this.data.objeto.institucion);
    this.ClientesForm.get('sede').setValue(this.data.objeto.sede);
    this.ListarSubsede(this.data.objeto.sede);
    this.ClientesForm.get('subsede').setValue(this.data.objeto.subsede);
    this.ListarCargos(this.data.objeto.sede);
    this.ClientesForm.get('cargo').setValue(this.data.objeto.id_cargo);
    this.ListarEstadosCargo(this.data.objeto.id_cargo);
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
    console.log(event)
    this.ListarSede(event.value);
    this.ClientesForm.get('sede').setValue ('');
    this.ClientesForm.get('subsede').setValue ('');
    this.ClientesForm.controls['sede'].enable();
    this.ClientesForm.controls['subsede'].disable();
  }

/* Se muestran los modelos cuando se selecciona una marca */
  SedeSeleccionada(event) {
    console.log(event)
    this.ListarSubsede(event.value);
    this.ClientesForm.get('subsede').setValue('');
    this.ClientesForm.controls['subsede'].enable();

    this.ListarCargos(event.value);
    this.ClientesForm.get('cargo').setValue('');
    this.ClientesForm.get('cargo').enable();
  }

  CargoSeleccionado(event){
    console.log(event)
    this.ListarEstadosCargo(event.value);
    this.ClientesForm.get('cargo_estado').setValue('');
    this.ClientesForm.get('cargo_estado').enable;
  }

  ListarDepartamento() {
    this.ServicioDireccion.ListarDepartamentos('', 0, 50).subscribe( res => {
      // console.log(res);
      this.Departamentos = res['data'].departamentos;
    });
  }

  ListarProvincia(i) {
    this.ServicioDireccion.ListarProvincias(i, '' , 0, 30).subscribe( res => {
      // console.log(i,res);
      this.Provincias = res['data'].provincias;
    });
  }

  ListarDistrito(i) {
    this.ServicioDireccion.ListarDistritos('', i , '', 0, 50).subscribe( res => {
      // console.log(i, res);
      this.Distritos = res['data'].distritos;
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

  DepartamentoDireccionSeleccionado(event) {
    this.ServicioDireccion.ListarProvincias(event.value, '' , 1, 30).subscribe(res => {
      this.LstProvincia = res['data'].provincias
    });
    this.ClientesForm.get('direccion_provincia').setValue('');
    this.ClientesForm.get('direccion_distrito').setValue('');
  }

  ProvinciaDireccionSeleccionada(event) {
    this.ServicioDireccion.ListarDistritos('', event.value, '' , 1, 50).subscribe(res => {
      this.LstDistrito = res['data'].distritos
    });
    this.ClientesForm.get('direccion_distrito').setValue('');
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

  /* Enviar al formulario */
  Guardar(formulario) {
    //console.log(formulario.value.subsede);
    if (this.data) {

      this.ClienteServicios.Actualizar(
        this.data.id,
        formulario.value.subsede,
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
      ).subscribe(res =>{
        // this.ClientesForm.reset();
        this.ventana.close(true);
      });
    }

    if (!this.data) {
      this.ClienteServicios.Agregar(
        formulario.value.subsede,
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
      ).subscribe(res =>{
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
