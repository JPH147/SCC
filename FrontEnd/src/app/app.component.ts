import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public estado: boolean;
  public usuarios;

  constructor() { }

  ngOnInit() {
  	this.usuarios={nombre:"Jean Pierre Rodriguez Farfan",rol:"Administrador", cargo:"Tercero", ultimo_login:"03/08/2018", email:"jeanpierre.rodriguez@genussolucionesti.com", telefono:"996040111"}
  }

}