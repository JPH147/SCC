import { Component, OnInit } from '@angular/core';
import { CobranzasService } from './cobranzas.service';
import { ServiciosGenerales } from '../global/servicios';
import * as moment from 'moment';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css'],
  providers: [ServiciosGenerales]
})
export class CobranzasComponent implements OnInit {

  // public fecha_inicio= new Date(moment().format("YYYY-MM-01"));
  // public fecha_fin= new Date(moment().format("YYYY-MM-") + moment().daysInMonth());

  public fecha_inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  public fecha_fin = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  public institucion: number;
  public Institucion : Array<any>;

  constructor(
    private Servicio: CobranzasService,
    private GServicios: ServiciosGenerales
  ) { }

  ngOnInit() {
    this.GServicios.ListarInstitucion().subscribe(res=>{
      this.Institucion=res;
    })
  }

}
