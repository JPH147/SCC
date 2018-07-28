import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';

@Injectable()

export class ProductoService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
  tipo: string,
  marca: string,
  modelo: string,
  descripcion: string,
  pagina:number,
  total_pagina:number,
  columna:string,
  tipo_orden:string
  ): Observable<any>
  { let orden;
    orden=columna.concat(" ",tipo_orden);

    return this.http.get(this.url + 'producto/read.php',{
      params: new HttpParams()
      .set('prtipo', tipo)
      .set('prmarca', marca)
      .set('prmodelo', modelo)
      .set('prdescripcion', descripcion)
      .set('prpagina',pagina.toString())
      .set('prtotalpagina',total_pagina.toString())
      .set('orden',orden)
  })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('Error al importar los datos, revisar servicio');
          return res;
      }
    }));
  }

  Eliminar(
   producto: number
  ): Observable<any>
  {
    let params = 'idproducto=' + producto;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/delete.php', params, {headers: headers});
	}

  Agregar(
    modelo: number,
    descripcion: string,
    precio:number
    ): Observable<any> {
    let params = 'id_modelo=' + modelo + '&prd_descripcion=' + descripcion+'&prd_precio='+precio;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/create.php', params, {headers: headers});
  }


  Seleccionar(
    id:number
  ):Observable<Producto>{
    return this.http.get(this.url+'producto/readxId.php?id_producto='+id)
    .pipe(map(res=>{
      if (res['codigo'] === 0) {
          return res['data'];
      }  else {
          console.log('Error al importar los datos, revisar servicio');
      }
    }))
  }

  Actualizar(
    id:number,
    modelo:number,
    descripcion:string,
    precio:number
    ): Observable<any>{
    let params = 'id_producto='+id+ '&id_modelo='+modelo+ '&prd_descripcion='+descripcion+ '&prd_precio='+precio;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/update.php', params, {headers: headers});
  }

}

export interface Producto {
  numero: number,
  id: number,
  nombre: string,
  tipo: string,
  marca: string,
  modelo: string,
  descripcion: string,
  unidad_medida: string,
  precio:number
}