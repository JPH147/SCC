import { Component, OnInit, Inject, ViewChildren, QueryList, } from '@angular/core';

import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ventanafecha',
  templateUrl: './ventanafecha.html',
  styleUrls: ['./ventanafecha.css'],
  providers: []
})

export class VentanaFecha  implements OnInit {

  public fecha:Date=new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaFecha>,
  ) { }

  ngOnInit() {

  }

}