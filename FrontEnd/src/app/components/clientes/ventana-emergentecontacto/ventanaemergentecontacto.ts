import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray , FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosTelefonos} from '../../global/telefonos';
import {ServiciosDirecciones} from '../../global/direcciones';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-ventanaemergentecontacto',
  templateUrl: './ventanaemergentecontacto.html',
  styleUrls: ['./ventanaemergentecontacto.css'],
  providers: [ServiciosTelefonos, ServiciosDirecciones]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteContacto {
  // Telefonos
  public TelefonosForm: FormGroup;
  public Tipos: TipoTelefono[];
  public Relevancias: RelevanciaTelefono[];
  public contador: number;
  public items: FormArray;
  public LstDepartamento: any;
  public LstProvincia: any;
  public LstDistrito: any;

  // Direcciones
  public DireccionesForm: FormGroup;
  public itemsDir: FormArray;
  public RelevanciaDireccion: RelevanciaDireccion[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteContacto>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private ServicioTelefono: ServiciosTelefonos,
    private ServicioDireccion: ServiciosDirecciones
  ) {
    this.contador = 1;
  }

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit() {
    this.TelefonosForm = this.FormBuilder.group({
      items : this.FormBuilder.array([this.createTelefono(1)])
    });

    this.DireccionesForm = this.FormBuilder.group({
      itemsDir : this.FormBuilder.array([this.createDirecciones(1)])
    });

    this.ListarDirecciones(this.data);
    this.ListarTelefonos(this.data);

    this.ListarTipos();
    this.ListarRelevancia();
    this.ListarDepartamento();
    this.ListarRelevanciaDireccion();
  }

  createTelefono(value): FormGroup {
    return this.FormBuilder.group({
      id:[null,[
      ]],
      telefono: [null,[
        Validators.required,
        Validators.minLength(7),
        Validators.pattern('[0-9- ]+')
      ]],
      tipo: [{value:2,disabled:false},[
        Validators.required,
      ]] ,
      relevancia: [{value: value, disabled: false},[
        Validators.required,
      ]],
      observacion: ['',[
      ]],
      estado:[null,[
      ]]
    });
  }

  AgregarTelefono(): void {
    this.items = this.TelefonosForm.get('items') as FormArray;
    this.items.push(this.createTelefono(2));
  }
  
  EliminarTelefono(form,index){
    form.get('estado').setValue(2);
    form.get('telefono').disable();
    form.get('tipo').disable();
    form.get('relevancia').disable();
    form.get('observacion').disable();
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

  GuardarTelefonos(formulario) {

    for (let telefono of formulario.get('items').value) {
      
      // Agregar
      if (telefono.estado == null) {
        console.log(telefono);
        this.ServicioTelefono.CrearTelefono(
          this.data,
          telefono.telefono,
          telefono.observacion,
          telefono.tipo,
          telefono.relevancia
        ).subscribe(res=>{
        })
      }
      
      // Eliminar
      if (telefono.estado == 2 && telefono.id != null ) {
        this.ServicioTelefono.EliminarTelefono(
          telefono.id
        ).subscribe(res=>{
        })
      }
      
      // if (telefono.estado == 1) {
      //   console.log("Actualizar")
      // }

    }
    this.ventana.close();
  }

  createDirecciones(value): FormGroup {
    return this.FormBuilder.group({
      id:[null,[
      ]],
      direccion: [null,[
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
      relevanciadis: [{value: value, disabled: false}, [
      ]],
      observacion: ['',[
      ]],
      estado:[null,[
      ]]
    });
  }

  AgregarDirecciones(): void {
    this.itemsDir = this.DireccionesForm.get('itemsDir') as FormArray;
    this.itemsDir.push(this.createDirecciones(2));
  }

  EliminarDireccion(form,index){
    form.get('estado').setValue(2);
    form.get('direccion').disable();
    form.get('departamento').disable();
    form.get('provincia').disable();
    form.get('distrito').disable();
    form.get('relevanciadis').disable();
    form.get('observacion').disable();
  }

  GuardarDirecciones(formulario) {

    for (let direccion of formulario.get('itemsDir').value) {
      
      // Agregar
      if (direccion.estado == null) {
        this.ServicioDireccion.CrearDireccion(
          this.data,
          direccion.direccion,
          direccion.distrito,
          direccion.relevanciadis,
          direccion.observacion
        ).subscribe(res=>console.log(res))
      }
      
      // Eliminar
      if (direccion.estado == 2 && direccion.id != null ) {
        this.ServicioDireccion.EliminarDireccion(
          direccion.id
        ).subscribe(res=>console.log(res))
      }
      this.ventana.close();
    }
  }
  
  ListarDepartamento() {
    this.ServicioDireccion.ListarDepartamentos('', 0, 50).subscribe( res => {
      this.LstDepartamento = res['data'].departamentos;
    });
  }

  ListarProvincia(i) {
    this.ServicioDireccion.ListarProvincias(i, '' , 0, 30).subscribe( res => {
      this.LstProvincia = res['data'].provincias;
    });
  }

  ListarDistrito(i) {
    this.ServicioDireccion.ListarDistritos('', i , '', 0, 50).subscribe( res => {
      this.LstDistrito = res['data'].distritos;
    });
  }

  DepartamentoSeleccionado(event, i) {
    this.ServicioDireccion.ListarProvincias(event.value, '' , 0, 30).
    subscribe(res => this.LstProvincia = res['data'].provincias);
    // console.log(this.LstProvincia);
    this.DireccionesForm.get('itemsDir')['controls'][i].get('provincia').setValue('');
  }

  ProvinciaSeleccionada(event, i) {
    // console.log(this.DireccionesForm.get('itemsDir')['controls'][i].get('provincia').value);
    this.ServicioDireccion.ListarDistritos('', event.value, '' , 0, 50).
    subscribe(res => this.LstDistrito = res['data'].distritos);
    this.DireccionesForm.get('itemsDir')['controls'][i].get('distrito').setValue('');
  }


  ListarTelefonos(id_cliente: number) {
    this.ServicioTelefono.ListarTelefono( id_cliente , '' ).subscribe(res => {
      if (res) {
        // console.log(res)
        for (let i = 0; i < res.length  - 1 ; i++) {
          this.AgregarTelefono();
        }
        for (let i in res) {
          this.TelefonosForm.get('items')['controls'][i].get('id').setValue(res[i].id);
          this.TelefonosForm.get('items')['controls'][i].get('telefono').setValue(res[i].tlf_numero);
          this.TelefonosForm.get('items')['controls'][i].get('telefono').disable();
          this.TelefonosForm.get('items')['controls'][i].get('observacion').setValue(res[i].tlf_observacion);
          this.TelefonosForm.get('items')['controls'][i].get('observacion').disable();
          this.TelefonosForm.get('items')['controls'][i].get('tipo').setValue(res[i].id_tipo);
          this.TelefonosForm.get('items')['controls'][i].get('tipo').disable();
          this.TelefonosForm.get('items')['controls'][i].get('relevancia').setValue(res[i].tlf_relevancia);
          this.TelefonosForm.get('items')['controls'][i].get('relevancia').disable();
          this.TelefonosForm.get('items')['controls'][i].get('estado').setValue(res[i].estado);
        }
      }
    });
  }

  ListarDirecciones(id: number) {
    if (id) {
      this.ServicioDireccion.ListarDireccion(id.toString() ,'').subscribe(res => {
        if (res) {
          for (let i = 0; i < res.length - 1 ; i++) {
            this.AgregarDirecciones();
          }
          for (let i in res) {
            this.DireccionesForm.get('itemsDir')['controls'][i].get('id').setValue(res[i].id);
            this.DireccionesForm.get('itemsDir')['controls'][i].get('direccion').setValue(res[i].direccion);
            this.DireccionesForm.get('itemsDir')['controls'][i].get('observacion').setValue(res[i].observacion);
            this.DireccionesForm.get('itemsDir')['controls'][i].get('estado').setValue(res[i].estado);
            this.DireccionesForm.get('itemsDir')['controls'][i].get('relevanciadis').setValue(res[i].relevancia);
            this.DireccionesForm.get('itemsDir')['controls'][i].get('departamento').setValue(res[i].departamento);
            this.ListarProvincia(res[i].departamento);
            this.DireccionesForm.get('itemsDir')['controls'][i].get('provincia').setValue(res[i].provincia);
            this.ListarDistrito(res[i].provincia);
            this.DireccionesForm.get('itemsDir')['controls'][i].get('distrito').setValue(res[i].id_distrito);

            this.DireccionesForm.get('itemsDir')['controls'][i].get('direccion').disable()
            this.DireccionesForm.get('itemsDir')['controls'][i].get('observacion').disable()
            this.DireccionesForm.get('itemsDir')['controls'][i].get('relevanciadis').disable()
            this.DireccionesForm.get('itemsDir')['controls'][i].get('departamento').disable()
            this.DireccionesForm.get('itemsDir')['controls'][i].get('provincia').disable()
            this.DireccionesForm.get('itemsDir')['controls'][i].get('distrito').disable()
          }
        }
      });
    }
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


