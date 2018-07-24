import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-ventana-confirmar',
  templateUrl: './ventana-confirmar.component.html',
  styleUrls: ['./ventana-confirmar.component.css'],
})
export class VentanaConfirmarComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaConfirmarComponent>,
  	) { }

  ngOnInit() { }

  onNoClick(): void {
    this.ventana.close();
  }

  Aceptar(){
  	this.ventana.close()
  }

}
