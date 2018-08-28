import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL,URLIMAGENES} from '../global/url';

@Injectable()

export class ProductoService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
  tipo: string,
  marca: string,
  modelo: string,
  descripcion: string,
  precio_minimo:number,
  precio_maximo:number,
  pagina: number,
  total_pagina: number,
  columna: string,
  tipo_orden: string,
  estado:number
  ): Observable<any> {

    let orden:string, Pminimo:string='', Pmaximo:string='', Estado:string="";
    
    orden = columna.concat(' ', tipo_orden);

    if (precio_minimo != null) {
      Pminimo=precio_minimo.toString()
    }

    if (precio_maximo != null) {
      Pmaximo=precio_maximo.toString()
    }

    if(estado){
      Estado=estado.toString()
    }


    return this.http.get(this.url + 'producto/read.php', {
      params: new HttpParams()
      .set('prtipo', tipo)
      .set('prmarca', marca)
      .set('prmodelo', modelo)
      .set('prdescripcion', descripcion)
      .set('prpreciominimo',Pminimo)
      .set('prpreciomaximo',Pmaximo)
      .set('prpagina', pagina.toString())
      .set('prtotalpagina', total_pagina.toString())
      .set('orden', orden)
      .set('prestado',Estado)
  })
    .pipe(map(res => {
      if (res['codigo'] === 0) {

        for (let i in res['data'].productos) {
          res['data'].productos[i].foto = URLIMAGENES.urlimages+"producto/"+ res['data'].productos[i].foto;
        }

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

  Activar(
   producto: number
  ): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let params = 'idproducto=' + producto;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/activar.php', params, {headers: headers});
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

  Verificar(
    nombre: string
  ): Observable<any> {

    return this.http.get(this.url + 'producto/readxnombre.php?prnombre=', {
     params: new HttpParams()
    .set('prnombre',nombre.trim())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'];
      }  else {
          console.log('No hay datos para mostrar');
          return []
      }
    }));
  }

  Actualizar(
    id: number,
    modelo: number,
    descripcion: string,
    precio: number
    ): Observable<any> {

    let params = 'id_producto=' + id + '&id_modelo= ' + modelo + '&prd_descripcion = ' + descripcion + '&prd_precio=' + precio;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'producto/update.php', params, {headers: headers});
  }

  ActualizarFoto(
    id: number,
    nombre_foto: string

  ): Observable<any> {
    let params = new HttpParams()
    .set('prid', id.toString())
    .set('prfoto', nombre_foto);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'producto/updateimage.php', params, {headers: headers}).pipe(map(res => {
     console.log(res);
      return res;
    }));
  }

}

export interface Producto {
  numero: number;
  id: number;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  descripcion: string;
  unidad_medida: string;
  precio: number;
}
