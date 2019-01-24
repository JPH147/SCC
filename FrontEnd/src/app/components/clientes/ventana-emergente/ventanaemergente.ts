import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, Institucion, Sede, Subsede} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {ClienteService} from '../clientes.service';
import {ServiciosDirecciones} from '../../global/direcciones';

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales, ClienteService, ServiciosDirecciones]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteClientes {
  
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteClientes>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ClienteServicios: ClienteService,
    private ServicioDireccion: ServiciosDirecciones
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }


  ngOnInit() {

    this.ListarDepartamento();

    /* Crear formulario */
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
      'codigo': [null, [
        Validators.required
      ]],
      'dni': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]],
      'nombre': [null, [
        Validators.required
      ]],
      'cip': [null, [
        Validators.required
      ]],
      'email': [null, [
        Validators.required
      ]],
      'casilla': [null, [
        Validators.required
      ]],
      'departamento': [null, [
        Validators.required
      ]],
      'provincia': [null, [
        Validators.required
      ]],
      'distrito': [null, [
        Validators.required
      ]],
      'trabajo': [null, [
        Validators.required
      ]],
      'cargo': [null, [
        Validators.required
      ]],
      'cargo_estado': [null, [
        Validators.required
      ]],
      'capacidad_pago': [null, [
        Validators.required
      ]],
      'descuento_maximo': [null, [
        Validators.required
      ]],
      'calificacion_personal': [null, [
        Validators.required
      ]],
      'aporte': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
      ]]
    });

    this.Servicios.ListarInstitucion().subscribe( res => {
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Institucion.push(res[i]);
      }
    });

    if (this.data) {
      console.log(this.data);
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
      
      this.ClientesForm.get('trabajo').setValue(this.data.objeto.trabajo);
      this.ListarProvincia(this.data.objeto.departamento);
      this.ListarDistrito(this.data.objeto.provincia);
      this.ClientesForm.get('departamento').setValue(this.data.objeto.departamento);
      this.ClientesForm.get('provincia').setValue(this.data.objeto.provincia);
      this.ClientesForm.get('distrito').setValue(this.data.objeto.id_distrito_trabajo);

      this.ClientesForm.get('capacidad_pago').setValue(this.data.objeto.capacidad_pago);
      this.ClientesForm.get('descuento_maximo').setValue(this.data.objeto.maximo_descuento);
      this.ClientesForm.get('calificacion_personal').setValue(this.data.objeto.calificacion_personal);
      this.ClientesForm.get('aporte').setValue(this.data.objeto.aporte);
      // this.ClientesForm.get('fecharegistro').setValue(this.data.fecharegistro);
      this.ClientesForm.controls['sede'].enable();
      this.ClientesForm.controls['subsede'].enable();
    }

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
  }

  CargoSeleccionado(event){
    this.ListarEstadosCargo(event.value);
    this.ClientesForm.get('cargo_estado').setValue('');
    this.ClientesForm.get('cargo_estado').enable;
  }

  ListarDepartamento() {
    this.ServicioDireccion.ListarDepartamentos('', 0, 50).subscribe( res => {
      this.Departamentos = res['data'].departamentos;
    });
  }

  ListarProvincia(i) {
    this.ServicioDireccion.ListarProvincias(i, '' , 0, 30).subscribe( res => {
      console.log(i,res);
      this.Provincias = res['data'].provincias;
    });
  }

  ListarDistrito(i) {
    this.ServicioDireccion.ListarDistritos('', i , '', 0, 50).subscribe( res => {
      this.Distritos = res['data'].distritos;
    });
  }

  DepartamentoSeleccionado(event, i) {
    this.ListarProvincia(event.value);
    this.Distritos=[];
    this.ClientesForm.get('provincia').setValue('');
    this.ClientesForm.get('distrito').setValue('');
  }

  ProvinciaSeleccionada(event, i) {
    this.ServicioDireccion.ListarDistritos('', event.value, '' , 0, 50).subscribe(res => {
      this.Distritos = res['data'].distritos
    });

    this.ClientesForm.get('distrito').setValue('');
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
        formulario.value.distrito,
        formulario.value.trabajo,
        formulario.value.capacidad_pago,
        formulario.value.descuento_maximo,
        formulario.value.calificacion_personal,
        formulario.value.aporte
      ).subscribe(res => console.log(res));

      this.ClientesForm.reset();
      this.ventana.close();
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
        formulario.value.distrito,
        formulario.value.trabajo,
        formulario.value.capacidad_pago,
        formulario.value.descuento_maximo,
        formulario.value.calificacion_personal,
        formulario.value.aporte
      ).subscribe(res => console.log(res));
    }
      this.ClientesForm.reset();
      this.ventana.close();
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


}
