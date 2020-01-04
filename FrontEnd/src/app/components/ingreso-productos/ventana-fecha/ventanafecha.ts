import { Component, OnInit, Inject, ViewChildren, QueryList, } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

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