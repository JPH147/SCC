import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, Institucion, Sede, Subsede} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {ClienteService} from '../clientes.service';

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales, ClienteService]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteClientes {
  public selectedValue: string;
  public ClientesForm: FormGroup;
  public Sede: Sede[] = [];
  public Subsede: Subsede[] = [];
  public Institucion: Institucion[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteClientes>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ClienteServicios: ClienteService,
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
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
      'apellido': [null, [
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
      'trabajo': [null, [
        Validators.required
      ]],
      'cargo': [null, [
        Validators.required
      ]],
      'calificacioncrediticia': [null, [
        Validators.required
      ]],
      'calificacionpersonal': [null, [
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
      this.ClientesForm.get('codigo').setValue(this.data.objeto.codigo);
      this.ClientesForm.get('dni').setValue(this.data.objeto.dni);
      this.ClientesForm.get('nombre').setValue(this.data.objeto.nombre);
      this.ClientesForm.get('apellido').setValue(this.data.objeto.apellido);
      this.ClientesForm.get('cip').setValue(this.data.objeto.cip);
      this.ClientesForm.get('email').setValue(this.data.objeto.email);
      this.ClientesForm.get('casilla').setValue(this.data.objeto.casilla);
      this.ClientesForm.get('trabajo').setValue(this.data.objeto.trabajo);
      this.ClientesForm.get('cargo').setValue(this.data.objeto.cargo);
      this.ClientesForm.get('calificacioncrediticia').setValue(this.data.objeto.calificacion_crediticia);
      this.ClientesForm.get('calificacionpersonal').setValue(this.data.objeto.calificacion_personal);
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
 }



  /* Enviar al formulario */
  Guardar(formulario) {
    console.log(formulario.value.subsede);
    if (this.data.objeto) {
      // tslint:disable-next-line:max-line-length
      this.ClienteServicios.Actualizar(this.data.id, formulario.value.subsede, formulario.value.codigo,
        formulario.value.dni, formulario.value.nombre, formulario.value.apellido, formulario.value.cip,
        formulario.value.email, formulario.value.casilla, formulario.value.trabajo, formulario.value.cargo,
        formulario.value.calificacioncrediticia, formulario.value.calificacionpersonal, formulario.value.aporte
      ).subscribe(res => console.log(res));

      this.ClientesForm.reset();
      this.ventana.close();
    }

    if (!this.data.objeto) {
      this.ClienteServicios.Agregar(formulario.value.subsede , formulario.value.codigo,
        formulario.value.dni, formulario.value.nombre, formulario.value.apellido,
        formulario.value.cip, formulario.value.email, formulario.value.casilla,
        formulario.value.trabajo, formulario.value.cargo, formulario.value.calificacioncrediticia,
        formulario.value.calificacionpersonal, formulario.value.aporte).subscribe(res => console.log(res));
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
// tslint:disable-next-line:eofline

} // fin clase VentanaEmergenteCliente
