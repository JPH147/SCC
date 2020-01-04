import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';

@Injectable({
  providedIn: 'root'
})
export class ProcesoJudicialVinculadosService {
  
  public url: string = URL.url;

  constructor(
    private http : HttpClient
  ){}

  ListarDistritosJudiciales(
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"procesojudicialvinculados/read-distrito.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearDistritoJudicial(
    distrito_judicial : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", distrito_judicial ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/crear-distrito.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  ActualizarDistritoJudicial(
    id_distrito_judicial : number,
    distrito_judicial : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prdistritojuzgado", id_distrito_judicial.toString() )
      .set("prnombre", distrito_judicial ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/actualizar-distrito.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  EliminarDistritoJudicial(
    id_distrito_judicial : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prid", id_distrito_judicial.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/eliminar-distrito.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }))
  }

  ListarInstanciasJudiciales(
    id_distrito_juzgado : number,
    distrito_juzgado : string,
    instancia_juzgado : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("priddistritojuzgado", id_distrito_juzgado.toString())
      .set("prdistritojuzgado", distrito_juzgado)
      .set("prinstanciajuzgado", instancia_juzgado)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"procesojudicialvinculados/read-instancia.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearInstanciaJudicial(
    id_distrito_juzgado : number,
    instancia_juzgado : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prdistritojuzgado", id_distrito_juzgado.toString() )
      .set("prinstanciajuzgado", instancia_juzgado ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/crear-instancia.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  ActualizarInstanciaJudicial(
    id_instancia_juzgado : number,
    id_distrito_juzgado : number,
    instancia_juzgado : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prid", id_instancia_juzgado.toString() )
      .set("prdistritojuzgado", id_distrito_juzgado.toString() )
      .set("prinstanciajuzgado", instancia_juzgado ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/actualizar-instancia.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  EliminarInstanciaJudicial(
    id_instancia_juzgado : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstanciajuzgado", id_instancia_juzgado.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/eliminar-instancia.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }))
  }

}
