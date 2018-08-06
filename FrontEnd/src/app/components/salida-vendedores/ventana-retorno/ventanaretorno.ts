import { async } from '@angular/core/testing';
import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';




@Component({
  selector: 'app-ventanaretorno',
  templateUrl: './ventanaretorno.html',
  styleUrls: ['./ventanaretorno.css'],
})


// tslint:disable-next-line:component-class-suffix
// tslint:disable-next-line:class-name
export class ventanaRetorno implements OnInit {
  public serietalorarios: Array<any>;
  public Agregatalonarion: any;
  public selectedValue: string;
  public cierreSalidaForm: FormGroup;
  public ClientesForm: FormGroup;
  public serie: Array<any>;
  public inicio: number;
  public fin: number;
  public numero: number;
  public contador: number;
  public serietalonarios: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ventanaRetorno>) {
  this.contador = 1;
  this.serietalonarios = [{numero: this.contador, serie: '', inicio: '', fin: ''} ];
 }

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit() {

  }

  Agregatalonario() {
    this.contador++;
    this.serietalonarios.push({numero: this.contador, serie: '', inicio: '', fin: ''});
  }

}
