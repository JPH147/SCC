import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class  HistorialMovimientosService {
  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  ListarMovimientos(
    almacen:string,
    tipo:number,
    estado_transaccion:number,
    referente:string,
    fecha_inicio: Date,
    fecha_fin: Date,
    documento:string,
    pagina_inicio: number,
    total_pagina: number,
    orden:string,
  ): Observable<any> {

    let params = new HttpParams()
      .set('pralmacen', almacen)
      .set('prtipo', tipo.toString())
      .set('prparametro',estado_transaccion.toString())
      .set('prreferente', referente)
      .set('prfechainicio', fecha_inicio ? moment(fecha_inicio).format("YYYY/MM/DD") : "")
      .set('prfechafin', fecha_fin ? moment(fecha_fin).format("YYYY/MM/DD") : "")
      .set('prdocumento', documento)
      .set('prpagina', pagina_inicio.toString())
      .set('prtotalpagina', total_pagina.toString())
      .set('orden', orden)

    // console.log(params)

    return this.http.get(this.url + 'transaccioncabecera/read.php', {params}).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos para mostrar');
        return res;
      }
    }));
  }

  EliminarMovimiento(
    id_cabecera : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_cabecera.toString() ) ;

    return this.http.post(this.url + 'transaccioncabecera/delete.php', params ).pipe(map(res => {
      if (res['codigo'] === 0) {
        return true ;
      } else {
        console.log('No hay datos para mostrar', res);
        return false ;
      }
    }));
  }
}
