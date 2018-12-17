import { Component, OnInit } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
  selector: 'app-evaluacion-cuotas',
  templateUrl: './evaluacion-cuotas.component.html',
  styleUrls: ['./evaluacion-cuotas.component.css']
})
export class EvaluacionCuotasComponent implements OnInit {

  public interes:number;
  public aporte:number;
  public capacidad:number;
  public capital: number;
  public cuotas: number;
  public prestamo: number;
  public fecha_inicio:Date;
  public cronograma:Array<Cronograma>=[];

  constructor() { }

  ngOnInit() {
    this.cuotas=12;
    this.interes=0.15;
    this.aporte=20;
    this.capacidad=528;
    this.fecha_inicio=new Date();
    // this.CalcularPrimerPago()
  }

  CalcularPrimerPago(){
    let fecha:Date;
    for(let i=1; i==12;i++){
      fecha=new Date(this.fecha_inicio.valueOf() + 1000*60*60*24*30*i);
      this.cronograma.push({
        numero:i,
        monto:this.capacidad-this.aporte,
        aporte:this.aporte,
        fecha:fecha,
        total:this.capacidad
      })
    }
    this.CalcularPrimerosTotales()
  }

  CalcularPrimerosTotales(){
    this.prestamo=0;
    this.cronograma.forEach((item)=>{
      this.prestamo+=item.monto;
    })
    this.capital=this.prestamo/(this.cuotas*this.interes)
  }

}

export class EvaluacionCoutasDataSource {

  public Cuotas= new BehaviorSubject<any>([]);

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.Cuotas.asObservable();
  }
  
  disconnect() {
    this.Cuotas.complete();
  }
  
}

export interface Cronograma{
  numero:number,
  monto:number,
  aporte:number,
  fecha: Date,
  total:number
}