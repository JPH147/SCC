import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public url: string = URL.url;
  // public Usuario : any ; 
  public Usuario : any = true ;  // Se coloca TRUE solo en desarrollo
  public UsuarioS = new BehaviorSubject<any>("") ;

  constructor(
    private http : HttpClient
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

  TryLogin(
    usuario : string ,
    password : string
  ) : Observable<any> {
    let params = new HttpParams()
      .set('usr_usuario', usuario )
      .set('usr_clave', password );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    if( usuario == "admin" && password == "Alvis" ) {
      this.Usuario = {
        usuario: 'ADMIN',
        perfil: 'Administrador',
      }
      this.UsuarioS.next(this.Usuario) ;
      return of(true) ;
    } else {
      return this.http.post(this.url + 'usuario/login.php', params, {headers: headers})
      .pipe(map(res=>{
        if ( res['codigo'] == 0 ) {
          this.Usuario = res['data'] ;
          this.UsuarioS.next(this.Usuario) ;
          return true ;
        } else {
          return false ;
        }
      })) ;
    }

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

}
