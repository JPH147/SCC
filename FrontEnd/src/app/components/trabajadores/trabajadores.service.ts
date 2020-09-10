import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';
import * as moment from 'moment';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient
  ) { }

  Listar(
    documento:string,
    nombre:string,
    parametro : number,
    numero_pagina:number,
    total_pagina:number
  ): Observable<any> {

    let params = new HttpParams()
    .set('prdocumento',documento)
    .set('prnombre',nombre)
    .set('prparametro',parametro.toString())
    .set('prpagina',numero_pagina.toString())
    .set('prtotalpagina',total_pagina.toString())

    return this.http.get(this.url + 'trabajador/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }  else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  Crear(
    documento : string,
    nombre : string,
    cargo : string,
    hora_ingreso : Time,
    hora_salida : Time,
  ){
    let params = new HttpParams()
      .set('prdocumento', documento)
      .set('prnombre', nombre)
      .set('prcargo', cargo)
      .set('prhoraingreso', hora_ingreso.toString())
      .set('prhorasalida', hora_salida.toString())

    // console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'trabajador/create.php', params, {headers: headers});
  }

  Eliminar(
    id_trabajador : number,
  ){
    let params = new HttpParams()
      .set('prtrabajador', id_trabajador.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'trabajador/delete.php', params, {headers: headers});
  }

  ListarTareo(
    documento:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    numero_pagina:number,
    total_pagina:number
  ): Observable<any> {

    let params = new HttpParams()
    .set('prdocumento',documento)
    .set('prnombre',nombre.toString())
    .set('prfechainicio',moment(fecha_inicio).format("YYYY-MM-DD"))
    .set('prfechafin',moment(fecha_fin).format("YYYY-MM-DD"))
    .set('prpagina',numero_pagina.toString())
    .set('prtotalpagina',total_pagina.toString())

    return this.http.get(this.url + 'trabajador/read-tareo.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }  else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  CrearTareo(
    id_trabajador : number,
    fecha : Date,
    hora_ingreso : Time,
    ingreso : Time,
    hora_salida : Time,
    salida : Time,
  ){
    let params = new HttpParams()
      .set('prtrabajador', id_trabajador.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prhoraingreso', hora_ingreso.toString())
      .set('pringreso', ingreso.toString())
      .set('prhorasalida', hora_salida.toString())
      .set('prsalida', salida.toString())

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'trabajador/create-tareo.php', params, {headers: headers});
  }

  SeleccionarxDocumento(
    documento:string,
  ): Observable<any> {

    let params = new HttpParams()
    .set('prdocumento',documento)

    return this.http.get(this.url + 'trabajador/readxdocumento.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }  else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

}
