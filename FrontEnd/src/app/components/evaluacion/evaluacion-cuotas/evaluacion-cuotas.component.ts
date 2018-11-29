import { Component, OnInit } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
  selector: 'app-evaluacion-cuotas',
  templateUrl: './evaluacion-cuotas.component.html',
  styleUrls: ['./evaluacion-cuotas.component.css']
})
export class EvaluacionCuotasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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