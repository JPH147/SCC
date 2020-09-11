import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';

@Injectable({
  providedIn: 'root'
})

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
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
    }
    }));
  }

  ListadoSerieUnlimited(
    archivo: string,
    serie: string,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prarchivo', archivo)
      .set('prserie', serie) ;

    return this.http.get(this.url + 'serieproducto/read-unlimited.php', { params })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar',res);
        return false;
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
