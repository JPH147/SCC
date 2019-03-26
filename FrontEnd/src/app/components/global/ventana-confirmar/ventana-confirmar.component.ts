import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-ventana-confirmar',
  templateUrl: './ventana-confirmar.component.html',
  styleUrls: ['./ventana-confirmar.component.css'],
})
export class VentanaConfirmarComponent implements OnInit {

  public monto:number;
  public mensaje:string;
  public comentarios:string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaConfirmarComponent>,
    public snackBar: MatSnackBar
  	) { }

  ngOnInit() {
    this.monto=50;
    this.mensaje = this.data.objeto + ' ' + 'se eliminó satisfactoriamente';
  }

  onNoClick(): void {
    this.ventana.close();
  }

  Aceptar(){
    if (this.data.venta) {
      this.ventana.close({monto: this.monto, comentarios: this.comentarios, respuesta: true})
    }else{
      this.ventana.close(true)
    }
  }



  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
