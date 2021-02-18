import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {URL,URLIMAGENES} from 'src/app/core/servicios/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
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
        res['data'].proveedor = res['data'].proveedor.map(item=>{
                                    item.foto = URLIMAGENES.carpeta + 'proveedor/' + item.foto;
                                    item.documento = item.documento.substring(1,item.documento.length-1);
                                    return item;
                                  })
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
    let params = new HttpParams()
      .set("idproveedor", idproveedor.toString() )

      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'proveedor/delete.php', params, {headers: headers});
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
      let params = new HttpParams()
        .set("prv_idtipodocumento", pprv_idtipodocumento.toString() )
        .set("prv_documento", pprv_documento)
        .set("prv_nombre", pprv_nombre)
        .set("prv_representante_legal", pprv_representante_legal)
        .set("prv_observacion", pprv_observacion) ;

      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'proveedor/create.php', params, {headers: headers});
  }

  Actualizar(
    idproveedor: number,
    pprv_idtipodocumento: number,
    pprv_documento: string,
    pprv_nombre: string,
    pprv_representante_legal: string,
    pprv_observacion: string,
  ): Observable<any> {
      let params = new HttpParams()
        .set("idproveedor", idproveedor.toString() )
        .set("prv_tipo_documento", pprv_idtipodocumento.toString() )
        .set("prv_documento", pprv_documento)
        .set("prv_nombre", pprv_nombre)
        .set("prv_representante_legal", pprv_representante_legal)
        .set("prv_observacion", pprv_observacion) ;

      // console.log(params);
      // tslint:disable-next-line:prefer-const
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'proveedor/update.php', params, {headers: headers});
  }

  ActualizarFoto(
    id_proveedor : number,
    clt_foto : string
  ): Observable<any> {
    let params = new HttpParams()
    .set('prproveedor', id_proveedor.toString())
    .set('prfoto', clt_foto);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'proveedor/updateimage.php', params, {headers: headers}).pipe(map(res => {
      return res;
    }));
  }
}

export interface Proveedor {
  id: number;
  numero: number;
  ruc: string;
  nombre: string;
}