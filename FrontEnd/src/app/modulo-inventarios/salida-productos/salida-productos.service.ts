import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URL } from 'src/app/core/servicios/url';
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
  documento:string,
  numero_documento:number,
  ): Observable <any> {

    let params = new HttpParams()
      .set('pralmacen', pralmacen.toString())
      .set('prtipo', prtipo.toString())
      .set('prreferencia', prreferencia.toString())
      .set('prsucursal', pralmacen1.toString())
      .set('prfecha', moment(perfecha).format('YYYY/MM/DD').toString())
      .set('prdocumento', documento)
      .set('prnumerodoc', numero_documento.toString());

      // console.log(params)

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

    // console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    // console.log(params);

    return this.http.post(this.url + 'transacciondetalle/create.php', params, {headers: headers});
  }

  SalidaTransferenciaAlmacenVendedores(
  pralmacen: number,
  salida:number,
  fecha: Date,
  documento:number
  ): Observable <any> {

    let params = new HttpParams()
      .set('pralmacen', pralmacen.toString())
      .set('prtipo', "4")
      .set('prreferencia', "3")
      .set('prsalida',salida.toString())
      .set('prfecha', moment(fecha).format('YYYY/MM/DD').toString())
      .set('prdocumento',documento.toString());

      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'transaccioncabecera/create.php', params, {headers: headers});
  }



}
