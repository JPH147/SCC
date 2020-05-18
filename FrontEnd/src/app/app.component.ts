import { Component } from '@angular/core';
import { UsuariosService } from './components/usuarios/usuarios.service';
import { Router } from '@angular/router';

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
    private router : Router 
  ) { }

  ngOnInit() {
    // Estado debe ser TRUE cuando es para PC y FALSE cuando es para móviles
    this.estado=true;
    this.usuario = {
      nombre: '',
      perfil: '',
    };

    // Descomentar para producción
    // if( this._usuario.Usuario ) {
    //   this.router.navigate(['inicio']) ;
    // } else {
    //   this.router.navigate(['login']) ;
    //   this.estado = false ;
    // }

    this._usuario.UsuarioS.subscribe(res=>{
      if(res){
        this.usuario = {
          nombre: res.usuario ,
          perfil: res.perfil ,
        }
      }
    })
 }
}
