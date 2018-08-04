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
<<<<<<< HEAD
  descripcion: string
  ): Observable<Producto[]>
  { return this.http.get(this.url + 'producto/read.php?prtipo='
   + tipo + '&prmarca=' + marca + '&prmodelo=' + modelo + '&prdescripcion='+ descripcion)
=======
  descripcion: string,
  pagina: number,
  total_pagina: number,
  columna: string,
  tipo_orden: string
  ): Observable<any> { let orden;
    orden = columna.concat(' ', tipo_orden);

    return this.http.get(this.url + 'producto/read.php', {
      params: new HttpParams()
      .set('prtipo', tipo)
      .set('prmarca', marca)
      .set('prmodelo', modelo)
      .set('prdescripcion', descripcion)
      .set('prpagina', pagina.toString())
      .set('prtotalpagina', total_pagina.toString())
      .set('orden', orden)
  })
>>>>>>> c9be6c288668a3311e92483fddb43a8fe3aa78b1
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
  ): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let params = 'idproducto=' + producto;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/delete.php', params, {headers: headers});
  }

  Agregar(
    modelo: number,
    descripcion: string,
    precio: number
    ): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let params = 'id_modelo=' + modelo + '&prd_descripcion=' + descripcion + '&prd_precio=' + precio;
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/create.php', params, {headers: headers});
  }


  Seleccionar(
    id: number
  ): Observable<Producto> {
    return this.http.get(this.url + 'producto/readxId.php?id_producto=' + id)
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'];
      }  else {
          console.log('Error al importar los datos, revisar servicio');
      }
    }));
  }

  Actualizar(
    id: number,
    modelo: number,
    descripcion: string,
    precio: number
    ): Observable<any> {
    // tslint:disable-next-line:prefer-const
    // tslint:disable-next-line:whitespace
    // tslint:disable-next-line:prefer-const
    let params = 'id_producto='+ id + '&id_modelo= '+modelo+ '&prd_descripcion = '+descripcion+ '&prd_precio='+precio;
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/update.php', params, {headers: headers});
  }

}

export interface Producto {
<<<<<<< HEAD
  numero: number,
  id: number,
  nombre: string,
  tipo: string,
  marca: string,
  modelo: string,
  descripcion: string,
  unidad_medida: string,
  precio:number
=======
  numero: number;
  id: number;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  descripcion: string;
  unidad_medida: string;
  precio: number;
>>>>>>> c9be6c288668a3311e92483fddb43a8fe3aa78b1
}
