import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';




@Component({
  selector: 'app-ventanaretorno',
  templateUrl: './ventanaretorno.html',
  styleUrls: ['./ventanaretorno.css'],
})


// tslint:disable-next-line:component-class-suffix
export class ventanaRetorno implements OnInit {
  public selectedValue: string;
  public cierreSalidaForm: FormGroup;
  public ClientesForm: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ventanaRetorno>,


) {}


  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit() {



  }

}

