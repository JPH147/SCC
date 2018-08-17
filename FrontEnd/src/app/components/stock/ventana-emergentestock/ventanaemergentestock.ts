import { Component, Inject, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {StockDataSource} from '../stock.dataservice';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosProductoSerie, ProductoSerie} from '../../global/productoserie';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'app-ventanaemergentestock',
  templateUrl: './ventanaemergentestock.html',
  styleUrls: ['./ventanaemergentestock.css'],
  providers: [ServiciosProductoSerie]
})


// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteStock  implements OnInit {
  public seriearticulo: Array<any> ;
  public numero: number;
  public series: Array <string>;
  public contador: number;
  public serie: Array<any>;
  public LstSerie: ProductoSerie[] = [];

  Columnas: string[] = ['numero', 'producto', 'serie' ];

  constructor(@Inject(MAT_DIALOG_DATA) public data,public Servicios: ServiciosProductoSerie) {

    }

    ngOnInit() {
      this.contador = 1;
      this.seriearticulo = [{numero: this.contador, series: ''} ];
      this.ListarProductoSerie();
    }

    ListarProductoSerie() {
      this.Servicios.Listado(this.data.almacen,this.data.producto).subscribe( res => {
        this.LstSerie = [];
        // tslint:disable-next-line:forin
        for (let i in res) {
          this.LstSerie.push ( res[i] );
        }
     });
    }



  AgregarSerieVS() {
    this.contador++;
    this.seriearticulo.push({numero: this.contador, series: ''});
  }

  Aceptar() {
    console.log(this.seriearticulo);
  }
}
