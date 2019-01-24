import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class  DetalleDocumentoAlmacenService {
  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  SeleccionarCabecera(
    id:number
  ): Observable<any> {
    return this.http.get(this.url + 'transaccioncabecera/readxId.php', {
      params: new HttpParams()
        .set('prid', id.toString())
      }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }


}
