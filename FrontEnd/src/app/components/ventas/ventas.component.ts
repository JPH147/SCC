import { VentanaEmergenteArchivos } from './ventana-emergente/ventanaemergente';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VentaService} from './ventas.service';
import {VentaDataSource} from './ventas.dataservice';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule, MatIcon, MatDialog } from '@angular/material';

export interface PeriodicElement {
  numero: number;
  month: string;
  price: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {numero: 1, month: 'Agosto', price: '255.00'},
  {numero: 2, month: 'Setiembre', price: '255.00'}
];

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  providers: [VentaService]
})
export class VentasComponent implements OnInit {
  public ListadoCronograma: VentaDataSource;
  public typesdoc: string[] = [
    'Factura', 'Boleta'
  ];
  public states: string[] = [
    'Activo', 'Finalizado', 'Canjeado', 'Anulado'
  ];
  public displayedColumns: string[] = ['numero', 'month', 'price'];
  public dataSource = ELEMENT_DATA;
  public productos: any;
  public contador: number;
  public VentasForm: FormGroup;

  @ViewChild('InputFechaPago') FiltroFecha: ElementRef;
  @ViewChild('InputMontoTotal') FiltroMonto: ElementRef;
  @ViewChild('InputCuota') FiltroCuota: ElementRef;

  constructor(
    private Servicio: VentaService,
    public DialogoArchivos: MatDialog,
    private FormBuilder: FormBuilder
  ) {
    this.contador = 1;
    this.productos = [{ producto: '', imei: ''} ];
  }
  ngOnInit() {
    this.ListadoCronograma = new VentaDataSource(this.Servicio);
    this.ListadoCronograma.GenerarCronograma('','',0);
  }
  /* Agregar productos */
 Agregar() {
  // tslint:disable-next-line:prefer-const
  let VentanaAdjuntos = this.DialogoArchivos.open(VentanaEmergenteArchivos, {
    width: '800px'
  });
  }

  /*Cronograma */
  GeneraCronograma() {
    //this.FiltroFecha.nativeElement.value
    this.ListadoCronograma.GenerarCronograma('2018-08-08',
    this.FiltroMonto.nativeElement.value,this.FiltroCuota.nativeElement.value);

  }
  /*VentanaAdjuntos.afterClosed().subscribe(res => {
    this.CargarData();
  });*/
  AgregaProductos() {
    this.contador++;
    this.productos.push({ producto: '', imei: ''});
  }

  EliminarProductos() {
    this.contador--;
    this.productos.splice(1);
  }

}
