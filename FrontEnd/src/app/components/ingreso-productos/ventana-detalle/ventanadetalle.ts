import { Component, OnInit, Inject, ViewChildren, QueryList, } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
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