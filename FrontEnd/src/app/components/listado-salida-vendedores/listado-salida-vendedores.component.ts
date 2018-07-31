import { VentanaEmergenteGastos} from './ventana-emergente/ventanaemergente';
import { VentanaEmergenteDet } from './ventana-emergentedet/ventanaemergentedet';
import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';


export interface PeriodicElement {
  pecosa: string;
  position: number;
  fecha: string;
  destino: string;
  sucursal: string;
  estado: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, pecosa: '00059681', fecha: '08/02/2018', destino: 'Ica', sucursal: 'Lima', estado: 'Pendiente'},
  {position: 2, pecosa: '00059682', fecha: '15/02/2018', destino: 'Chimbote', sucursal: 'Arequipa', estado: 'Pendiente'},
  {position: 3, pecosa: '00059683', fecha: '21/02/2018', destino: 'La Merced', sucursal: 'Cuzco', estado: 'Cerrada'},
  {position: 4, pecosa: '00059684', fecha: '27/02/2018', destino: 'Apurimac', sucursal: 'Piura', estado: 'Pendiente'},
  {position: 5, pecosa: '00059685', fecha: '10/03/2018', destino: 'Abancay', sucursal: 'Trujillo', estado: 'Cerrada'},
  {position: 6, pecosa: '00059686', fecha: '12/03/2018', destino: 'Ayacucho', sucursal: 'Chiclayo', estado: 'Pendiente'},
  {position: 7, pecosa: '00059687', fecha: '20/03/2018', destino: 'Cajamarca', sucursal: 'Puno', estado: 'Pendiente'},
  {position: 8, pecosa: '00059688', fecha: '25/03/2018', destino: 'Huancavelica', sucursal: 'Tumbes', estado: 'Cerrada'},
  {position: 9, pecosa: '00059689', fecha: '02/04/2018', destino: 'Iquitos', sucursal: 'Callao', estado: 'Pendiente'},
  {position: 10, pecosa: '00059690', fecha: '09/04/2018', destino: 'PucallPa', sucursal: 'Tacna', estado: 'Pendiente'},
];

@Component({
  selector: 'app-listado-salida-vendedores',
  templateUrl: './listado-salida-vendedores.component.html',
  styleUrls: ['./listado-salida-vendedores.component.css']
})
export class ListadoSalidaVendedoresComponent implements OnInit {
  displayedColumns: string[] = ['position', 'pecosa', 'sucursal', 'fecha', 'destino', 'estado', 'opciones'];
  dataSource = ELEMENT_DATA;
  Servicio: any;

  constructor(
  public DialogoGasto: MatDialog,
  public Dialogodetalle: MatDialog
  ) { }

  ngOnInit() {
  }


 Cargagasto() {
  // tslint:disable-next-line:prefer-const
  let VentanaGastos = this.DialogoGasto.open(VentanaEmergenteGastos, {
    width: '800px'
  });
  }


  Eliminasalida() {
    const VentanaConfirmar = this.DialogoGasto.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'pecosa', valor: ListadoSalidaVendedoresComponent.pecosa}

    });
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
       // tslint:disable-next-line:no-shadowed-variable
       this.Servicio.Eliminar().subscribe( res => {
       //  this.CargarData();
          this.snackBar.open('Se eliminó salida satisfactoriamente.', '', {
           duration: 2500, verticalPosition: 'bottom'
        });
       });
      }
    });
   }

Detalle() {
  const VentanaDetalle = this.Dialogodetalle.open(VentanaEmergenteDet, {
    width: '1200px'
  });

}


}
