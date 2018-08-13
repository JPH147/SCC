import { VentanaEmergenteProductos } from '../productos/ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSelect } from '@angular/material';
import {merge, Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ProductoService} from '../productos/productos.service';
import {VentaDataSource} from './ventas-listar.dataservice';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import {VentasServicio} from './ventas-listar.service'

@Component({
  selector: 'app-ventas-listar',
  templateUrl: './ventas-listar.component.html',
  styleUrls: ['./ventas-listar.component.css'],
  providers:[VentasServicio,ProductoService]
})
export class VentasListarComponent implements OnInit {


  ListadoVentas: VentaDataSource;
  Columnas: string[] = ['numero', 'serie', 'cliente', 'tipo_venta', 'monto_total', 'fecha', 'opciones'];
  // tslint:disable-next-line:no-inferrable-types
  public TotalResultados: number = 0;

  @ViewChild('InputCliente') FiltroCliente: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: MatSelect;
  @ViewChild('fechainicio') FechaInicioFiltro: ElementRef;
  @ViewChild('fechafin') FechaFinFiltro: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    //private Servicio: ProductoService,
    public DialogoProductos: MatDialog,
    private Servicio:VentasServicio
  ) {}

  ngOnInit() {
   this.Servicio.Listado("",null,null,null,1,20,"id").subscribe()
   this.ListadoVentas = new VentaDataSource(this.Servicio);
   this.ListadoVentas.CargarProductos("",null,null,null,1,20,"id");
 }

// tslint:disable-next-line:use-life-cycle-interface
ngAfterViewInit () {

//   this.sort.sortChange.subscribe(res => {
//     this.paginator.pageIndex = 0;
//   });

//   merge(
//     this.paginator.page,
//     this.sort.sortChange
//   )
//   .pipe(
//     tap(() => this.CargarData())
//   ).subscribe();

//   merge(
//    fromEvent(this.FiltroProductos.nativeElement, 'keyup'),
//    fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
//    fromEvent(this.FiltroMarca.nativeElement, 'keyup'),
//    fromEvent(this.FiltroModelo.nativeElement, 'keyup')
//   )
//   .pipe(
//      debounceTime(200),
//      distinctUntilChanged(),
//      tap(() => {
//        this.paginator.pageIndex = 0;
//        this.CargarData();
//      })
//     ).subscribe();
 }

 CargarData() {

   console.log("Component",this.FiltroCliente.nativeElement.value,
     this.FiltroTipo.value,
     this.FechaInicioFiltro.nativeElement.value,
     this.FechaFinFiltro.nativeElement.value,
     1,20,"id")

   this.ListadoVentas.CargarProductos(
     this.FiltroCliente.nativeElement.value,
     this.FiltroTipo.value,
     this.FechaInicioFiltro.nativeElement.value,
     this.FechaFinFiltro.nativeElement.value,
     1,20,"id"
   );
 }

 CambioFiltro(){
   this.CargarData()
 }

//  /* Agregar productos */
//  Agregar() {
//    // tslint:disable-next-line:prefer-const
//    let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos, {
//      width: '800px'
//    });

//    VentanaProductos.afterClosed().subscribe(res => {
//      this.CargarData();
//    });
//  }

//  /* Eliminar productos */
//  Eliminar(producto) {
//   const VentanaConfirmar = this.DialogoProductos.open(VentanaConfirmarComponent, {
//     width: '400px',
//     data: {objeto: 'el producto', valor: producto.descripcion}
//   });
//   VentanaConfirmar.afterClosed().subscribe(res => {
//     if (res === true) {
//      // tslint:disable-next-line:no-shadowed-variable
//       this.Servicio.Eliminar(producto.id).subscribe(res => {
//       this.CargarData();
//      });
//     }
//   });
//  }

//  /* Editar productos */
//  Editar(id) {
//    this.Servicio.Seleccionar(id).subscribe(res => {
//      // tslint:disable-next-line:prefer-const
//      let VentanaProductos = this.DialogoProductos.open(VentanaEmergenteProductos, {
//        width: '800px',
//        data: res
//      });
//      // tslint:disable-next-line:no-shadowed-variable
//      VentanaProductos.afterClosed().subscribe (res => {
//        this.CargarData();
//      });
//    });
//  }
}
