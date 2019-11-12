import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public estado: boolean; // El estado del menú true=abierto, false=cerrado
  public usuario: any;

  constructor() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {

    // this.estado=false; // Cuando es para móviles
    this.estado=true; // Cuando es para PC
    this.usuario = {
      nombre: 'Jean Pierre Rodriguez Farfan',
      rol: 'Administrador',
      cargo: 'Tercero',
      ultimo_login: '"03/08/2018',
      email: 'jeanpierre.rodriguez@genussolucionesti.com',
      telefono: '996040111',
  };
 }
}
