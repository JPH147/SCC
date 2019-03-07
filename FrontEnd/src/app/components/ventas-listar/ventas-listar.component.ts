import { VentanaEmergenteProductos } from '../productos/ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSelect } from '@angular/material';
import {merge, Observable, fromEvent} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ProductoService} from '../productos/productos.service';
import {VentaDataSource} from './ventas-listar.dataservice';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import {VentasServicio} from './ventas-listar.service'
import { ClienteService } from '../clientes/clientes.service';
import { VentaService } from '../ventas/ventas.service';


@Component({
  selector: 'app-ventas-listar',
  templateUrl: './ventas-listar.component.html',
  styleUrls: ['./ventas-listar.component.css'],
  providers:[VentasServicio,ProductoService, ClienteService, VentaService]
})
export class VentasListarComponent implements OnInit {
 

  ListadoVentas: VentaDataSource;
  Columnas: string[] = ['numero', 'serie','contrato', 'cliente_nombre', 'tipo_venta', 'monto_total', 'fecha', 'opciones'];

  @ViewChild('InputCliente') FiltroCliente: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: MatSelect;
  @ViewChild('InputEstado') FiltroEstado: MatSelect;
  @ViewChild('fechainicio') FechaInicioFiltro: ElementRef;
  @ViewChild('fechafin') FechaFinFiltro: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    //private Servicio: ProductoService,
    public Dialogo: MatDialog,
    private Servicio:VentasServicio,
    private VServicio: VentaService
  ) {}

  ngOnInit() {
   this.ListadoVentas = new VentaDataSource(this.Servicio);
   this.ListadoVentas.CargarProductos("",null,null,null,1,1,10,"serie asc");
 }

// tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit () {

    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });

    merge(
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    fromEvent(this.FiltroCliente.nativeElement, 'keyup')
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
    this.ListadoVentas.CargarProductos(
      this.FiltroCliente.nativeElement.value,
      this.FiltroTipo.value,
      this.FechaInicioFiltro.nativeElement.value,
      this.FechaFinFiltro.nativeElement.value,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction
    );
  }

  AnularVenta(venta){
    let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
      data: {objeto: "la venta", valor: venta.serie+"-"+venta.contrato, venta:true}
    })

    Dialogo.afterClosed().subscribe(res=>{
      if (res) {
        if (res.respuesta) {
          this.VServicio.EliminarVenta(venta.id).subscribe(respuesta=>{
            if (res.monto>0) {
              this.VServicio.CrearVentaCronograma(venta.id,res.monto,new Date(), 1).subscribe()
            }
          });
        }
      }
    })

  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }
}
