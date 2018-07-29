import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales } from '../../global/servicios';
import { NgControl } from '@angular/forms';


@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales]
})

export class VentanaEmergenteGastos {
  public selectedValue: string;
  public GastosForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteGastos>,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }


  ngOnInit() {

  }






}
