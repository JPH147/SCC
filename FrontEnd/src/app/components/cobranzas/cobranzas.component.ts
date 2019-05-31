import { Component, OnInit } from '@angular/core';
import { CobranzasService } from './cobranzas.service';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css']
})
export class CobranzasComponent implements OnInit {

  constructor(
    private Servicio: CobranzasService
  ) { }

  ngOnInit() {
    // this.Servicio.Generar_PNP().subscribe(res=>{
    //   console.log(res)
    // })
  }

}
