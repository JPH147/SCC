import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SeguimientosService {

  public url : string = URL.url;

  constructor(
    private http : HttpClient
  ) { }

  Listar(
    cliente : string ,
    numero_seguimiento : string ,
    courier : string ,
    estado : number ,
    fecha_inicio : Date ,
    fecha_fin : Date ,
    pagina_inicio : number ,
    pagina_final : number ,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',cliente)
      .set('prnumeroseguimiento',numero_seguimiento)
      .set('prcourier',courier)
      .set('prestado',estado.toString())
      .set('prfechainicio', fecha_inicio ? moment(fecha_inicio).format('YYYY-MM-DD') : "" )
      .set('prfechafin', fecha_fin ? moment(fecha_fin).format('YYYY-MM-DD') : "" )
      .set('prnumeropagina',pagina_inicio.toString())
      .set('prtotalpagina',pagina_final.toString())

    return this.http.get(this.url + 'seguimiento/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  Seleccionar(
    id: number ,
  ){
    let params = new HttpParams()
      .set("prid", id.toString())

    return this.http.get(this.url + 'seguimiento/readxId.php', { params })
    .pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  SeleccionarxDocumento(
    id_tipo : number ,
    id_transaccion : number ,
  ){
    let params = new HttpParams()
      .set("prtipo", id_tipo.toString())
      .set("prid", id_transaccion.toString())

    return this.http.get(this.url + 'seguimiento/readxdocumento.php', { params })
    .pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  Actualizar(
    id_seguimiento : number ,
    id_courier : number ,
    fecha : Date ,
    numero_seguimiento : string ,
    pdf_foto : string ,
    observacion : string ,
  ){
    let params = new HttpParams()
      .set("prid" , id_seguimiento.toString() )
      .set("prcourier" , id_courier.toString() )
      .set("prfecha" , moment(fecha).format("YYYY/MM/DD") )
      .set("prseguimiento" , numero_seguimiento )
      .set("prpdffoto" , pdf_foto )
      .set("probservacion" , observacion )

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'seguimiento/actualizar.php' , params, { headers : headers } );
  }

  RegistrarEntrega(
    id_seguimiento : number ,
    fecha : Date ,
    usuario : string ,
  ){
    let params = new HttpParams()
      .set("prid" , id_seguimiento.toString() )
      .set("prfecha" , moment(fecha).format("YYYY-MM-DD") )
      .set("prusuario" , usuario )

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'seguimiento/actualizar-entrega.php' , params, { headers : headers } );
  }

  Eliminar(
    id_seguimiento : number
  ){
    let params = new HttpParams()
      .set("prid" , id_seguimiento.toString() )

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'seguimiento/eliminar.php' , params, { headers : headers } );
  }

}
