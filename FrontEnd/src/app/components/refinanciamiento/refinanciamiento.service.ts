import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RefinanciamientoService {

  public url: string = URL.url;

  constructor(
    private http : HttpClient
  ) { }

  // Este se utiliza para los refinanciamientos
  ListarTransacciones(
    id_cliente:number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',id_cliente.toString());

    // console.log(params);

    return this.http.get(this.url + 'credito/read-transacciones.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  // Este se utiliza para los procesos judiciales
  ListarTransaccionesConInteres(
    id_cliente:number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',id_cliente.toString());

    // console.log(params);

    return this.http.get(this.url + 'credito/read-transaccionesconinteres.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ActualizarTransacciones(
    id_nuevo_credito : number,
    tipo : number,
    id_transaccion : number
  ){
    let params = new HttpParams()
      .set('prnuevocredito',id_nuevo_credito.toString())
      .set('ptipo',tipo.toString())
      .set('prtransaccion',id_transaccion.toString());

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/update-refinanciamiento.php', params, {headers: headers});
  }

}
