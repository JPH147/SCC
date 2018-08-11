import { VentanaEmergenteProductos } from './ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {merge, Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ProductoService} from './productos.service';
import {ProductoDataSource} from './productos.dataservice';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';


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
  public TotalResultados: number = 0;

  @ViewChild('InputProducto') FiltroProductos: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: ElementRef;
  @ViewChild('InputMarca') FiltroMarca: ElementRef;
  @ViewChild('InputModelo') FiltroModelo: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private Servicio: ProductoService,
    public DialogoProductos: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoProductos = new ProductoDataSource(this.Servicio);
   // tslint:disable-next-line:quotemark
   this.ListadoProductos.CargarProductos('', '', '', '', 1, 10, "descripcion", "asc");
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
   fromEvent(this.FiltroModelo.nativeElement, 'keyup')
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
   this.paginator.pageIndex + 1,
   this.paginator.pageSize,
   this.sort.active,
   this.sort.direction
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
}
