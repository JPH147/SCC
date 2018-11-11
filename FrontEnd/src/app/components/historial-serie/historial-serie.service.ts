import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';

@Injectable()

export class  HistorialSerieService {
  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  ListadoSerie(
    serie: string,
    pagina_inicio: number,
    total_pagina: number,
    
  ): Observable<any> {
    return this.http.get(this.url + 'serieproducto/read.php', {
      params: new HttpParams()
      .set('prserie', serie)
      .set('prpagina', pagina_inicio.toString())
      .set('prtotalpagina', total_pagina.toString())
       }).pipe(map(res => {
      if (res['codigo'] === 0) {
        // console.log(res);
        return res;
      } else {
        console.log('Error al importar los datos, revisar servicio');
        return res;
    }
    }));
  }
}

export interface ProductoSerie {
  fecha: string;
  serie: string;
  producto: string;
  documeto: string;
  transaccion: string;
  tenedor:string;
}
