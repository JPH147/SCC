import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {URL,URLIMAGENES} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class ProveedorService {

  public url: string = URL.url;

  constructor(private http: HttpClient) { }

  Listado(
    prtipodocumento: string,
    ruc: string,
    nombre: string,
    prpagina: number,
    prtotalpagina:number

  ): Observable<any> {
    return this.http.get(this.url + 'proveedor/read.php', {
      params: new HttpParams ()
      .set('prtipodocumento',prtipodocumento.toString())
      .set('prdocumento',ruc.toString())
      .set('prnombre', nombre.toString())
      .set('prpagina', prpagina.toString())
      .set('prtotalpagina', prtotalpagina.toString())
    })
    .pipe(map(res => {
      if( res['codigo'] === 0){
        return res;
      } else {
        console.log('No hay datos que mostrar');
          return res;
      }
    }))
  
  }

  ListarMovimientos(
    id_proveedor:number,
    serie:string,
    producto:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    pagina_inicio: number,
    total_pagina: number
  ):Observable<any>{

    return this.http.get(this.url+'transaccioncabecera/readxproveedor.php',{
      params: new HttpParams ()
      .set('pridproveedor',id_proveedor.toString())
      .set('prproducto',serie)
      .set('prserie',producto)
      .set('prfechainicio',moment(fecha_inicio).format("YYYY/MM/DD"))
      .set('prfechafin',moment(fecha_fin).format("YYYY/MM/DD"))
      .set('prpagina',pagina_inicio.toString())
      .set('prtotalpagina',total_pagina.toString())
    })
    .pipe(map(res=>{
      if( res['codigo'] === 0){
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }))

  }

  Eliminar(
    idproveedor: number
  ): Observable<any>  {
    // tslint:disable-next-line:prefer-const
    let params = '&idproveedor=' + idproveedor;
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'proveedor/delete.php', params, {headers: headers});
  // tslint:disable-next-line:indent
  }

  Seleccionar(
    id: number
  // tslint:disable-next-line:whitespace
  ):Observable<Proveedor> {
    return this.http.get(this.url + 'proveedor/readxId.php?id=' + id)
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'];
      }  else {
          console.log('No hay datos que mostrar');
      }
    }));
  }

  Agregar(
    pprv_idtipodocumento: number,
    pprv_documento: string,
    pprv_nombre: string,
    pprv_representante_legal: string,
    pprv_observacion: string
    ): Observable<any> {
      let params =  '&prv_idtipodocumento=' + pprv_idtipodocumento + '&prv_documento=' + pprv_documento
      + '&prv_nombre=' + pprv_nombre + '&prv_representante_legal=' + pprv_representante_legal
      + '&prv_observacion=' + pprv_observacion ; 
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'proveedor/create.php', params, {headers: headers});
  }

  Actualizar(idproveedor: number,
    pprv_idtipodocumento: number,
    pprv_documento: string,
    pprv_nombre: string,
    pprv_representante_legal: string,
    pprv_observacion: string,
    ): Observable<any> {
      let params = 'idproveedor=' + idproveedor + '&prv_tipo_documento=' + pprv_idtipodocumento + '&prv_documento=' + pprv_documento
      + '&prv_nombre=' + pprv_nombre + '&prv_representante_legal=' + pprv_representante_legal
      + '&prv_observacion=' + pprv_observacion; 

      // console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'proveedor/update.php', params, {headers: headers});
  }
}

export interface Proveedor {
  id: number;
  numero: number;
  ruc: string;
  nombre: string;
}