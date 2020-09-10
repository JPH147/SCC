import { Component } from '@angular/core';
import { UsuariosService } from './components/usuarios/usuarios.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service' ;
import { Store } from '@ngrx/store';
import { AsignarPermisos, RemoverPermisos } from './compartido/reducers/permisos.reducer';
import { LoginService } from './core/servicios/login.service';
import { EstadosGlobales } from './compartido/reducers/estados';
import { usuario } from './compartido/modelos/login.modelos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public estado: boolean; // El estado del menú true=abierto, false=cerrado
  public usuario: usuario ;

  constructor(
    public _login : LoginService ,
    private _cookie : CookieService ,
    private router : Router ,
    private _store : Store<EstadosGlobales> ,
  ) { }

  ngOnInit() {
    // Estado debe ser TRUE cuando es para PC y FALSE cuando es para móviles
    this.estado=true;
    this.usuario = null ;

    this._store.select('usuario').subscribe(usuario =>{
      if( usuario ) {
        this.usuario = usuario ;
        // this._cookie.set('usuario', JSON.stringify(usuario))
      }
    })

    this.VerificarUsuario() ;
  }

  // Esta función verifica si hay un elemento guardado en el caché
  VerificarUsuario(){
    if ( this._cookie.check('usuario') ) {
      let usuario : usuario = JSON.parse( this._cookie.get('usuario') ) ;
      this._login.AsignarUsuario( usuario ) ;
      // this.router.navigate(['inicio']) ;
    } else {
      this.router.navigate(['login']) ;
      this.estado = false ;
    }
  }

  CerrarSesion(){
    this._login.LogOut() ;
    this.router.navigate(['login']) ;
    this.estado = false ;
  }
}
