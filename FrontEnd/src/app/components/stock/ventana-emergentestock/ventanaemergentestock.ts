import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {StockSerieDataSource} from '../stock.dataservice';
import { MatPaginator,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosProductoSerie} from '../../global/productoserie';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-ventanaemergentestock',
  templateUrl: './ventanaemergentestock.html',
  styleUrls: ['./ventanaemergentestock.css'],
  providers: [ServiciosProductoSerie]
})


// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteStock  implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public seriearticulo: Array<any> ;
  public numero: number;
  public series: Array <string>;
  public contador: number;
  public serie: Array<any>;
  public LstSerie: Array<any> = [];

  ListadoSeriesData: StockSerieDataSource;
  Columnas: string[] = ['numero','serie','color','almacenamiento','proveedor'];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public Servicios: ServiciosProductoSerie
  ){ }

  ngOnInit() {
    this.ListadoSeriesData = new StockSerieDataSource(this.Servicios);
    this.ListadoSeriesData.CargarStock(this.data.almacen,this.data.producto.id_producto, 1, 5);
  }

  ngAfterViewInit(){
    this.paginator.page
    .pipe(
      tap(() => this.CargarData())
    ).subscribe();
  }

  CargarData(){
   this.ListadoSeriesData.CargarStock(this.data.almacen,this.data.producto.id_producto,this.paginator.pageIndex + 1,this.paginator.pageSize); 
  }

  Aceptar() {
    
  }
}
