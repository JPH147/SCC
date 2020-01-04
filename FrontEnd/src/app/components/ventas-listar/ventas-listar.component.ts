import { VentanaEmergenteProductos } from '../productos/ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSelect } from '@angular/material';
import {merge, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ProductoService} from '../productos/productos.service';
import {VentaDataSource} from './ventas-listar.dataservice';
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

  public fecha_inicio: Date;
  public fecha_fin: Date;

  ListadoVentas: VentaDataSource;
  Columnas: string[] = ['numero', 'fecha', 'contrato', 'cliente_nombre', 'tipo_venta', 'monto_total', 'opciones'];

  @ViewChild('InputCliente') FiltroCliente: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: MatSelect;
  @ViewChild('InputEstado') FiltroEstado: MatSelect;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    //private Servicio: ProductoService,
    public Dialogo: MatDialog,
    private Servicio:VentasServicio,
    private VServicio: VentaService
  ) {}

  ngOnInit() {

    this.fecha_inicio = null ;
    this.fecha_fin = null ;

    this.ListadoVentas = new VentaDataSource(this.Servicio);
    this.ListadoVentas.CargarVentas("",0,this.fecha_inicio,this.fecha_fin,1,1,10,"fecha desc");
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
    this.ListadoVentas.CargarVentas(
      this.FiltroCliente.nativeElement.value,
      this.FiltroTipo.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction
    );
  }

  AnularVenta(venta){
    
    let Transacciones: Array<any>;
    
    // Se listan las transacciones que pertenecen a esa venta
    this.VServicio.ListarVentaTransacciones(venta.id).subscribe(res=>{
      Transacciones=res.transaccion
    });

    let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
      data: {objeto: "la venta", valor: venta.contrato, venta:true}
    })

    Dialogo.afterClosed().subscribe(res=>{
      if (res) {
        if (res.respuesta) {
          this.VServicio.EliminarVenta(venta.id, res.comentarios, res.monto).subscribe(respuesta=>{
            
            console.log(respuesta);
            Transacciones.forEach((item)=>{
              this.VServicio.CrearCanjeTransaccion(item.id,new Date(),"AJUSTE POR ANULACION").subscribe()
            })

            if (res.monto>0) {
              this.VServicio.CrearVentaCronograma(venta.id,2,res.monto,new Date(), 1).subscribe()
            }

            this.CargarData()

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
