import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, TipoProductoModelo, MarcaModelo, ModeloModelo} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {ProductoService} from '../productos.service';

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales, ProductoService]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteProductos {

  public selectedValue: string;
  public ProductosForm: FormGroup;
  public Tipos: TipoProductoModelo[] = [];
  public Marcas: MarcaModelo[] = [];
  public Modelos: ModeloModelo[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteProductos>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ProductoServicios: ProductoService,
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    /* Crear formulario */
    this.ProductosForm = this.FormBuilder.group({
      'tipo': [null, [
        Validators.required
      ]],
      'marca': [{value: null, disabled: true}, [
        Validators.required
      ]],
      'modelo': [{value: null, disabled: true}, [
        Validators.required
      ]],
      'precio': [null, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      'descripcion': [null, [
        Validators.required
      ]],
    });

    /*Relación de productos*/
    this.Servicios.ListarTipoProductos('', '').subscribe(res => {
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Tipos.push(res[i]);
      }
    });

    if (this.data) {
      // Se traen y asignan los datos
      this.ProductosForm.get('tipo').setValue(this.data.tipo);
      this.ListarMarcas(this.data.tipo);
      this.ProductosForm.get('marca').setValue(this.data.marca);
      this.ListarModelos(this.data.marca);
      this.ProductosForm.get('modelo').setValue(this.data.modelo);
      this.ProductosForm.get('descripcion').setValue(this.data.descripcion);
      this.ProductosForm.get('precio').setValue(this.data.precio);
      // Se habilitan los formularios
      this.ProductosForm.controls['marca'].enable();
      this.ProductosForm.controls['modelo'].enable();
    }

  }

  /* Se muestran marcas cuando se selecciona un tipo de producto */
  TipoSeleccionado(event) {
      this.ListarMarcas(event.value);
      this.ProductosForm.get('marca').setValue('');
      this.ProductosForm.get('modelo').setValue('');
      this.ProductosForm.controls['marca'].enable();
      this.ProductosForm.controls['modelo'].disable();
    }

  /* Se muestran los modelos cuando se selecciona una marca */
  MarcaSeleccionada(event) {
    this.ListarModelos(event.value);
    this.ProductosForm.get('modelo').setValue('');
    this.ProductosForm.controls['modelo'].enable();
   }


  /* Enviar al formulario */
  Guardar(formulario) {
    if (this.data) {
      // tslint:disable-next-line:max-line-length
      this.ProductoServicios.Actualizar(this.data.id, formulario.value.modelo, formulario.value.descripcion, formulario.value.precio).subscribe()
    }

    if (!this.data) {
      this.ProductoServicios.Agregar(formulario.value.modelo, formulario.value.descripcion, formulario.value.precio).subscribe();
    }
      this.ProductosForm.reset();
      this.ventana.close();
  }

  ListarMarcas(i) {
    this.Servicios.ListarMarca(i, '').subscribe(res => {
      this.Marcas = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Marcas.push(res[i]);
      }
  })}

  ListarModelos(i) {
    this.Servicios.ListarModelo(i, '').subscribe(res => {
      this.Modelos = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Modelos.push( res[i] );
      }
   });

  }
}
