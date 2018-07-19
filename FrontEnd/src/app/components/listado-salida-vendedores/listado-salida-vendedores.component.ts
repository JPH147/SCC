import { Component, OnInit } from '@angular/core';



export interface PeriodicElement {
  pecosa: string;
  position: number;
  fecha: string;
  destino: string;
  sucursal: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, pecosa: '00059681', fecha: '08/02/2018', destino: 'Ica', sucursal: 'Lima'},
  {position: 2, pecosa: '00059682', fecha: '15/02/2018', destino: 'Chimbote', sucursal: 'Arequipa'},
  {position: 3, pecosa: '00059683', fecha: '21/02/2018', destino: 'La Merced', sucursal: 'Cuzco'},
  {position: 4, pecosa: '00059684', fecha: '27/02/2018', destino: 'Apurimac', sucursal: 'Piura'},
  {position: 5, pecosa: '00059685', fecha: '10/03/2018', destino: 'Abancay', sucursal: 'Trujillo'},
  {position: 6, pecosa: '00059686', fecha: '12/03/2018', destino: 'Ayacucho', sucursal: 'Chiclayo'},
  {position: 7, pecosa: '00059687', fecha: '20/03/2018', destino: 'Cajamarca', sucursal: 'Puno'},
  {position: 8, pecosa: '00059688', fecha: '25/03/2018', destino: 'Huancavelica', sucursal: 'Tumbes'},
  {position: 9, pecosa: '00059689', fecha: '02/04/2018', destino: 'Iquitos', sucursal: 'Callao'},
  {position: 10, pecosa: '00059690', fecha: '09/04/2018', destino: 'PucallPa', sucursal: 'Tacna'},
];

@Component({
  selector: 'app-listado-salida-vendedores',
  templateUrl: './listado-salida-vendedores.component.html',
  styleUrls: ['./listado-salida-vendedores.component.css']
})
export class ListadoSalidaVendedoresComponent implements OnInit {
  displayedColumns: string[] = ['position', 'pecosa', 'sucursal', 'fecha', 'destino',  'opciones'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
