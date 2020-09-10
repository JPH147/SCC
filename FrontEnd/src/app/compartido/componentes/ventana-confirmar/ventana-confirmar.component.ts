import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ventana-confirmar',
  templateUrl: './ventana-confirmar.component.html',
  styleUrls: ['./ventana-confirmar.component.css'],
})
export class VentanaConfirmarComponent implements OnInit {

  public monto:number;
  public mensaje:string;
  public comentarios:string="";
  public titulo : string ;
  public accion : string ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaConfirmarComponent>,
    public snackBar: MatSnackBar
  	) { }

  ngOnInit() {
    this.monto=50;
    
    if(this.data.accion){
      this.titulo=this.data.titulo;
      this.accion=this.data.accion;
      this.mensaje = this.data.objeto + " " + this.data.mensaje;
      this.comentarios="JP";
    } else {
      this.titulo="Eliminar";
      this.accion="eliminar";
      this.mensaje = this.data.objeto + ' ' + 'se eliminó satisfactoriamente';
    }
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
