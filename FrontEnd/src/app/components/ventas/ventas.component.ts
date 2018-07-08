import { Component, OnInit } from '@angular/core';
import { MatCard, MatInputModule, MatButton } from '@angular/material';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  states: string[] = [
    'Factura', 'Boleta'
  ];
  constructor() {
   }
  ngOnInit() {
  }
}
