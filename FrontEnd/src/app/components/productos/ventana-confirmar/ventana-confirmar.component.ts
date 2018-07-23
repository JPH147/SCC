import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ProductoService} from '../productos.service';

@Component({
  selector: 'app-ventana-confirmar',
  templateUrl: './ventana-confirmar.component.html',
  styleUrls: ['./ventana-confirmar.component.css'],
  providers:[ProductoService]
})
export class VentanaConfirmarComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaConfirmarComponent>,
    public Servicio: ProductoService,
  	) { }

  ngOnInit() { }

  onNoClick(): void {
    this.ventana.close();
  }

  Aceptar(){
  	this.Servicio.Eliminar(this.data.id).subscribe();
  	this.ventana.close()
  }

}
