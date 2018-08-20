import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URL } from './../global/url';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SalidaProductosService {
  public url: string = URL.url;

  constructor(private http: HttpClient) { }


SalidaTransferenciaAlmacen(
pralmacenSale: number,
prtipo: number,
prreferencia: number,
pralmacenEntra: number,  // Sucursal
perfecha: Date,


): Observable <any> {

  // const fecha = moment(perfecha).format('YYYY/MM/DD').toString();

  // tslint:disable-next-line:prefer-const
  let params = new HttpParams()
    .set('pralmacen', pralmacenSale.toString())
    .set('prtipo', prtipo.toString())
    .set('prreferencia', prreferencia.toString())
    .set('prsucursal', pralmacenEntra.toString())
    .set('prfecha', moment(perfecha).format('YYYY/MM/DD').toString());

    /* const params = '&pralmacen=' + pralmacen + '&prtipo=' + prtipo + '&prreferencia=' + prreferencia +
    '&prsucursal=' + pralmacen1  + '&prfecha=' + fecha ;
    console.log(params); */

    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
}



}
