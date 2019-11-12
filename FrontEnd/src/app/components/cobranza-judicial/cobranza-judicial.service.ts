import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CobranzaJudicialService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient
  ) { }

  Listar(
    expediente:string,
    juzgado:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    numero_pagina:number,
    total_pagina:number,
    orden:string
  ): Observable<any> {
    let params = new HttpParams()
      .set('prexpediente',expediente)
      .set('prjuzgado',juzgado)
      .set('prdni',dni)
      .set('prnombre',nombre)
      .set('prfechainicio',moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString())
      .set('prpagina',numero_pagina.toString())
      .set('prtotalpagina',total_pagina.toString())
      .set('prorden',orden);

    return this.http.get(this.url + 'procesojudicial/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarxId(
    id_proceso : number
  ){
    let params = new HttpParams()
    .set('prid',id_proceso.toString() );

  return this.http.get(this.url + 'procesojudicial/readxId.php', {params})
  .pipe(map(res => {
    if (res['codigo'] === 0) {
      return res['data'];
    } else {
      console.log('No hay datos que mostrar');
      return res;
    }
  }));
  }

  ListarDetallexProceso(
    id_proceso : number
  ){
    let params = new HttpParams()
      .set('prid',id_proceso.toString());

    return this.http.get(this.url + 'procesojudicial/readdetallexproceso.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].procesos;
      } else {
        console.log('No hay datos que mostrar',res);
        return [];
      }
    }));
  }

  CrearProcesoCabecera(
    id_venta:number,
    id_credito:number,
    expediente: string,
    juzgado: string,
    fecha_inicio: Date,
    sumilla: string ,
    numero_cuotas : number ,
    total : number ,
  ){
    let params = new HttpParams()
      .set('prventa', id_venta.toString())
      .set('prcredito', id_credito.toString())
      .set('prexpediente', expediente)
      .set('prjuzgado', juzgado)
      .set('prfecha', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prsumilla', sumilla )
      .set('prnumerocuotas', numero_cuotas.toString() )
      .set('prtotal', total.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-cabecera.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return res['data'];
        } else {
          return false;
        }
      })
    );
  }

  CrearProcesoDetalle(
    id_proceso:number,
    tipo_documento:string,
    fecha:Date,
    numero: number,
    sumilla: string,
    archivo: string,
    comentarios: string
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString())
      .set('prdocumento', tipo_documento)
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prnumero', numero.toString())
      .set('prsumilla', sumilla)
      .set('prarchivo', archivo)
      .set('prcomentarios', comentarios )

    // console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-detalle.php', params, {headers: headers})
    .pipe(
      map(res=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ActualizarProcesoCobranza(
    id_proceso:number,
    fecha: Date,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString() )
      .set('prfecha', moment(fecha).format("YYYY-MM-DD") ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-cobranza.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        console.log(res)
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  CrearProcesoCronograma(
    id_proceso:number,
    monto_cuota:number,
    fecha:Date,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString())
      .set('prcuota', monto_cuota.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"));

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-cronograma.php', params, {headers: headers})
    .pipe(
      map(res=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ActualizarProcesoCabecera(
    id_proceso:number,
    expediente: string,
    juzgado: string,
    fecha_inicio: Date,
    sumilla: string ,
    numero_cuotas : number ,
    total : number ,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString() )
      .set('prexpediente', expediente)
      .set('prjuzgado', juzgado)
      .set('prfecha', moment(fecha_inicio).format("YYYY-MM-DD") )
      .set('prsumilla', sumilla )
      .set('prnumerocuotas', numero_cuotas.toString() )
      .set('prtotal', total.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-cabecera.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ActualizarProcesoDetalle(
    id_proceso_detalle:number,
    tipo_documento:string,
    fecha:Date,
    numero: number,
    sumilla: string,
    archivo: string,
    comentarios: string
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso_detalle.toString())
      .set('prdocumento', tipo_documento)
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prnumero', numero.toString())
      .set('prsumilla', sumilla)
      .set('prarchivo', archivo)
      .set('prcomentarios', comentarios )

    // console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-detalle.php', params, {headers: headers})
    .pipe(
      map(res=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  EliminarProcesoCabecera(
    id_proceso:number,
  ){
    let params = new HttpParams()
      .set('prid', id_proceso.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/eliminar-cabecera.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  EliminarProcesoDetalle(
    id_proceso:number,
  ){
    let params = new HttpParams()
      .set('prid', id_proceso.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/eliminar-detalle.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  

}
