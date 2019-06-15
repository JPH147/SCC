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

  ListarCronograma(
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
  ) : Observable <any> {
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

    return this.http.get(this.url + 'cobranza/read-cronograma.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarPNP(
    fecha_inicio : Date,
    fecha_fin : Date
  ){
    let params = new HttpParams()
      .set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD"))

    // console.log(params)

    return this.http.get(this.url + 'cobranza/read-pnp.php', {params})
    .pipe(map(res => {
      // console.log(res)
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  // Prueba de enviar array a PHP
  Generar_PNP(
    nombre_archivo: string,
    informacion : Array<any>
  ) : Observable <any> {

    let params = new HttpParams()
      .set('prarchivo', nombre_archivo)
      .set('contenido', informacion.toString())

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/generar-pnp.php', params, {headers: headers});
  }

  CrearCabecera(
    institucion : number,
    tipo_pago : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    cantidad : number,
    monto : number,
    archivo : string
  ){

    let params = new HttpParams()
      .set('prinstitucion', institucion.toString())
      .set('prtipopago', tipo_pago.toString())
      .set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD"))
      .set('prcantidad', cantidad.toString())
      .set('prmonto', monto.toString())
      .set('prarchivo', archivo)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/create-cabecera.php', params, {headers: headers});

  }

  CrearDetalle(
    id_cobranza : number,
    cliente : number,
    codigo : string,
    monto : number,
  ){
    let params = new HttpParams()
      .set('prcobranza', id_cobranza.toString())
      .set('prcliente', cliente.toString())
      .set('prcodofin', codigo.toString())
      .set('prmonto', monto.toString())

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cobranza/create-detalle.php', params, {headers: headers});
  }

  ListarCobranzas(
    numero_pagina : number,
    total_pagina : number,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prpagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())

    return this.http.get(this.url + 'cobranza/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ObtenerArchivo(
    nombre:string
  ): Observable<Blob>{

    let params = new HttpParams()
    .set('prarchivo', nombre)

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

    return this.http.post(this.url + 'cobranza/enviar-archivo.php', params, {
      responseType: "blob"
    });
  }

}
