import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { URL } from './url';
import { usuario } from 'src/app/compartido/modelos/login.modelos';
import { Store } from '@ngrx/store';
import { EstadosGlobales } from 'src/app/compartido/reducers/estados';
import { IniciarSesion, CerrarSesion } from 'src/app/compartido/reducers/usuarios.reducer';
import { CookieService } from 'ngx-cookie-service';
import { AsignarPermisos } from 'src/app/compartido/reducers/permisos.reducer';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public url: string = URL.url;

  constructor(
    private _http : HttpClient ,
    private _store : Store<EstadosGlobales> ,
    private _cookie : CookieService
  ) { }

  TryLogin(
    usuario : string ,
    password : string
  ) : Observable<any> {
    let params = new HttpParams()
      .set('usr_usuario', usuario )
      .set('usr_clave', password );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'usuario/login.php', params, {headers: headers})
    .pipe(map(usuario=>{
      if ( usuario['codigo'] == 0 ) {
        return usuario['data'] ;
      } else {
        return false ;
      }
    })) ;
  }

  LogOut() {
    let removerUsuario = new CerrarSesion( ) ;
    this._store.dispatch(removerUsuario) ;
    this._cookie.delete('usuario') ;
  }

  AsignarUsuario(
    usuario : usuario
  ){
    let asignarUsuario = new IniciarSesion( usuario ) ;
    this._store.dispatch(asignarUsuario) ;
    this._cookie.set('usuario', JSON.stringify(usuario)) ;

    this.SeleccionarPerfil(usuario.id_perfil).subscribe(perfil=>{
      let asignarPermisos = new AsignarPermisos( perfil['permisos'] ) ;
      this._store.dispatch(asignarPermisos) ;
    }) ;
  }
  
  SeleccionarPerfil(
    id_perfil : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_perfil.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'perfil/readxId.php', { params : params, headers : headers })
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
