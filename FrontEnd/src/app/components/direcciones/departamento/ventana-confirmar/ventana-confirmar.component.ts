import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ServiciosDirecciones, Departamento} from '../../../global/direcciones'

@Component({
  selector: 'app-ventana-eliminar-departamento',
  templateUrl: './ventana-confirmar.component.html',
  styleUrls: ['./ventana-confirmar.component.css'],
  providers:[ServiciosDirecciones]
})
export class VentanaEliminarDepartamento implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEliminarDepartamento>,
   public Servicio: ServiciosDirecciones,
  	) { }

  ngOnInit() { }

  onNoClick(): void {
    this.ventana.close();
  }

  Aceptar(){
  	this.Servicio.EliminarDepartamento(this.data.id).subscribe();
  	this.ventana.close()
  }

}
