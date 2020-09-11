import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import {ComisionesService} from '../comisiones.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-comisiones-detalle',
  templateUrl: './comisiones-detalle.component.html',
  styleUrls: ['./comisiones-detalle.component.css']
})

export class ComisionesDetalleComponent implements OnInit {

  public ComisionesForm : FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ComisionesDetalleComponent>,
    private Servicio: ComisionesService,
    private Builder : FormBuilder
  ) { }

  ngOnInit() {
    this.CrearFormulario();
  }

  CrearFormulario(){

    this.ComisionesForm = this.Builder.group({
      tipo : [ { value : null , disable : false } , [
        Validators.required
      ]],
      fecha : [ { value : new Date() , disable : false } , [
        Validators.required
      ]],
      documento : [ { value : "" , disable : false } , [
      ]],
      observacion : [ { value : "" , disable : false } , [
      ]],
    })

  }

}