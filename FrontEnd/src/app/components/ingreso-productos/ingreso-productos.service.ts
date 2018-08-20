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

    pralmacen: number,
      prtipo: number,
      pr_referencia: number,
      prproveedor: number,
      prfecha: Date,
      prdocumento: string

  ): Observable <any> {

      // tslint:disable-next-line:prefer-const
      let params = new HttpParams()
      .set('pralmacen', pralmacen.toString())
      .set('prtipo', prtipo.toString())
      .set('prreferencia', pr_referencia.toString())
      .set('prproveedor', prproveedor.toString())
      .set('prfecha', moment (prfecha).format('YYYY/MM/DD').toString())
      .set('prdocumento', prdocumento.toString());

      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }

     AgregarDevolucionCliente(

      pralmacen: number,
      prtipo: number,
      pr_referencia: number,
      prcliente: number,
      prfecha: Date,
      prdocumento: string
      ): Observable <any> {

        // tslint:disable-next-line:prefer-const
        let params = new HttpParams()
          .set('pralmacen', pralmacen.toString())
          .set('prtipo', prtipo.toString())
          .set('prreferencia', pr_referencia.toString())
          .set('prcliente', prcliente.toString())
          .set('prfecha', moment (prfecha).format('YYYY/MM/DD').toString())
          .set('prdocumento', prdocumento.toString());

      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }


     AgregarDevolucionVendedor(

      pralmacen: number,
      prtipo: number,
      pr_referencia: number,
      prprvendedor: number,
      prfecha: Date,
      prdocumento: string

      ): Observable <any> {

        // tslint:disable-next-line:prefer-const
        let params = new HttpParams()
        .set('pralmacen', pralmacen.toString())
        .set('prtipo', prtipo.toString())
        .set('prreferencia', pr_referencia.toString())
        .set('prcliente', prprvendedor.toString())
        .set('prfecha', moment (prfecha).format('YYYY/MM/DD').toString())
        .set('prdocumento', prdocumento.toString());

      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     }


     AgregarTransferenciaSucursal(
      pralmacenSale: number,
      prtipo: number,
      prreferencia: number,
      pralmacenEntra: number,  // Sucursal
      perfecha: Date,
      prdocumento: string,

      ): Observable <any> {

        // tslint:disable-next-line:prefer-const
        let params = new HttpParams()
        .set('pralmacen', pralmacenSale.toString())
        .set('prtipo', prtipo.toString())
        .set('prreferencia', prreferencia.toString())
        .set('prsucursal', pralmacenEntra.toString())
        .set('prfecha', moment(perfecha).format('YYYY/MM/DD').toString())
        .set('prdocumento', prdocumento.toString());

      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     } }
