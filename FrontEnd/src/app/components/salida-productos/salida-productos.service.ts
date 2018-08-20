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
  pralmacen: number,
  prtipo: number,
  prreferencia: number,
  pralmacen1: number,  // Sucursal
  perfecha: Date,


  ): Observable <any> {

    let params = new HttpParams()
      .set('pralmacen', pralmacen.toString())
      .set('prtipo', prtipo.toString())
      .set('prreferencia', prreferencia.toString())
      .set('prsucursal', pralmacen1.toString())
      .set('prfecha', moment(perfecha).format('YYYY/MM/DD').toString());

      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
  }


  AgregarProducto(
    cabecera: number,
    serie: number,
    precio: number,
    cantidad:number
    ): Observable<any> {
    
    let params = new HttpParams()
           .set('prcabecera', cabecera.toString())
           .set('prproductoserie', serie.toString())
           .set('prprecio', precio.toString())
           .set('prcantidad', cantidad.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'transacciondetalle/create.php', params, {headers: headers});
  }
}
