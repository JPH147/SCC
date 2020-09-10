import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CooperativaConfiguracionService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient
  ) { }

  ListarDirecciones(
    departamento : string ,
    provincia : string ,
    distrito : string ,
    direccion : string ,
    relevancia : number ,
    principal : number ,
    numero_pagina : number ,
    total_pagina : number ,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prdepartamento',departamento )
      .set('prprovincia',provincia )
      .set('prdistrito',distrito )
      .set('prdireccion',direccion )
      .set('prrelevancia',relevancia.toString() )
      .set('prprincipal',principal.toString() )
      .set('prpagina',numero_pagina.toString() )
      .set('prtotalpagina',total_pagina.toString() ) ;

    return this.http.get(this.url + 'cooperativa-configuracion/read-direccion.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }));
  }

  CrearDireccion(
    distrito : string ,
    direccion : string ,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prdistrito',distrito )
      .set('prdireccion',direccion ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/create-direccion.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return true ;
        } else {
          return false ;
        }
      })
    )
  }

  ActualizarDireccion(
    id_direccion : number ,
    distrito : string ,
    direccion : string ,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prid',id_direccion.toString() )
      .set('prdistrito',distrito )
      .set('prdireccion',direccion ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/update-direccion.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        console.log(respuesta) ;
        if ( respuesta['codigo'] == 0 ) {
          return true ;
        } else {
          return false ;
        }
      })
    )
  }

  EliminarDireccion(
    id_direccion : number ,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prid',id_direccion.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/delete-direccion.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return true ;
        } else {
          return false ;
        }
      })
    )
  }
}