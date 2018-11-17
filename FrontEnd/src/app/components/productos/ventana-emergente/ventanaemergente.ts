import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, TipoProductoModelo, MarcaModelo, ModeloModelo} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {ProductoService} from '../productos.service';
import {merge,fromEvent} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { VentanaEmergenteTipo } from '../../detalleproductos/tipo/ventana-emergente/ventanaemergente';
import { VentanaEmergenteModelo } from '../../detalleproductos/modelo/ventana-emergente/ventanaemergente';
import { VentanaEmergenteMarca } from '../../detalleproductos/marca/ventana-emergente/ventanaemergente';

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales, ProductoService]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteProductos {

  @ViewChild('InputDescripcion') FiltroDescripcion: ElementRef;

  public selectedValue: string;
  public ProductosForm: FormGroup;
  public Tipos: TipoProductoModelo[] = [];
  public Marcas: MarcaModelo[] = [];
  public Modelos: ModeloModelo[] = [];
  public unidad_medida: string;
  public Productos: Array<any>=[];
  public ProductosExistentes: boolean=false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteProductos>,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ProductoServicios: ProductoService,
    public DialogoTipo: MatDialog,
    public DialogoMarca: MatDialog,
    public DialogoModelo: MatDialog,
    public DialogoProductos: MatDialog
    ) {}

  // onNoClick(): void {
  //   this.ventana.close();
  // }

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
        Validators.required,
      ]],
      'unidad_medida':[{value:null,disabled:true},[
      ]]
    });

    /*Relación de productos*/

    this.Servicios.ListarTipoProductos('', '').subscribe(res => {
      for (let i in res) {
        this.Tipos.push(res[i]);
      }
    });

    if (this.data) {
      // Se traen y asignan los datos
      this.ProductosForm.get('tipo').setValue(this.data.tipo);
      this.Servicios.ListarUnidadMedida(this.data.tipo).subscribe(res=>this.ProductosForm.get('unidad_medida').setValue(res.data.unidades[0].nombre));
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

  ngAfterViewInit(){
    fromEvent(this.FiltroDescripcion.nativeElement,'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.VerificarProducto(this.FiltroDescripcion.nativeElement.value);
      })
     ).subscribe()
  }


  AgregarTipo() {

    let VentanaTipo = this.DialogoTipo.open(VentanaEmergenteTipo, {
      width: '350px',
      panelClass: "dialogo-rediseno",
    });
 
    // VentanaTipo.afterClosed().subscribe(res => {
    //   let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos,{
    //     width: '600px',
    //     panelClass: "dialogo-rediseno"

    //   });
    // });
  }

  AgregarMarca() {

    let VentanaMarca = this.DialogoMarca.open(VentanaEmergenteMarca, {
      width: '350px',
      panelClass: "dialogo-rediseno"
    });
 
    // VentanaMarca.afterClosed().subscribe(res => {
    //   let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos,{
    //     width: '600px',
    //     panelClass: "dialogo-rediseno"

    //   });
    // });
  }

  AgregarModelo() {

    let VentanaModelo = this.DialogoModelo.open(VentanaEmergenteModelo, {
      width: '350px',
      panelClass: "dialogo-rediseno"
    });
 
    // VentanaModelo.afterClosed().subscribe(res => {
    //   let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos,{
    //     width: '600px',
    //     panelClass: "dialogo-rediseno"

    //   });
    // });
  }

  /* Se muestran marcas cuando se selecciona un tipo de producto */
  TipoSeleccionado(event) {
      this.ListarMarcas(event.value);
      this.Servicios.ListarUnidadMedida(event.value).subscribe(res=>this.ProductosForm.get('unidad_medida').setValue(res.data.unidades[0].nombre));
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

  ListarTipos(){
    this.Servicios.ListarTipoProductos('', '').subscribe(res => {
      this.Marcas = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.Tipos.push(res[i]);
      }
    })}

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

  VerificarProducto(nombre){
    this.ProductoServicios.Verificar(nombre).subscribe(res=>{
      this.Productos=res;
      
      if (this.data) {
        if (this.Productos['id']=this.data.id){
          this.Productos=[];
        }
      }

      if (this.Productos['id']) {
        this.ProductosExistentes=true
      }else{
        this.ProductosExistentes=false
      }
    })
  }

  EliminarElemento(array,value){
    array.forEach( (item, index) => {
      if(item.id_producto === value) array.splice(index,1);
    });
  }

  

}
