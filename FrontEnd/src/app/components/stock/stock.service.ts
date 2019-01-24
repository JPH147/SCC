import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';

@Injectable()

export class StockService {
  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  ListarStock(
    almacen: string,
    tipo: string,
    marca: string,
    modelo: string,
    producto: string,
    pagina_inicio: number,
    total_pagina: number,
    orden: string
  ): Observable<any> {
    return this.http.get(this.url + 'stock/read.php', {
      params: new HttpParams()
      .set('pralmacen', almacen)
      .set('prtipo', tipo)
      .set('prmarca', marca)
      .set('prmodelo', modelo)
      .set('prdescripcion', producto)
      .set('prpagina', pagina_inicio.toString())
      .set('prtotalpagina', total_pagina.toString())
      .set('orden', orden)
    }).pipe(map(res => {
      // console.log(almacen,tipo,marca,modelo,producto,pagina_inicio,total_pagina,orden);
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
    }
    }));
  }
}

// tslint:disable-next-line:class-name
export interface stock {
  numero: number;
  almacen: string;
  tipo: string;
  marca: string;
  modelo: string;
  descripcion: string;
  unidad_medida: string;
  cantidad: number;
}
