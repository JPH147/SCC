import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ServiciosProductoSerie} from 'src/app/core/servicios/productoserie';

@Component({
  selector: 'app-ventanadetalle',
  templateUrl: './ventanadetalle.html',
  styleUrls: ['./ventanadetalle.css'],
  providers: [ServiciosProductoSerie]
})

export class VentanaDetalle  implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaDetalle>,
  ) { }

  ngOnInit() {
    // console.log(this.data)
  }
}