import { Component, OnInit } from '@angular/core';
import {ServiciosDirecciones} from 'src/app/core/servicios/direcciones'

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
