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
    ruc: string,
    nombre: string

  ): Observable<any> {
    return this.http.get(this.url + 'proveedor/read.php', {
      params: new HttpParams ()
      .set('prdocumento',ruc.toString())
      .set('prnombre', nombre.toString())
    })
    .pipe(map(res => {
      if( res['codigo'] === 0){
        return res['data'].proveedor;
      } else {
        console.log('Error al importar los datos, revisar servicio');
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
        console.log('Error al importar los datos, revisar servicio');
        return res;
      }
    }))

  }

}

export interface Proveedor {
  id: number;
  numero: number;
  ruc: string;
  nombre: string;
}