import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CobranzasService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient
  ) { }

  Listar(
    cliente : string,
    sede : string,
    subsede : string,
    institucion : string,
    tipo : number, // 1. Afiliación, 2. Préstamo, 3. Venta
    fecha_inicio : Date,
    fecha_fin : Date,
    estado : number, // 1. Pendiente, 2. Pagado
    numero_pagina : number,
    total_pagina : number,
  ){
    let params = new HttpParams()
      .set('prcliente', cliente)
      .set('prsede', sede)
      .set('prsubsede', subsede)
      .set('prinstitucion', institucion)
      .set('prtipo', tipo.toString())
      .set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD"))
      .set('prestado', estado.toString())
      .set('prpagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())

    return this.http.get(this.url + 'cobranza/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }


  // Prueba de enviar array a PHP
  // Generar_PNP(){

  //   let Ctx : Array <string> = ["JEAN PIERRE", "RODRIGUEZ", "FARFAN"]

  //   let params = new HttpParams()
  //   .set('contenido', Ctx.toString())

  //   let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  //   return this.http.post(this.url + 'cobranza/generar-pnp.php', params, {headers: headers});
  // }

}
