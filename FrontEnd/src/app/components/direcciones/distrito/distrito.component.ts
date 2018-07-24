import { Component, OnInit } from '@angular/core';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
@Component({
  selector: 'app-distrito',
  templateUrl: './distrito.component.html',
  styleUrls: ['./distrito.component.css']
})
export class DistritoComponent implements OnInit {

  constructor(
  	private Servicios: ServiciosDirecciones
  ) { }

  ngOnInit() {

  }

}
