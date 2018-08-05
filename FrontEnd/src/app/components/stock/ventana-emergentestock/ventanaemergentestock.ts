import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';


@Component({
  selector: 'app-ventanaemergentestock',
  templateUrl: './ventanaemergentestock.html',
  styleUrls: ['./ventanaemergentestock.css']
})


// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteStock  implements OnInit {
  public seriearticulo: Array<any> ;
  public numero: number;
  public series: Array <string>;
  public contador: number;
  public serie: Array<any>;

    constructor() {

    }

    ngOnInit() {
      this.contador = 1;
      this.seriearticulo = [{numero: this.contador, series: ''} ];
    }



  AgregarSerieVS() {
    this.contador++;
    this.seriearticulo.push({numero: this.contador, series: ''});
  }

  Aceptar() {
    console.log(this.seriearticulo);
  }
}
