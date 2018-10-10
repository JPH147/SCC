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
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.TelefonosForm = this.FormBuilder.group({
      items : this.FormBuilder.array([this.createTelefono(1)])
  });

  this.ListarDirecciones(this.data);
  this.ListarTelefonos(this.data);

  this.DireccionesForm = this.FormBuilder.group({
    itemsDir : this.FormBuilder.array([this.createDirecciones(1)])
});


  this.ListarTipos();
  this.ListarRelevancia();
  this.ListarDepartamento();
  this.ListarRelevanciaDireccion();
}
createTelefono(value): FormGroup {
  return this.FormBuilder.group({
    telefono: [null,[
      Validators.required,
      Validators.pattern('[0-9- ]+')
    ]],
    tipo: [{value:2,disabled:false},[

    ]] ,
    relevancia: [{value: value, disabled: false},[

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
    ListarRelevanciaDireccion() {
      this.RelevanciaDireccion = [
        {id: 1, viewValue: 'Primaria'},
        {id: 2, viewValue: 'Secundaria'},
      ];
    }

  GuardarTelefonos(formulario) {

    // tslint:disable-next-line:forin
    for (let i in formulario.get('items').value) {
      this.ServicioTelefono.CrearTelefono(this.data, formulario.get('items').value[i].telefono ,
      formulario.get('items').value[i].observacion, formulario.get('items').value[i].tipo,
      formulario.getRawValue().items[i].relevancia).subscribe(res => console.log(res));
    }

      this.ventana.close();
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
      relevanciadis: [{value: value, disabled: false}, [
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
      // tslint:disable-next-line:forin
      for (let i in formulario.get('itemsDir').value) {
        this.ServicioDireccion.CrearDireccion(this.data, formulario.get('itemsDir').value[i].direccion ,
        formulario.get('itemsDir').value[i].distrito,
        formulario.getRawValue().itemsDir[i].relevanciadis,
        formulario.get('itemsDir').value[i].observacion
        ).subscribe(res => console.log(res));
      this.ventana.close();
      }
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
    console.log(this.LstProvincia);
    this.DireccionesForm.get('itemsDir')['controls'][i].get('provincia').setValue('');
  }

  ProvinciaSeleccionada(event, i) {
    console.log(this.DireccionesForm.get('itemsDir')['controls'][i].get('provincia').value);
    this.ServicioDireccion.ListarDistritos('', event.value, '' , 0, 50).
    subscribe(res => this.LstDistrito = res['data'].distritos);
    this.DireccionesForm.get('itemsDir')['controls'][i].get('distrito').setValue('');
  }

  ListarDirecciones(id: number) {
    console.log(id);
    if (id) {
        this.ServicioDireccion.ListarDireccion(id.toString() ,'').subscribe(res => {
          if (res) {
            console.log(res);
            // tslint:disable-next-line:forin
            for (let i = 0; i < res.length - 1 ; i++) {
              this.addDirecciones();
            }
            // tslint:disable-next-line:forin
            for (let i in res) {
              this.DireccionesForm.get('itemsDir')['controls'][i].get('direccion').setValue(res[i].direccion);
              this.DireccionesForm.get('itemsDir')['controls'][i].get('observacion').setValue(res[i].observacion);
              this.DireccionesForm.get('itemsDir')['controls'][i].get('departamento').setValue(res[i].departamento);
              this.ListarProvincia(res[i].departamento);
              console.log(res[i].departamento);
              this.DireccionesForm.get('itemsDir')['controls'][i].get('provincia').setValue(res[i].provincia);
              this.ListarDistrito(res[i].provincia);
              console.log(res[i].provincia);
              this.DireccionesForm.get('itemsDir')['controls'][i].get('distrito').setValue(res[i].id_distrito);
            }
          }
        });
    }
  }

  ListarTelefonos(id: number) {
    if (id) {
        this.ServicioTelefono.ListarTelefono( id.toString() , '' ).subscribe(res => {
          if (res) {
            console.log(res);
            // tslint:disable-next-line:forin
            for (let i = 0; i < res.length  - 1 ; i++) {
              this.add();
            }
            // tslint:disable-next-line:forin
            for (let i in res) {
              this.TelefonosForm.get('items')['controls'][i].get('telefono').setValue(res[i].tlf_numero);
              this.TelefonosForm.get('items')['controls'][i].get('observacion').setValue(res[i].tlf_observacion);
              this.TelefonosForm.get('items')['controls'][i].get('tipo').setValue(res[i].id_tipo);
            }
          }
        });
    }
  }/*ListarTelefonos() {
    if (this.idcliente) {
        this.ServicioTelefono.ListarTelefono( this.idcliente.toString() , '1').subscribe(res => {
          if (res) {
            this.VentasForm.get('telefono').setValue(res[0].tlf_numero);
          }
        });
    }
  }*/
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

