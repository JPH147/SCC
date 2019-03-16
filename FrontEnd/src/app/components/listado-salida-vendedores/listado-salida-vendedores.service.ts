import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class ListadoSalidaVendedoresService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
    pecosa: string,
    sucursal: number,
    fecha_inicio: Date,
    fecha_fin: Date,
    destino: string,
    serie:number,
    vendedor:string,
    estado:number,
    pagina: number,
    total_pagina: number,
    orden: string
  ): Observable<any> {

    let Pecosa:string, Sucursal:string, Estado:string, Finicio: string ,Ffin: string,Serie:string="";

    if (pecosa == null) {
      Pecosa=""
    }else{
      Pecosa=pecosa.toString()
    }

    if (sucursal == null) {
      Sucursal=""
    }else{
      Sucursal=sucursal.toString()
    }

    if(serie!=null){
      Serie=serie.toString()
    }

    if (estado == null) {
      Estado=""
    }else{
      Estado=estado.toString()
    }    

  return this.http.get(this.url + 'salidacabecera/read.php', {
      params: new HttpParams()
      .set('prpecosa', Pecosa)
      .set('prtipo', Sucursal)
      .set('prfechainicio', moment(fecha_inicio,"DD/MM/YYYY").format("YYYY/MM/DD").toString())
      .set('prfechafin', moment(fecha_fin,"DD/MM/YYYY").format("YYYY/MM/DD").toString())
      .set('prdestino', destino)
      .set('prserie', Serie)
      .set('prvendedor', vendedor)
      .set('prestado', Estado)
      .set('prpagina', pagina.toString())
      .set('prtotalpagina', total_pagina.toString())
      .set('orden', orden)
  })
    .pipe(map(res => {

      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }
  
}