import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class ListadoSalidaVendedoresService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
    pecosa: string,
    sucursal: number,
    fecha_inicio: Date,
    fecha_fin: Date,
    destino: string,
    vendedor:string,
    estado:number,
    pagina: number,
    total_pagina: number,
    orden: string
  ): Observable<any> {

    let Sucursal:string;

    if (sucursal == null) {
      Sucursal=""
    }else{
      Sucursal=sucursal.toString()
    }

    return this.http.get(this.url + 'salidacabecera/read.php', {
        params: new HttpParams()
        .set('prpecosa', pecosa)
        .set('prtipo', Sucursal)
        .set('prfechainicio', fecha_inicio ? moment(fecha_inicio).format("YYYY/MM/DD").toString() : "" )
        .set('prfechafin', fecha_fin ? moment(fecha_fin).format("YYYY/MM/DD").toString() : "" )
        .set('prdestino', destino)
        .set('prvendedor', vendedor)
        .set('prestado', estado.toString())
        .set('prpagina', pagina.toString())
        .set('prtotalpagina', total_pagina.toString())
        .set('orden', orden)
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

  ListarGastos(
    id_cabecera:number,
    pagina: number,
    total_pagina: number
  ): Observable<any>{
    return this.http.get(this.url + 'salidacabecera/read-gastos.php', {
      params: new HttpParams()
      .set('prid', id_cabecera.toString())
      .set('prpagina', pagina.toString())
      .set('prtotalpagina', total_pagina.toString())
  })
    .pipe(map(res => {
      // console.log(res)
      if (res['codigo'] === 0) {
        return res;
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarVendedores(
    id_cabecera:number
  ): Observable<any>{
    return this.http.get(this.url + 'salidacabecera/read-vendedores.php', {
      params: new HttpParams()
      .set('prid', id_cabecera.toString())
  })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  CrearGasto(
    id: number,
    fecha: Date,
    vendedor: number,
    monto:number,
    tipo: number,
    observacion: string
  ): Observable<any> {

    let params = new HttpParams()
   		.set('prid', id.toString())
   		.set('prfecha', moment(fecha).format("YYYY/MM/DD").toString())
   		.set('prvendedor', vendedor.toString())
   		.set('prmonto', monto.toString())
   		.set('prtipo', tipo.toString())
      .set('probservacion', observacion)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-gasto.php', params, {headers: headers});
  }

  EliminarGasto(
    id_detalle: number
  ): Observable<any> {

    let params = new HttpParams()
   		.set('prid', id_detalle.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/delete-gasto.php', params, {headers: headers});
  }

  // Cuando se elimina la salida, se coloca como inactivo las transacciones cabecera referentes
  // para que los producto retornen al almacén
  EliminarSalida(
    id_salida: number
  ){
    let params = new HttpParams()
   		.set('prid', id_salida.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/delete.php', params, {headers: headers});
  }

}