import { Component } from '@angular/core';
import { UsuariosService } from './components/usuarios/usuarios.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service' ;
import { Store } from '@ngrx/store';
import { AsignarPermisos } from './components/usuarios/usuarios.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public estado: boolean; // El estado del menú true=abierto, false=cerrado
  public usuario: any;

  constructor(
    public _usuario : UsuariosService ,
    private _cookie : CookieService ,
    private router : Router ,
    private _store : Store ,
  ) { }

  ngOnInit() {
    // Estado debe ser TRUE cuando es para PC y FALSE cuando es para móviles
    this.estado=true;
    this.usuario = {
      nombre: '',
      perfil: '',
    };

    this.VerificarUsuario() ;

    this._usuario.UsuarioS.subscribe(res=>{
      if(res){
        this.usuario = {
          id : res.id ,
          nombre: res.usuario ,
          id_perfil: res.id_perfil ,
          perfil: res.perfil ,
        }
        this._cookie.set('usuario', JSON.stringify(res ))
      }
    })
  }

  VerificarUsuario(){
    if ( this._cookie.check('usuario') ) {
      let usuario = JSON.parse( this._cookie.get('usuario') ) ;
      // console.log(usuario) ;
      this._usuario.AsignarUsuario( usuario ) ;
      this._usuario.SeleccionarPerfil(usuario.id_perfil).subscribe(perfil=>{
        let asignarPermisos = new AsignarPermisos( perfil['permisos'] ) ;
        this._store.dispatch(asignarPermisos) ;
      })

      // this.router.navigate(['inicio']) ;
    } else {
      this.router.navigate(['login']) ;
      this.estado = false ;
    }
  }

  CerrarSesion(){
    this._usuario.LogOut().subscribe(res=>{
      this.router.navigate(['login']) ;
      this.estado = false ;
      let asignarPermisos = new AsignarPermisos( null ) ;
      this._store.dispatch(asignarPermisos) ;
    })
  }
}
