import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {URL,URLIMAGENES} from '../global/url';


@Injectable()

export class ProveedorService {

  public url: string = URL.url;

  constructor(private http: HttpClient) { }

  Listado(
    ruc: string,
    nombre: string

  ): Observable<any> {
    return this.http.get(this.url + 'proveedor/read.php', {
      params: new HttpParams ()
      .set('prdocumento',ruc.toString())
      .set('prnombre', nombre.toString())
    })
    .pipe(map(res => {
      if( res['codigo'] === 0){
        console.log(res);
        return res['data'].proveedor;
      } else {
        console.log('Error al importar los datos, revisar servicio');
          return res;
      }
    }))
  
  }

}

export interface Proveedor {
  id: number;
  numero: number;
  ruc: string;
  nombre: string;
}