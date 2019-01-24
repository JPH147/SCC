import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {URL} from '../../global/url';

@Injectable({
  providedIn: 'root'
})
export class ReglasEvaluacionService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient,
  ) { }

  ListarReglas():Observable<any>{
    return this.http.get(this.url + 'reglas-evaluacion/read.php')
      .pipe(map(res=>{
        if( res['codigo'] === 0){
          return res['data'].reglas;
        } else {
          console.log('No hay datos que mostrar');
          return res;
        }
      }))
  }

}
