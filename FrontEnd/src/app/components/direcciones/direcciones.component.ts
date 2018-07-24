import { Component, OnInit } from '@angular/core';
import {ServiciosDirecciones} from '../global/direcciones'

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css'],
  providers:[ServiciosDirecciones]
})
export class DireccionesComponent implements OnInit {

  constructor(
  	public Direcciones: ServiciosDirecciones,
  ) { }

  ngOnInit() {

  }

}
