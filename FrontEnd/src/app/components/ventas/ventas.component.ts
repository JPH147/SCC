import { VentanaEmergenteArchivos } from './ventana-emergente/ventanaemergente';
import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {VentaService} from './ventas.service';
import {VentaDataSource} from './ventas.dataservice';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule, MatIcon, MatDialog } from '@angular/material';

export interface PeriodicElement {
  numero: number;
  month: string;
  price: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {numero: 1, month: 'Agosto', price: '255.00'},
  {numero: 2, month: 'Setiembre', price: '255.00'}
];

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ListadoCronograma: VentaDataSource;
  states: string[] = [
    'Factura', 'Boleta'
  ];
  displayedColumns: string[] = ['numero', 'month', 'price'];
  dataSource = ELEMENT_DATA;
  constructor(
    //private Servicio: VentaService
    public DialogoArchivos: MatDialog
  ) {}
  ngOnInit() {
    //this.ListadoCronograma = new VentaDataSource(this.Servicio);
    //this.ListadoCronograma.GenerarCronograma(new Date('2018-07-19'), 100, 10);
  }
  /* Agregar productos */
 Agregar() {
  // tslint:disable-next-line:prefer-const
  let VentanaAdjuntos = this.DialogoArchivos.open(VentanaEmergenteArchivos, {
    width: '800px'
  });

  /*VentanaAdjuntos.afterClosed().subscribe(res => {
    this.CargarData();
  });*/
}
}
