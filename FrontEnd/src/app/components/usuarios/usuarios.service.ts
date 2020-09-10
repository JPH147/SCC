import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';
import { LoginService } from 'src/app/core/servicios/login.service';
import { Rol } from 'src/app/compartido/modelos/login.modelos';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public url: string = URL.url;
  public Usuario : any ; 
  // public Usuario : any = true ;  // Se coloca TRUE solo en desarrollo
  public UsuarioS = new BehaviorSubject<any>("") ;

  constructor(
    private http : HttpClient ,
    private _login : LoginService
  ) { }

  ListarUsuarios(
    nombre : string ,
    nick : string ,
    rol : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prusuario", nick)
      .set("prperfil", rol)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"usuario/read.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearUsuario(
    nombre : string ,
    usuario : string ,
    pss : string ,
    perfil : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('usr_nombre', nombre )
      .set('usr_usuario', usuario )
      .set('usr_clave', pss )
      .set('idperfil', perfil.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/create.php', params, {headers: headers});    
  }

  ActualizarUsuario(
    id_usuario : number ,
    nombre : string ,
    usuario : string ,
    perfil : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('idusuario', id_usuario.toString() )
      .set('usr_nombre', nombre )
      .set('usr_usuario', usuario )
      .set('idperfil', perfil.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/update.php', params, {headers: headers});    
  }

  ActualizarPss(
    id_usuario : number ,
    pss : string ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('idusuario', id_usuario.toString() )
      .set('prpss', pss ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/update-pss.php', params, {headers: headers});    
  }

  EliminarUsuario(
    id_usuario : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('idusuario', id_usuario.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/delete.php', params, {headers: headers})
    .pipe(map(res=>{
      if ( res['codigo'] == 0 ) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  CrearPerfil(
    nombre : string ,
    resumen : string ,
    roles : Rol
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prnombre', nombre )
      .set('prresumen', resumen )
      .set('prpermisos', JSON.stringify(roles) );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'perfil/create.php', params , { headers : headers })
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

  ActualizarPerfil(
    id_perfil : number ,
    nombre : string ,
    resumen : string ,
    roles : Rol
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_perfil.toString() )  
      .set('prnombre', nombre )
      .set('prresumen', resumen )
      .set('prpermisos', JSON.stringify(roles) );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'perfil/update.php', params , { headers : headers })
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

  ListarPerfil(
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prnombre', nombre )
      .set('prpagina', numero_pagina.toString() )
      .set('prtotalpagina', total_pagina.toString() );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(this.url + 'perfil/read.php', { params : params, headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return respuesta ;
        } else {
          return false ;
        }
      })
    )
  }

  SeleccionarPerfil(
    id_perfil : number
  ) :Observable<any> {
    return this._login.SeleccionarPerfil(id_perfil) ;
  }

  EliminarPerfil(
    id_perfl : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_perfl.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'perfil/delete.php', params , { headers : headers })
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

  VerificarUsuario(
    usuario : string ,
    id_evitar : number ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prusuario', usuario )  
      .set('prid', id_evitar.toString() );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/verificar.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return respuesta['data'] ;
        } else {
          return false ;
        }
      })
    )
  }
}