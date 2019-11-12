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
      prdocumento: string,
      prnumerodoc: number,
      observaciones: string,
    ): Observable <any> {

      // tslint:disable-next-line:prefer-const
      let params = new HttpParams()
      .set('pralmacen', pralmacen.toString())
      .set('prtipo', prtipo.toString())
      .set('prreferencia', pr_referencia.toString())
      .set('prproveedor', prproveedor.toString())
      .set('prfecha', moment (prfecha).format('YYYY/MM/DD'))
      .set('prdocumento', prdocumento)
      .set('prnumerodoc', prnumerodoc.toString())
      .set('probservaciones', observaciones.toString());

      // console.log(params);

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
      prnumerodoc: number,
      observaciones:string
      ): Observable <any> {

        // tslint:disable-next-line:prefer-const
        let params = new HttpParams()
        .set('pralmacen', pralmacenSale.toString())
        .set('prtipo', prtipo.toString())
        .set('prreferencia', prreferencia.toString())
        .set('prsucursal', pralmacenEntra.toString())
        .set('prfecha', moment(perfecha).format('YYYY/MM/DD').toString())
        .set('prdocumento', prdocumento.toString())
        .set('prnumerodoc', prnumerodoc.toString())
        .set('probservaciones', observaciones);

      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
     } 

  CrearTransaccionDetalle(
    id_cabecera: number,
    id_serie: number,
    cantidad: number,
    precio: number,
    observacion:string
  ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let params = new HttpParams()
    .set('prcabecera', id_cabecera.toString())
    .set('prproductoserie', id_serie.toString())
    .set('prcantidad', cantidad.toString())
    .set('prprecio', precio.toString())
    .set('probservacion', observacion)

    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'transacciondetalle/create.php', params, {headers: headers});
  }


  ObtenerNumeroDocumento(
    almacen:number,
    tipo:number // 1. Ingreso, 2. Salida
  ): Observable<any> {
    let params = new HttpParams()
    
    return this.http.get(this.url+'transaccioncabecera/select.php',{
			params: new HttpParams()
			.set ('id_almacen', almacen.toString())
      .set('tipo_transaccion', tipo.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res
			}else{
				// console.log('No hay datos que mostrar')
			}
		}))
   
  }

  SeleccionarCabecera(
    pralmacen:number,
    prdocumento:string
  ): Observable<any> {
    return this.http.get(this.url + 'transaccioncabecera/readxdocumento.php', {
      params: new HttpParams()
        .set('pralmacen', pralmacen.toString())
        .set('prdocumento', prdocumento)
      }).pipe(map(res => {

      if (res['codigo'] === 0) {
        return res;
      } else {
        // console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ObtenerDetalle(
    cabecera:number
  ):Observable<any>{
    return this.http.get(this.url+'transacciondetalle/readxcabecera.php',{
      params: new HttpParams()
        .set('prcabecera', cabecera.toString())
    }).pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        // console.log('No hay datos que mostrar');
        return res;
      }
    }))
  }



}
