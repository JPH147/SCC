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


AgregarCompraMercaderia(

  id_almacen: number,
  id_tipo: number,
  id_referencia: number,
  id_proveedor: number,
  fecha: Date,
  documento: string
  ): Observable <any> {

      // tslint:disable-next-line:prefer-const
      let F = moment(fecha).format('YYYY/MM/DD').toString();

      const params = '&pralmacen=' + id_almacen + '&prtipo=' + id_tipo + '&prreferencia=' + id_referencia +
       '&prproveedor=' + id_proveedor + '&prfecha=' + F + '&prdocumento=-' ;
       console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }


     AgregarDevolucionCliente(

      id_almacen: number,
      id_tipo: number,
      id_referencia: number,
      id_cliente: number,
      fecha: Date,
      documento: string
      ): Observable <any> {

          // tslint:disable-next-line:prefer-const
      let F = moment(fecha).format('YYYY/MM/DD').toString();
      const params = '&pralmacen=' + id_almacen + '&prtipo=' + id_tipo + '&prreferencia=' + id_referencia +
       '&prcliente=' + id_cliente + '&prfecha=' + F + '&prdocumento=-';
       console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }


     AgregarDevolucionVendedor(

      id_almacen: number,
      id_tipo: number,
      id_referencia: number,
      id_vendedor: number,
      fecha: Date,
      documento: string
      ): Observable <any> {

        let F = moment(fecha).format('YYYY/MM/DD').toString();
      const params = '&pralmacen=' + id_almacen + '&prtipo=' + id_tipo + '&prreferencia=' + id_referencia +
       '&prvendedor=' + id_vendedor + '&prfecha=' + F + '&prdocumento=-';
       console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }


     AgregarTransferenciaSucursal(

      id_almacen: number,
      id_tipo: number,
      id_referencia: number,
      fecha: Date,
      documento: string
      ): Observable <any> {

        let F = moment(fecha).format('YYYY/MM/DD').toString();

      const params = '&pralmacen=' + id_almacen + '&prtipo=' + id_tipo + '&prreferencia=' + id_referencia +
      '&prfecha=' + F + '&prdocumento=-';
       console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     } }
