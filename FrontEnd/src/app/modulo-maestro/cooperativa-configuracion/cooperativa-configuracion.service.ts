import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';

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
    estado : number ,
    numero_pagina : number ,
    total_pagina : number ,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prdepartamento',departamento )
      .set('prprovincia',provincia )
      .set('prdistrito',distrito )
      .set('prdireccion',direccion )
      .set('prestado',estado.toString() )
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
        if ( respuesta['codigo'] == 0 ) {
          return true ;
        } else {
          return false ;
        }
      })
    )
  }

  ActualizarDireccionOrden(
    id_direccion : number ,
    numero_orden_antigua : number ,
    numero_orden_nueva : number ,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prdireccion',id_direccion.toString() )
      .set('prordenactual',numero_orden_antigua.toString() )
      .set('prordennueva',numero_orden_nueva.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/update-direccion-orden.php', params , { headers : headers })
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

  ObtenerUltimoNumero(): Observable<number> {
    return this.http.get(this.url + 'cooperativa-configuracion/read-ultimo-numero.php')
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return respuesta['data'] ;
        } else {
          console.log(respuesta) ;
          return 0 ;
        }
      })
    )
  }

  ListarCuentas(
    banco : number ,
    titular : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prbanco', banco.toString() )
      .set('prtitular', titular )
      .set('prpagina', numero_pagina.toString() )
      .set('prtotalpagina', total_pagina.toString() ) ;

    return this.http.get(this.url + 'cooperativa-configuracion/read-cuenta.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }));
  }

  ListarCuentasUnlimited(
    cooperativa_cuenta : number ,
    nombre_archivo : string ,
  ): Observable<string | false> {

    let params = new HttpParams()
      .set('prcuenta', cooperativa_cuenta.toString() )
      .set('prarchivo', nombre_archivo ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/read-cuenta-unlimited.php',params , {headers: headers})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'] ;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }));
  }

  CrearCuenta(
    banco : number ,
    titular : string ,
    numero : string ,
    cci : string ,
    alias : string ,
  ): Observable<any> {
    let params = new HttpParams()
      .set("prbanco", banco.toString())
      .set("prtitular", titular)
      .set("prnumero", numero)
      .set("prcci", cci)
      .set("pralias", alias) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/create-cuenta.php', params , { headers : headers })
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

  ActualizarCuenta(
    id_cuenta : number ,
    banco : number ,
    titular : string ,
    numero : string ,
    cci : string ,
    alias : string ,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prid',id_cuenta.toString() )
      .set("prbanco", banco.toString())
      .set("prtitular", titular)
      .set("prnumero", numero)
      .set("prcci", cci)
      .set("pralias", alias) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/update-cuenta.php', params , { headers : headers })
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

  EliminarCuenta(
    id_cuenta : number ,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prid',id_cuenta.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cooperativa-configuracion/delete-cuenta.php', params , { headers : headers })
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