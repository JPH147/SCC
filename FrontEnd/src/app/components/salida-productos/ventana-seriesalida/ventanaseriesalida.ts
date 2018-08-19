import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';


@Component({
  selector: 'app-ventanaseriesalida',
  templateUrl: './ventanaseriesalida.html',
  styleUrls: ['./ventanaseriesalida.css']
})

// tslint:disable-next-line:class-name
export class ventanaseriesalida  implements OnInit {
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



  AgregarSerieVSalida() {
    this.contador++;
    this.seriearticulo.push({numero: this.contador, series: ''});
  }

  Aceptar() {
    console.log(this.seriearticulo);
  }
}
