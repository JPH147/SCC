import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent implements OnInit {

  public datos_prestamo = new BehaviorSubject<any>({
    interes: 0.15,
    aporte: 20,
    capacidad:500
  })

  public interes:number;
  public aporte:number;

  constructor() { }

  ngOnInit() {
    this.interes=0.15;
    this.aporte=20;
  }

  ngAfterViewInit(){
  }

  DefinirCapacidad(evento){
    this.datos_prestamo.next({
      interes:this.interes,
      aporte:this.aporte,
      capacidad:evento
    });
  }

}
