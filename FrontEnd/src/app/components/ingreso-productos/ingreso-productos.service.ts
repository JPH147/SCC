import { URL } from './../global/url';
// import { IngresoProductoService } from './ingreso-producto.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import { NgSwitch } from '../../../../node_modules/@angular/common';


@Injectable()

export class IngresoProductoService {
public url: string = URL.url;


constructor(private http: HttpClient) {}


Agregar(

  id_almacen: number,
  id_tipo: number,
  id_referencia: number,
  id_proveedor: number,
  id_cliente: number,
  id_sucursal: number,
  id_vendedor: number,
  fecha: Date,
  documento: string
  ): Observable <any> {

      // tslint:disable-next-line:prefer-const
      let F = moment(fecha).format('YYYY/MM/DD').toString();

     // tslint:disable-next-line:whitespace
      if ( id_tipo = 1) {

      const params = '&pralmacen=' + id_almacen + '&prtipo=' + id_tipo + '&prreferencia=' + id_referencia +
       '&prproveedor=' + id_proveedor + '&prfecha=' + F + '&prdocumento=' + documento;
       console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }
     if ( id_tipo = 2) {

      const params = '&pralmacen=' + id_almacen + '&prtipo=' + id_tipo + '&prreferencia=' + id_referencia +
       '&prcliente=' + id_cliente + '&prfecha=' + F + '&prdocumento=' + documento;
       console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }

     if ( id_tipo = 6) {

      const params = '&pralmacen=' + id_almacen + '&prtipo=' + id_tipo + '&prreferencia=' + id_referencia +
       '&prvendedor=' + id_vendedor + '&prfecha=' + F + '&prdocumento=' + documento;
       console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }
    }






}

