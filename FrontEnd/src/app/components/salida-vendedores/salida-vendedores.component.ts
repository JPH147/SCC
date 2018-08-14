import { ventanaseriessv } from './ventana-seriessv/ventanaseriessv';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import {COMMA, SPACE} from '@angular/cdk/keycodes';
import {map, startWith, tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SalidaVendedoresService} from './salida-vendedores.service';
import {ServiciosGenerales, Almacen} from '../global/servicios';
import {ServiciosVentas} from '../global/ventas';
import {ProductoService} from '../productos/productos.service'
import {ServiciosProductoSerie} from '../global/productoserie'
import {VentanaTalonarioComponent} from './ventana-talonario/ventana-talonario.component'

@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.css'],
  providers: [SalidaVendedoresService,ServiciosGenerales,ServiciosVentas,ProductoService,ServiciosProductoSerie]
})

export class SalidaVendedoresComponent implements OnInit {
  
  public talonarioSalidaForm: FormGroup;
  public talonarioForm: FormGroup;
  public contador: number;
  public almacenes: Array<any>;
  public serieventana: string;
  public talonventana: string;
  public serietalorarios: Array<any>;
  public Agregatalonarion: any;
  public selectedValue: string;
  public serie: Array<any>;
  public inicio: number;
  public fin: number;
  public numero: number;


  @ViewChild('InputVendedor') FiltroVendedor: ElementRef;
  @ViewChild('InputProducto') FiltroProducto: ElementRef;
  public SalidaVendedoresForm:FormGroup;
  public Sucursales: Array<any>;
  public Vendedor: Array<any>;
  public Almacenes:Almacen[];
  public Producto: Array<any>;
  public vendedores: FormArray;
  public productos: FormArray;
  readonly separatorKeysCodes: number[] = [SPACE,COMMA];
  departamentos: any[] = [];

  animal: string;
  name: string;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  toppings = new FormControl();
  toppingList: string[] = ['Jean Pierre', 'Joel Vicuña', 'Carlos Rodriguez', 'Jean Paul', 'Ivan Arones', 'Fernando Martinez'];

  /***************/

  constructor(
    public dialog: MatDialog,
    public DialogoSerie: MatDialog,
    public Dialogotalon: MatDialog,
    private Servicio: SalidaVendedoresService,
    private FormBuilder: FormBuilder,
    private Global: ServiciosGenerales,
    private Ventas:ServiciosVentas,
    private Articulos: ProductoService,
    private Series: ServiciosProductoSerie
    ) { }

 ngOnInit() {

    this.Global.ListarSucursal(null,"").subscribe(res=>this.Sucursales=res);
    this.Global.ListarAlmacen().subscribe(res=>this.Almacenes=res);
    this.Ventas.ListarVendedor(null,"","").subscribe(res=>this.Vendedor=res['data'].vendedores);
    this.Articulos.Listado("","","","",1,20,"descripcion","asc").subscribe(res=>this.Producto=res['data'].productos)


    this.SalidaVendedoresForm = this.FormBuilder.group({
      'pecosa': [null, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      'sucursal': [null, [
        Validators.required
      ]],
      'fecha_salida': [new Date(), [
        Validators.required
      ]],
      'destino': [null, [
        Validators.required,
      ]],
      'guia_remision': [null, [
        Validators.required
      ]],
      'tipo_movilidad': [false, [
        Validators.required
      ]],
      'placa': [{value:null, disabled:true}, [
        Validators.required
      ]],
      'dni': [{value:null, disabled:true}, [
        Validators.required,
        Validators.pattern ('[0-9- ]+'),
        Validators.minLength(8)
      ]],
      'chofer': [{value:null, disabled:true}, [
        Validators.required
      ]],
      vendedores: this.FormBuilder.array([this.CrearVendedor()]),
      productos: this.FormBuilder.array([this.CrearProducto()])
    });
 }

 ngAfterViewInit(){
   fromEvent(this.FiltroVendedor.nativeElement,'keyup')
   .pipe(
     debounceTime(10),
     distinctUntilChanged(),
     tap(() => {
       this.Ventas.ListarVendedor(null,this.FiltroVendedor.nativeElement.value,"").subscribe(res=>this.Vendedor=res['data'].vendedores);
     })
    ).subscribe();
 
   fromEvent(this.FiltroProducto.nativeElement,'keyup')
   .pipe(
     debounceTime(10),
     distinctUntilChanged(),
     tap(() => {
       this.Articulos.Listado("","","",this.FiltroProducto.nativeElement.value,1,20,"descripcion","asc").subscribe(res=>{this.Producto=res['data'].productos;console.log(res)})
     })
    ).subscribe();

 }

  /*******************/
  /*Chip*/
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.departamentos.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(departamento): void {
    const index = this.departamentos.indexOf(departamento);

    if (index >= 0) {
      this.departamentos.splice(index, 1);
    }
  }
  /*******************/

  displayFn(vendedor) {
    if (vendedor){
      return vendedor.nombre  
    }else{
      return ""
    }
  }

  displayFn2(producto) {
    if (producto){
      return producto.descripcion  
    }else{
      return ""
    }
  }

  CrearVendedor():FormGroup{
    return this.FormBuilder.group({
      'nombre':[{value:null, disabled:false},[
      ]],
      'comision':[{value:null, disabled:false},[
      ]]
    })
  }

  CrearProducto():FormGroup{
    return this.FormBuilder.group({
      'producto':[{value:null, disabled:false},[
      ]],
      'cantidad':[{value:null, disabled:false},[
      ]],
    })
  }

  AgregarVendedor():void{
    this.vendedores = this.SalidaVendedoresForm.get('vendedores') as FormArray;
    this.vendedores.push(this.CrearVendedor())
  };

  EliminarVendedor(index){
    this.vendedores.removeAt(index);
  };


  AgregarProducto():void{
    this.productos = this.SalidaVendedoresForm.get('productos') as FormArray;
    this.productos.push(this.CrearProducto())
  };

  EliminarProducto(index){
    this.productos.removeAt(index);
  };

  Guardar(formulario){
    let destinos:string="";

    for (let i of this.departamentos) {
      destinos=destinos +", "+ i.name
    }

    this.Servicio.Agregar(
      formulario.value.pecosa,
      formulario.value.sucursal,
      formulario.value.fecha_salida,
      destinos,
      formulario.value.guia_remision,
      formulario.value.tipo_movilidad
      ).subscribe(res=>console.log(res));
  }
  
  ActivarMovilidad(event){
    if (event.checked) {
      this.SalidaVendedoresForm.controls['placa'].enable();
      this.SalidaVendedoresForm.controls['dni'].enable();
      this.SalidaVendedoresForm.controls['chofer'].enable();
    }else{
      this.SalidaVendedoresForm.controls['placa'].disable();
      this.SalidaVendedoresForm.controls['dni'].disable();
      this.SalidaVendedoresForm.controls['chofer'].disable();
    }
  }

  VendedorSeleccionado(event,i){
    console.log(event);
    this.SalidaVendedoresForm.get('vendedores').value[i].nombre=event.option.value.id;
    this.SalidaVendedoresForm.get('vendedores')['controls'][i].get('comision').setValue(event.option.value.comision)
    console.log(this.SalidaVendedoresForm.get('vendedores')['controls'][i])
  }
  
  Abierto(event,i){
  //  console.log(event,i)
  }


  AgregarSerieSalidaV(producto) {
    this.Series.Listado(producto.id).subscribe(res=>{
      const serieventana = this.DialogoSerie.open(ventanaseriessv, {
        width: '800px',
        data:{IMEI:res,precio:producto.precio}
      });
    })
  }

AgregarTalonario() {
  const  serietalorarios = this.Dialogotalon.open(VentanaTalonarioComponent, {
    width: '800px'
  });

}

// openDialog(): void {
//   const dialogRef = this.dialog.open(DialogoComponent, {
//     width: '250px',
//     data: {name: this.name, animal: this.animal}
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     console.log('The dialog was closed');
//     this.animal = result;
//   });
// }

}