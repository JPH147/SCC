import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes.service';
import { BehaviorSubject } from 'rxjs';

// Este componente sólo buscar el DNI del cliente
// y retorna el código y el nombre

@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css'],
  providers : [ ClienteService ]
})

export class ConsultarClienteComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public hay_cliente : number;
  public dni : string;
  public codigo : string;
  public nombre : string;

  constructor(
    private Servicio : ClienteService
  ) { }

  ngOnInit() {
  }

  Buscar(){

    this.hay_cliente=3;
    this.Cargando.next(true);

    this.Servicio.BuscarClienteDNI(this.dni).subscribe(res=>{
      this.Cargando.next(false);
      if(res['codigo']==0){
        this.hay_cliente=1;
        this.codigo = res['data'].codigo;
        this.nombre = res['data'].nombre;
      }
      else{
        this.hay_cliente=2
      }
    })
  }

}
