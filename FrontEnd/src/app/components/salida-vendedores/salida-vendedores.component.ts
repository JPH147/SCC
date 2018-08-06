import { ventanaseriessv } from './ventana-seriessv/ventanaseriessv';
import { ventanaRetorno } from './ventana-retorno/ventanaretorno';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.css']
})

export class SalidaVendedoresComponent implements OnInit {
  public talonarioSalidaForm: FormGroup;
  public talonarioForm: FormGroup;
  public articulos: Array <Articulo>;
  public contador: number;
  public almacenes: Array<any>;
  public serieventana: string;
  public talonventana: string;
  public serietalorarios: Array<any>;
  public Agregatalonarion: any;
  public selectedValue: string;
  public serie: Array<any>;
  public inicio: number;
  public fin: number;
  public numero: number;


  animal: string;
  name: string;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  toppings = new FormControl();
  toppingList: string[] = ['Jean Pierre', 'Joel Vicuña', 'Carlos Rodriguez', 'Jean Paul', 'Ivan Arones', 'Fernando Martinez'];

  selection = new SelectionModel<PeriodicElement>(true, []);
    foods: Food[] = [
      {value: 'steak-0', viewValue: 'Celular'},
      {value: 'pizza-1', viewValue: 'Televisor'},
      {value: 'tacos-2', viewValue: 'Libro'}
    ];
  serietalonarios: { numero: number; serie: string; inicio: string; fin: string; }[];

  constructor(public dialog: MatDialog, public DialogoSerie: MatDialog, public Dialogotalon: MatDialog )   {
    this.contador = 1;
    this.serietalonarios = [{numero: this.contador, serie: '', inicio: '', fin: ''} ];
  }

openDialog(): void {
  const dialogRef = this.dialog.open(DialogoComponent, {
    width: '250px',
    data: {name: this.name, animal: this.animal}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.animal = result;
  });
}


 ngOnInit() {
  this.contador = 1;
  this.articulos = [
    {numero: this.contador, nombre: '', cantidad: null, precio: null}
  ];

 }

 agregar() {
  this.contador++;
  this.articulos.push({numero: this.contador, nombre: '', cantidad: null, precio: null});
}

Aceptar() {
  console.log(this.articulos);
}


AgregarSerieSalidaV() {
const serieventana = this.DialogoSerie.open(ventanaseriessv, {
  width: '800px'
});

}

Agregatalonario() {
  const  serietalorarios = this.Dialogotalon.open(ventanaRetorno, {
    width: '600px'
  });

}
}
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.html',
})
export class DialogoComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



export interface Articulo {
  numero: number;
  nombre: string;
  cantidad: number;
  precio: number;
}





