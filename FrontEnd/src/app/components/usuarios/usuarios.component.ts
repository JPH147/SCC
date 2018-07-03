import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuarios: Array<usuario>;

  constructor() { }

  ngOnInit() {
  	this.usuarios=[
  	{nombre:"Jean Pierre Rodriguez Farfan", rol:"Administrador", cargo:"Tercero", ultimo_login:"03/08/2018", email:"jeanpierre.rodriguez@genussolucionesti.com", telefono:"996040111"}
  	]
  }

}

export interface usuario{
	nombre:string;
	rol: string;
	cargo:string;
	ultimo_login:string;
	email:string;
	telefono:string;
}