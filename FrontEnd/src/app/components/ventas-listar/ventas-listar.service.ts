import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';
 
@Injectable()

export class VentasServicio {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
    cliente:string,
    dni:string,
    tipo_venta:number,
    estado_pagos:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
    orden:string
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',cliente)
      .set('prdni',dni)
      .set('prtipo_venta',tipo_venta.toString())
      .set('prestadopagos',estado_pagos.toString())
      .set('prfecha_inicio', fecha_inicio ? moment(fecha_inicio).format('YYYY-MM-DD') : "" )
      .set('prfecha_fin', fecha_fin ? moment(fecha_fin).format('YYYY-MM-DD') : "" )
      .set('prestado',estado.toString())
      .set('prpagina',pagina_inicio.toString())
      .set('prtotalpagina',pagina_final.toString())
      .set('prorden',orden)

    return this.http.get(this.url + 'venta/read.php', { params })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }
}