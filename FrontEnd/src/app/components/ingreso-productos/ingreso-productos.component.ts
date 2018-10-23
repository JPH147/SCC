import { Component, OnInit, ViewChild,ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Cliente } from './../clientes/clientes.service';
import { IngresoProductoService } from './ingreso-productos.service';
import {ServiciosProductoSerie} from '../global/productoserie';
import { ServiciosGenerales, Almacen, ListarCliente, ListarVendedor } from './../global/servicios';
import { ventanaseries } from './ventana-series/ventanaseries';
import { FormControl, FormBuilder, FormGroup, Validators, PatternValidator,FormArray } from '@angular/forms';
import {Observable, fromEvent} from 'rxjs';
import { MatDialog,MatSnackBar } from '@angular/material';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {ProductoService} from '../productos/productos.service';


@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styleUrls: ['./ingreso-productos.component.css'],
  providers: [ServiciosGenerales, IngresoProductoService,ProductoService,ServiciosProductoSerie]
})
  export class IngresoProductosComponent implements OnInit {

    @ViewChild('Proveedor') FiltroProveedor: ElementRef;
    @ViewChild('Cliente') FiltroCliente: ElementRef;
    @ViewChild('Vendedor') FiltroVendedor: ElementRef;

    public IngresoProductoForm: FormGroup;
    public contador: number;
    public almacenes: Array<any> = [];
    public TipoIngresos: Array<any> = [];
    public proveedores: Array<any> = [];
    public clientes: Array<any> = [];
    public Vendedores: Array<any> = [];
    public Sucursales: Array<any> = [];
    public seriventana: string;
    public tipoIngreso: string;      // Tipo de Ingreso Almacen
    public docReferencia: string; // documento referencia de ingreso almncen
    public proveedor: string;
    public cliente: string;
    public vendedor: string;
    public nombre: string;
    public fecingreso: Date;      // fecha de ingreso a almcen
    public  data;


    @ViewChildren('InputProducto') FiltroProducto: QueryList<any>;
    public productos: FormArray;
    public Series: any[] = [];
    public Producto: Array<any>;

    selected = 'option2';
    myControl = new FormControl();
    filteredOptions: Observable<string[]>;

    constructor(public DialogoSerie: MatDialog,
    // tslint:disable-next-line:no-shadowed-variable
      private FormBuilder: FormBuilder,
      public snackBar: MatSnackBar,
      private Servicios: ServiciosGenerales,
      private IngresoProductoservicios: IngresoProductoService,
      private Articulos: ProductoService,
      private SSeries: ServiciosProductoSerie
    ) {}

    ngOnInit() {

      this.ListarAlmacen();
      this.ListarTransaccionTipo();
      this.ListarProveedor('');
      this.ListarCliente('');
      this.ListarVendedor('');

      // this.SSeries.CrearProductoSerie(10,"JPERTUI").subscribe(res=>console.log(res.data))
      // this.IngresoProductoservicios.CrearTransaccionDetalle(40,40,1,1000).subscribe(res=>console.log(res))

      this.IngresoProductoForm = this.FormBuilder.group({
          'almacen': [null, [Validators.required] ],
          'almacen1': [null, [Validators.required] ],
          'tipoIngreso': [null, [Validators.required]],
          'docReferencia': [null, [Validators.required]],
          'proveedor': [null, [Validators.nullValidator] ],
          'cliente': [null, [Validators.nullValidator]],
          'vendedor': [null, [Validators.nullValidator]],
          'sucursal': [null, [Validators.nullValidator]],
          'documento': [null, [Validators.nullValidator]],
          'fecingreso': [null, [Validators.required]],
          'producto': [null, [Validators.required]],
          'cantidad': [null, [Validators.required]],
          'precioUnitario': [null, [Validators.required]],
          productos: this.FormBuilder.array([this.CrearProducto()])
      });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {

      fromEvent(this.FiltroProveedor.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.ListarProveedor(this.FiltroProveedor.nativeElement.value);
        })
       ).subscribe();

      this.FiltroProducto.changes.subscribe(res => {
        // tslint:disable-next-line:forin
        for (let i in this.FiltroProducto['_results']) {
          fromEvent(this.FiltroProducto['_results'][i].nativeElement,'keyup')
          .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(()=>{
                if (this.FiltroProducto['_results'][i].nativeElement.value) {
                  this.ProductoSeleccionado(this.FiltroProducto['_results'][i].nativeElement.value)
                }
              })
            ).subscribe()
        }
      })
    }

    /*********************************************/
    CrearProducto(): FormGroup{
      return this.FormBuilder.group({
        'producto': [{value: null, disabled: false}, [
          Validators.required
        ]],
        'cantidad': [{value: null, disabled: true}, [
        ]],
        'precioUnitario': [{value:null, disabled: false}, [
          Validators.required,
          Validators.pattern ('[0-9- ]+')
        ]],
      })
    }

    AgregarProducto():void{
      this.productos = this.IngresoProductoForm.get('productos') as FormArray;
      this.productos.push(this.CrearProducto());
    };

    ResetearForm(event) {
      this.ResetearFormArray(this.productos);
      this.Series = [];
      this.Articulos.Listado('', '', '', '', null,null,1, 10, 'descripcion', 'asc',1).subscribe(res => this.Producto = res['data'].productos);
    }

    ResetearFormArray = (formArray: FormArray) => {
      if (formArray) {
        formArray.reset();
        while (formArray.length !== 1) {
          formArray.removeAt(0);
        }
      }
    }

    EliminarProducto(producto, i) {
      this.productos.removeAt(i);
    };

    EliminarElemento(array,value) {
      array=array.filter(e=>e.id!=value)
    }

    EliminarElemento2(array,value) {
       array=array.filter(e=>e.id_producto!=value)
    }

    ProductoSeleccionado(index){
      console.log(index)
      this.Articulos.Listado('', '', '', '', null,null,1, 10, 'descripcion', 'asc',1).subscribe(res => {
        this.Producto = res['data'].productos;
        for (let i of this.IngresoProductoForm['controls'].productos.value) {
          if (i.producto) {
            this.EliminarElemento(this.Producto,i.producto.id)
          }
        }
      });
      this.IngresoProductoForm.get('productos')['controls'][index].get('cantidad').setValue(0)
    }

    displayFn2(producto) {
      if (producto) {
        return producto.descripcion;
      } else {
        return '';
      }
    }
    /*********************************************/

    displayCliente(cliente?: any): string | undefined {
      return cliente ? cliente.nombre : undefined;
    }

    displayProveedor(proveedor?: any): string | undefined {
      return proveedor ? proveedor.nombre : undefined;
    }

    displayVendedor(vendedor?: any): string | undefined {
      return vendedor ? vendedor.nombre : undefined;
    }


    // Selector Proveedores activos
    ListarProveedor(nombre: string) {
      this.Servicios.ListarProveedor(nombre).subscribe( res => {
        this.proveedores = [];
       // console.log(res);
        // tslint:disable-next-line:forin
        for (let i in res) {
          this.proveedores.push(res[i]);
        }
      });
    }

    // Selector tipo de ingresos
    ListarTransaccionTipo() {
      this.Servicios.ListarTransaccionTipo().subscribe( res => {
        this.TipoIngresos = [];
        // tslint:disable-next-line:forin
        for (let i in res) {
            this.TipoIngresos.push(res[i]);

        }
      });
    }

    ListarCliente(nombre: string) {
      this.Servicios.ListarCliente(nombre).subscribe( res => {
        this.clientes = [];
        // tslint:disable-next-line:forin
        for (let i in res) {

            this.clientes.push(res[i]);
            // console.log(res[i]);
        }
      });
    }

    ListarVendedor(nombre: string) {
      this.Servicios.ListarVendedor(nombre).subscribe( res => {
        this.Vendedores = [];

        // tslint:disable-next-line:forin
        for (let i in res) {
            this.Vendedores.push(res[i]);

        }
      });
    }

    // Selector Almacenes Activos
    ListarAlmacen() {
      this.Servicios.ListarAlmacen().subscribe( res => {
        this.almacenes = [];
        // tslint:disable-next-line:forin
        for ( let i in res) {
          this.almacenes.push(res [i]);
        }

      });

    }

  AgregarSerie(producto,index) {

    const serieventana = this.DialogoSerie.open(ventanaseries, {
      width: '1200px',
      data: {producto: producto.get('producto').value.id, series:this.Series}
    });

    serieventana.afterClosed().subscribe(res=>{
      if (res) {

        for (let i of res) {
          this.EliminarElemento2(this.Series,i.producto)
        }

        for (let i of res) {
          if (i.serie !== '') {
            this.Series.push({id_producto: producto.get('producto').value.id, serie: i.serie, color:i.color, almacenamiento: i.almacenamiento, observacion:i.observacion})
          }
        }
        this.IngresoProductoForm.get('productos')['controls'][index].get('cantidad').setValue(res.length)
      }
    })
  }



  Guardar(formulario) {

   // tslint:disable-next-line:prefer-const
   let tipoingreso = formulario.value.tipoIngreso;

   if (tipoingreso === 1) {
    this.IngresoProductoservicios.AgregarCompraMercaderia(
      formulario.value.almacen,
      1,
      1,
      formulario.value.proveedor.id,
      formulario.value.fecingreso,
      formulario.value.docReferencia).subscribe (res => {
        let id_cabecera = res['data'];
          for (let i of formulario.value.productos) {
            for (let is of this.Series) {
              if (i.producto.id === is.id_producto) {
                this.SSeries.CrearProductoSerie(i.producto.id,is.serie, is.color, is.almacenamiento).subscribe(response => {
                  this.IngresoProductoservicios.CrearTransaccionDetalle(id_cabecera, response['data'], 1, i.precioUnitario, is.observacion).subscribe();
                });
              }
            }
          }
        this.IngresoProductoForm.reset();
        this.Series = [];
        this.ResetearFormArray(this.productos);
        this.snackBar.open('El ingreso se guardó satisfactoriamente', '', {
          duration: 2000,
        });

      });
   }

   

   // if (tipoingreso === 2) {
   //  this.IngresoProductoservicios.AgregarDevolucionCliente(
   //    formulario.value.almacen,
   //    2,
   //    2,
   //    formulario.value.cliente.id,
   //    formulario.value.fecingreso,
   //    formulario.value.docReferencia).subscribe (res => console.log(res));
   // }

   // if (tipoingreso === 6) {
   //  this.IngresoProductoservicios.AgregarDevolucionVendedor (
   //    formulario.value.almacen,
   //    6,
   //    5,
   //    formulario.value.vendedor.id,
   //    formulario.value.fecingreso,
   //    formulario.value.docReferencia).subscribe (res => console.log(res));
   // }

   // if (tipoingreso === 7) {
   //  this.IngresoProductoservicios.AgregarTransferenciaSucursal (
   //    formulario.value.almacen,
   //    7,
   //    4,
   //    formulario.value.almacen1,
   //    formulario.value.fecingreso,
   //     formulario.value.docReferencia).subscribe (res => console.log(res));
   // }

   // this.IngresoProductoForm.reset();
   // this.Series=[];
   // this.ResetearFormArray(this.productos);
  }

}