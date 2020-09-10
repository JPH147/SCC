import { Component, OnInit } from '@angular/core';
import {TipoComponent} from "./tipo/tipo.component";
import {MarcaComponent} from "./marca/marca.component";
import {ModeloComponent} from "./modelo/modelo.component";
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-detalleproductos',
  templateUrl: './detalleproductos.component.html',
  styleUrls: ['./detalleproductos.component.css'],
  providers: [ServiciosGenerales,TipoComponent,MarcaComponent,ModeloComponent]
})
export class DetalleProductosComponent implements OnInit {

  public opcion= new BehaviorSubject<number>(0);

  constructor(
	private Tipo:TipoComponent,
	private Marca:MarcaComponent,
	private Modelo:ModeloComponent
  )
  { }

  ngOnInit() {

  }

  Cambiar(evento){

	
  }

}
