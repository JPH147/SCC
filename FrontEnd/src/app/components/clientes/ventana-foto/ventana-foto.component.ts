import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-foto',
  templateUrl: './ventana-foto.component.html',
  styleUrls: ['./ventana-foto.component.css']
})
export class VentanaFotoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaFotoComponent>,
  ) { }

  ngOnInit() {
    // console.log(this.data)
  }

}
