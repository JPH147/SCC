import { Component, OnInit } from '@angular/core';
import {ServiciosDirecciones} from '../global/direcciones';
import {TipoComponent} from "./tipo/tipo.component";
import {MarcaComponent} from "./marca/marca.component";
import {ModeloComponent} from "./modelo/modelo.component";
import { ServiciosGenerales } from '../global/servicios';

@Component({
  selector: 'app-detalleproductos',
  templateUrl: './detalleproductos.component.html',
  styleUrls: ['./detalleproductos.component.css'],
  providers: [ServiciosGenerales,TipoComponent,MarcaComponent,ModeloComponent]
})
export class DetalleProductosComponent implements OnInit {

  constructor(
	private Tipo:TipoComponent,
	private Marca:MarcaComponent,
	private Modelo:ModeloComponent
  )
  { }

  ngOnInit() {

  }

  Cambiar(evento){

  	if (evento==0) {
  		this.Tipo.CargarData();
  	}
  	if (evento==1) {
  		this.Marca.CargarData();
  	}
  	if (evento==2) {
  		this.Modelo.CargarData();
  	}
	
  }

}
