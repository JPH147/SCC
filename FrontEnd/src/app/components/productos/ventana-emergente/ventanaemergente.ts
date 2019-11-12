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

  public tipo : string = "";
  public modelo : string = "";
  public marca : string = "";

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
      'cuotas': [null, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      'descripcion': ["", [
        Validators.required,
      ]],
      'unidad_medida':[{value:null,disabled:true},[
      ]]
    });

    /*Relación de productos*/

    this.Servicios.ListarTipoProductos(null,'', '').subscribe(res => {
      this.Tipos=res;
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
      this.ProductosForm.get('cuotas').setValue(this.data.cuotas);
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
        this.VerificarProducto();
      })
     ).subscribe()
  }

  AgregarTipo() {

    let VentanaTipo = this.DialogoTipo.open(VentanaEmergenteTipo, {
      width: '350px',
      panelClass: "dialogo-rediseno",
    });
 
    VentanaTipo.afterClosed().subscribe(res=>{
      this.Servicios.ListarTipoProductos(null,'', '').subscribe(resultado => {
        this.Tipos=resultado;
        this.ObtenerNombreTipo(res);
      });
      this.ProductosForm.get('tipo').setValue(res);
      this.ListarMarcas(this.ProductosForm.value.tipo);
      this.ProductosForm.get('marca').setValue('');
      this.ProductosForm.get('modelo').setValue('');
      this.ProductosForm.controls['marca'].enable();
      this.ProductosForm.controls['modelo'].disable();
    })
  }

  AgregarMarca() {

    let VentanaMarca = this.DialogoMarca.open(VentanaEmergenteMarca, {
      width: '350px',
      panelClass: "dialogo-rediseno",
      data: {productos:{id_tipo: this.ProductosForm.value.tipo}}
    });
 
    VentanaMarca.afterClosed().subscribe(res=>{
      this.Servicios.ListarMarca(this.ProductosForm.value.tipo, '').subscribe(resultado => {
        this.Marcas=resultado;
        this.ObtenerNombreMarca(res);
      })
      this.ProductosForm.get('marca').setValue(res);
      this.ListarModelos(this.ProductosForm.value.marca);
      this.ProductosForm.get('modelo').setValue('');
      this.ProductosForm.controls['modelo'].enable();
    })
  }

  AgregarModelo() {

    let VentanaModelo = this.DialogoModelo.open(VentanaEmergenteModelo, {
      width: '350px',
      panelClass: "dialogo-rediseno",
      data: {productos:{id_marca: this.ProductosForm.value.marca}}
    });
 
    VentanaModelo.afterClosed().subscribe(res=>{
      this.Servicios.ListarModelo(this.ProductosForm.value.marca, '').subscribe(resultado => {
        this.Modelos=resultado;
        this.ObtenerNombreModelo(res);
     });
      this.ProductosForm.get('modelo').setValue(res);
    })
  }

  /* Se muestran marcas cuando se selecciona un tipo de producto */
  TipoSeleccionado( evento) {

    this.ObtenerNombreTipo(evento.value) ;

    this.ListarMarcas(this.ProductosForm.value.tipo);
    this.Servicios.ListarUnidadMedida(this.ProductosForm.value.tipo).subscribe(res=>this.ProductosForm.get('unidad_medida').setValue(res.data.unidades[0].nombre));
    this.ProductosForm.get('marca').setValue('');
    this.ProductosForm.get('modelo').setValue('');
    this.ProductosForm.controls['marca'].enable();
    this.ProductosForm.controls['modelo'].disable();
  }

  /* Se muestran los modelos cuando se selecciona una marca */
  MarcaSeleccionada(evento) {

    this.ObtenerNombreMarca(evento.value);

    this.ListarModelos(this.ProductosForm.value.marca);
    this.ProductosForm.get('modelo').setValue('');
    this.ProductosForm.controls['modelo'].enable();
  }

  ModeloSeleccionado(evento){
    this.ObtenerNombreModelo(evento.value);
  }

  ObtenerNombreTipo(id_tipo){
    this.marca = "" ;
    this.modelo = "" ;
    this.Tipos.forEach((item)=>{
      if(item.id==id_tipo){
        this.tipo=item.nombre;
        this.AyudarCrearNombre();
      }
    })
  }

  ObtenerNombreMarca(id_marca){
    this.modelo = "" ;
    this.Marcas.forEach((item)=>{
      if(item.id==id_marca){
        this.marca=item.nombre;
        this.AyudarCrearNombre();
      }
    })
  }

  ObtenerNombreModelo(id_modelo){
    this.Modelos.forEach((item)=>{
      if(item.id==id_modelo){
        this.modelo=item.nombre
      }
    })
  }

  AyudarCrearNombre(){
    let descripcion = this.tipo + " " + this.marca + " " + this.modelo;

    if( !this.data ){
      this.ProductosForm.get('descripcion').setValue(descripcion);
      this.VerificarProducto();
    }

  }

  /* Enviar al formulario */
  Guardar(formulario) {
    if (this.data) {
      // tslint:disable-next-line:max-line-length
      this.ProductoServicios.Actualizar(this.data.id, formulario.value.modelo, formulario.value.descripcion, formulario.value.precio, formulario.value.cuotas).subscribe()
    }

    if (!this.data) {
      this.ProductoServicios.Agregar(formulario.value.modelo, formulario.value.descripcion, formulario.value.precio, formulario.value.cuotas).subscribe();
    }
      this.ProductosForm.reset();
      this.ventana.close();
  }

  ListarTipos(){
    this.Servicios.ListarTipoProductos(null,'', '').subscribe(res => {
      this.Tipos = res ;
    })
  }

  ListarMarcas(i) {
    this.Servicios.ListarMarca(i, '').subscribe(res => {
      this.Marcas=res;
    })
  }

  ListarModelos(i) {
    this.Servicios.ListarModelo(i, '').subscribe(res => {
      this.Modelos=res;
   });
  }

  VerificarProducto(){
    let nombre = this.FiltroDescripcion.nativeElement.value ;
    if(this.ProductosForm.value.modelo){
      this.ProductosExistentes=true;
      this.ProductoServicios.Verificar(nombre).subscribe(res=>{
        this.Productos=res;
        
        if (this.data) {
          if (this.Productos['id']=this.data.id){
            this.Productos=[];
          }
        }
  
        if (this.Productos['id']) {
          this.ProductosExistentes=true;
        }else{
          this.ProductosExistentes=false;
        }
      })
    }
  }

  EliminarElemento(array,value){
    array.forEach( (item, index) => {
      if(item.id_producto === value) array.splice(index,1);
    });
  }

  

}
