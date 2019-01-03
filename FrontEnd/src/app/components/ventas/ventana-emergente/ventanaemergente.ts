import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatStepperModule} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales, TipoProductoModelo, MarcaModelo, ModeloModelo} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {VentaService} from '../ventas.service';
import { FileHolder } from 'angular2-image-upload';

@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers:[ServiciosGenerales, VentaService]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteArchivos {

  public dni: FileHolder;
  public cip: FileHolder;
  public contrato: FileHolder;
  public transaccion: FileHolder;
  public planilla: FileHolder;
  public letra: FileHolder;
  public autorizacion: FileHolder;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteArchivos>,
  ) {}


  ngOnInit() {

    if (this.data) {
      console.log(this.data)
      this.dni=this.data.dni
    }

  }

  SubirDNI(evento){
    this.dni=evento;
  }

  SubirCIP(evento){
    this.cip=evento;
  }

  SubirContrato(evento){
    this.contrato=evento;
  }

  SubirTransaccion(evento){
    this.transaccion=evento;
  }

  SubirPlanilla(evento){
    this.planilla=evento;
  }

  SubirLetra(evento){
    this.letra=evento;
  }

  SubirAutorizacion(evento){
    this.autorizacion=evento;
  }
  
  Guardar(){
    
    this.ventana.close({
          dni:this.dni
        })
  }

}
