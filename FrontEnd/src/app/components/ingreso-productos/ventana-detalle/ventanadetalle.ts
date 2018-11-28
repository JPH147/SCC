import { Component, OnInit, Inject, ViewChildren, QueryList, } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosProductoSerie} from '../../global/productoserie';
import {fromEvent} from 'rxjs';
import {tap, distinctUntilChanged, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-ventanadetalle',
  templateUrl: './ventanadetalle.html',
  styleUrls: ['./ventanadetalle.css'],
  providers: [ServiciosProductoSerie]
})

export class VentanaDetalle  implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaDetalle>,
  ) { }

  ngOnInit() {
    // console.log(this.data)
  }
}