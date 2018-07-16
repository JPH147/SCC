import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';




@Component({
  selector: 'app-ventanaseries',
  templateUrl: './ventanaseries.html',
  styleUrls: ['./ventanaseries.css']
})


// tslint:disable-next-line:component-class-suffix
export class ventanaseries  implements OnInit {
  public seriearticulo;
  public series: Array <string>;
  public contador: number;
  public serie: Array<any>;



    constructor() {

    }

    ngOnInit() {
      this.contador = 1;
      this.serie = [
        {numero: this.contador, series: ''}
      ];
    }



  agregar() {
    this.contador++;
    this.seriearticulo.push({numero: this.contador, serie: ''});
  }

  Aceptar() {
    console.log(this.seriearticulo);
  }
}
