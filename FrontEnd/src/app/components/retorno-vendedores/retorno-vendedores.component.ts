import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';


export interface PeriodicElement {

  position: number;
  talonario: number;
  // pecosa: number;
  nroContrato: number;
  fecVenta: string;
  montoVenta: number;
  nroCuota: number;
  nomCliente: string;
  apeCliente: string;
  }

  const ELEMENT_DATA: PeriodicElement [] = [
    // tslint:disable-next-line:max-line-length
    {position: 1, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 101, nroContrato: 5644, fecVenta: '15/06/2018', montoVenta: 1500, nroCuota: 12 },
   // tslint:disable-next-line:max-line-length
   {position: 2, nomCliente: 'Jean Pierre', apeCliente: 'Rodriguez Farfan', talonario: 201, nroContrato: 5654, fecVenta: '15/06/2018', montoVenta: 2500, nroCuota: 12 },
   // tslint:disable-next-line:max-line-length
   {position: 3, nomCliente: 'Eduardo', apeCliente: 'Rodriguez Garcia', talonario: 501, nroContrato: 5674, fecVenta: '15/06/2018', montoVenta: 1800, nroCuota: 18 },
   // tslint:disable-next-line:max-line-length
   {position: 4, nomCliente: 'Ivan', apeCliente: 'Arones Castro', talonario: 801, nroContrato: 5644, fecVenta: '15/06/2018', montoVenta: 3500, nroCuota: 12 },
   // tslint:disable-next-line:max-line-length
   {position: 5, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 101, nroContrato: 5694, fecVenta: '15/06/2018', montoVenta: 1000, nroCuota: 24 },
   // tslint:disable-next-line:max-line-length
   {position: 6, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 651, nroContrato: 5649, fecVenta: '15/06/2018', montoVenta: 2500, nroCuota: 18 },
   // tslint:disable-next-line:max-line-length
   {position: 7, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 301, nroContrato: 5654, fecVenta: '15/06/2018', montoVenta: 3500, nroCuota: 24 },
   // tslint:disable-next-line:max-line-length
   {position: 8, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 451, nroContrato: 5659, fecVenta: '15/06/2018', montoVenta: 1000, nroCuota: 12 },
   // tslint:disable-next-line:max-line-length
   {position: 9, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 751, nroContrato: 5641, fecVenta: '15/06/2018', montoVenta: 2100, nroCuota: 18 },
   // tslint:disable-next-line:max-line-length
   {position: 10, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 901, nroContrato: 5674, fecVenta: '15/06/2018', montoVenta: 2500, nroCuota: 24 }];

export interface PeriodicElement1 {
  position1: number;
  producto: string;
  cantidad: number;
  serie: string;
  confirma: string;
  obs: string;
}

const ELEMENT_DATA1: PeriodicElement1 [] = [
{position1: 1, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 2, producto: 'Televisor', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 3, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 4, producto: 'Computadora', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 5, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: ''},
{position1: 6, producto: 'Celuelar', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 7, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 8, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 9, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
{position1: 10, producto: 'Libro', cantidad: 5, serie: ' ', confirma: ' ', obs: '' },
];

export interface PeriodicElement2 {
  position2: number;
  seriet: number;
  inicio: number;
  fin: number;
  confirmar: string;
}

const ELEMENT_DATA2: PeriodicElement2 [] = [
{position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '' },
{position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '' },
{position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '' },
{position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '' },
];


  @Component({
    selector: 'app-retorno-vendedores',
    templateUrl: './retorno-vendedores.component.html',
    styleUrls: ['./retorno-vendedores.component.css']
  })
  export class RetornoVendedoresComponent implements OnInit {
    dataSource = ELEMENT_DATA;
    displayedColumns: string[] = ['position', 'nomCliente', 'apeCliente', 'talonario', 'nroContrato', 'fecVenta', 'montoventa', 'nroCuota'];

    dataSource1 = ELEMENT_DATA1;
    displayedColumns1: string[] = ['position1', 'producto', 'cantidad', 'serie', 'confirma', 'obs' ];

    dataSource2 = ELEMENT_DATA2;
    displayedColumns2: string[] = ['position2', 'seriet', 'inicio', 'fin', 'confirmar'];

    constructor() { }

    ngOnInit() {
    }

  }

