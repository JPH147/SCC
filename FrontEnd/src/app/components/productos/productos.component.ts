import { VentanaEmergenteProductos } from './ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog,MatSelect,MatSnackBar } from '@angular/material';
import {merge, Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ProductoService} from './productos.service';
import {ProductoDataSource} from './productos.dataservice';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import {ImagenProductoComponent} from './imagen-producto/imagen-producto.component'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductoService]
})

export class ProductosComponent implements OnInit {

  ListadoProductos: ProductoDataSource;
  Columnas: string[] = ['numero', 'descripcion', 'tipo', 'marca', 'modelo', 'precio', 'opciones'];
  // tslint:disable-next-line:no-inferrable-types

  @ViewChild('InputProducto') FiltroProductos: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: ElementRef;
  @ViewChild('InputMarca') FiltroMarca: ElementRef;
  @ViewChild('InputModelo') FiltroModelo: ElementRef;
  @ViewChild('InputPMinimo') FiltroPMinimo: ElementRef;
  @ViewChild('InputPMaximo') FiltroPMaximo: ElementRef; 
  @ViewChild('InputEstado') FiltroEstado:MatSelect;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private Servicio: ProductoService,
    public DialogoProductos: MatDialog,
    public snackBar: MatSnackBar,
    public DialogFileUpload: MatDialog,
  ) {}

  ngOnInit() {
   this.ListadoProductos = new ProductoDataSource(this.Servicio);
   // tslint:disable-next-line:quotemark
   this.ListadoProductos.CargarProductos('', '', '', '',null,null, 1, 10, "descripcion", "asc",1);
 }

// tslint:disable-next-line:use-life-cycle-interface
ngAfterViewInit () {

  this.sort.sortChange.subscribe(res => {
    this.paginator.pageIndex = 0;
  });

  merge(
    this.paginator.page,
    this.sort.sortChange
  )
  .pipe(
    tap(() => this.CargarData())
  ).subscribe();

  merge(
   fromEvent(this.FiltroProductos.nativeElement, 'keyup'),
   fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
   fromEvent(this.FiltroMarca.nativeElement, 'keyup'),
   fromEvent(this.FiltroModelo.nativeElement, 'keyup'),
   fromEvent(this.FiltroPMinimo.nativeElement, 'keyup'),
   fromEvent(this.FiltroPMaximo.nativeElement, 'keyup'),
   this.FiltroEstado.selectionChange
  )
  .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.paginator.pageIndex = 0;
       this.CargarData();
     })
    ).subscribe();
 }

 CargarData() {
   this.ListadoProductos.CargarProductos(this.FiltroTipo.nativeElement.value,
   this.FiltroMarca.nativeElement.value,
   this.FiltroModelo.nativeElement.value,
   this.FiltroProductos.nativeElement.value,
   this.FiltroPMinimo.nativeElement.value,
   this.FiltroPMaximo.nativeElement.value,
   this.paginator.pageIndex + 1,
   this.paginator.pageSize,
   this.sort.active,
   this.sort.direction,
   this.FiltroEstado.value
   );
 }


 /* Agregar productos */
 Agregar() {
   // tslint:disable-next-line:prefer-const
   let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos, {
     width: '800px'
   });

   VentanaProductos.afterClosed().subscribe(res => {
     this.CargarData();
   });
 }

 /* Eliminar productos */
 Eliminar(producto) {
  const VentanaConfirmar = this.DialogoProductos.open(VentanaConfirmarComponent, {
    width: '400px',
    data: {objeto: 'el producto', valor: producto.descripcion}
  });
  VentanaConfirmar.afterClosed().subscribe(res => {
    if (res === true) {
     // tslint:disable-next-line:no-shadowed-variable
      this.Servicio.Eliminar(producto.id).subscribe(res => {
      this.CargarData();
     });
    }
  });
 }

 /* Editar productos */
 Editar(id) {
   this.Servicio.Seleccionar(id).subscribe(res => {
     // tslint:disable-next-line:prefer-const
     let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos, {
       width: '800px',
       data: res
     });
     // tslint:disable-next-line:no-shadowed-variable
     VentanaProductos.afterClosed().subscribe (res => {
       this.CargarData();
     });
   });
 }

 Activar(id){
   this.Servicio.Activar(id).subscribe(res=>{
     this.CargarData();
      this.snackBar.open("Se activó el producto satisfactoriamente", "", {
        duration: 2000,
      });
   })
 }

 CargarImagen(producto){
    let VentanaFileUpload = this.DialogFileUpload.open(ImagenProductoComponent, {
    width: '800px',
    data : producto
  });
 }

}
