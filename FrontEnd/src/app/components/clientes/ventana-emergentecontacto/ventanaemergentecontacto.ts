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
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.TelefonosForm = this.FormBuilder.group({
      items : this.FormBuilder.array([this.createTelefono(1)])
  });

  this.DireccionesForm = this.FormBuilder.group({
    itemsDir : this.FormBuilder.array([this.createDirecciones(1)])
});


  this.ListarTipos();
  this.ListarRelevancia();
  this.ListarDepartamento();
}
createTelefono(value): FormGroup {
  return this.FormBuilder.group({
    telefono: [null,[
      Validators.required,
      Validators.pattern('[0-9- ]+')
    ]],
    tipo: [{value:2,disabled:false},[

    ]] ,
    relevancia: [{value:value,disabled:true},[

    ]],
    observacion: [null,[
      Validators.required
    ]]
  });
}

  add(): void {
    this.items = this.TelefonosForm.get('items') as FormArray;
    this.items.push(this.createTelefono(2));
  }
 /* Para eliminar items */
  /*
  EliminarItem(index){
    this.items.removeAt(index);
  }*/
  ListarTipos() {
      this.Tipos = [
        {id: 1, viewValue: 'Celular'},
        {id: 2, viewValue: 'Casa'},
        {id: 3, viewValue: 'Trabajo'},
        {id: 4, viewValue: 'Otro'}];
  }
  ListarRelevancia() {
      this.Relevancias = [
        {id: 1, viewValue: 'Principal'},
        {id: 2, viewValue: 'Secundario'},
        {id: 0, viewValue: 'Inactivo'},
      ];
    }

  GuardarTelefonos(formulario) {
    console.log(formulario.get('items').value);
    /*
    if (this.data !== 0) {
      console.log(this.data);
      this.ServicioTelefono.CrearTelefono(this.data, formulario.value.telefono ,
        formulario.value.observacion, formulario.value.tipo,
        formulario.value.relevancia).subscribe(res => console.log(res));
    }
      this.ventana.close();
      */
  }

  createDirecciones(value): FormGroup {
    return this.FormBuilder.group({
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
      relevancia: [{value: value, disabled: true}, [
      ]],
      observacion: [null,[
        Validators.required
      ]]
    });
  }

    addDirecciones(): void {
      this.itemsDir = this.DireccionesForm.get('itemsDir') as FormArray;
      this.itemsDir.push(this.createDirecciones(2));
    }

  GuardarDirecciones(formulario) {
    if (this.data !== 0) {
      console.log(this.data);
      this.ServicioDireccion.CrearDireccion(this.data, formulario.value.direccion ,
        formulario.value.distrito , formulario.value.relevancia,
        formulario.value.observacion).subscribe(res => console.log(res));
    }
      this.ventana.close();
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

  DepartamentoSeleccionado(event) {
    console.log(event.value);
    this.ListarProvincia(event.value);
    this.DireccionesForm.get('provincia').setValue(null);
    this.DireccionesForm.get('distrito').setValue(null);
    this.DireccionesForm.controls['provincia'].enable();
    this.DireccionesForm.controls['distrito'].disable();
  }

  ProvinciaSeleccionada(event) {
  this.ListarDistrito(event.value);
  this.DireccionesForm.get('distrito').setValue(null);
  this.DireccionesForm.controls['distrito'].enable();
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

