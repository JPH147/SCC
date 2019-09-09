import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InstitucionesService {

  public url: string = URL.url;

  constructor(
      private http : HttpClient
  ){}

  ListarInstitucion(
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"institucion/read-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }))
  }

  ListarSede(
    institucion : string,
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstitucion", institucion)
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"sede/read-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }))
  }

  ListarSubsede(
    institucion : string,
    sede : string,
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstitucion", institucion)
      .set("prsede", sede)
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"subsede/read-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }))
  }

}