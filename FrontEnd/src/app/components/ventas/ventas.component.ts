import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';

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
  states: string[] = [
    'Factura', 'Boleta'
  ];
  displayedColumns: string[] = ['numero', 'month', 'price'];
  dataSource = ELEMENT_DATA;
  constructor() {
   }
  ngOnInit() {
  }
}
