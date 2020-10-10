import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service' ;
import { Store } from '@ngrx/store';
import { LoginService } from './core/servicios/login.service';
import { EstadosGlobales } from './compartido/reducers/estados';
import { usuario } from './compartido/modelos/login.modelos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public usuario: usuario ;

  constructor(
    private _login : LoginService ,
    private _cookie : CookieService ,
    private router : Router ,
    private _store : Store<EstadosGlobales> ,
  ) { }

  ngOnInit() {
    this.usuario = null ;

    this._store.select('usuario').subscribe(usuario => {
      // if( usuario ) {
        this.usuario = usuario ;
      // }
    })

    this.VerificarUsuario() ;
  }

  // Esta función verifica si hay un elemento guardado en el caché
  VerificarUsuario(){
    if ( this._cookie.check('usuario') ) {
      let usuario : usuario = JSON.parse( this._cookie.get('usuario') ) ;
      this._login.AsignarUsuario( usuario ) ;
    } else {
      this.router.navigate(['login']) ;
    }
  }

  CerrarSesion(){
    this._login.LogOut() ;
    this.router.navigate(['login']) ;
  }
}
