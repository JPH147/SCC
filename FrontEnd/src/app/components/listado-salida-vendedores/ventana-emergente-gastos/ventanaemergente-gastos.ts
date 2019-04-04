import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ListadoSalidaVendedoresService } from '../listado-salida-vendedores.service';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { Builder } from 'protractor';

@Component({
  selector: 'app-ventanaemergentegastos',
  templateUrl: './ventanaemergente-gastos.html',
  styleUrls: ['./ventanaemergente-gastos.css'],
  providers: [ ListadoSalidaVendedoresService ]
})

export class VentanaEmergenteGastos {

  ListadoGastos: GastosSalidaDataSource;
  Columnas: string[] = [ 'numero', 'fecha', 'vendedor', 'monto', 'tipo', 'observacion', 'opciones'];
  public Vendedores: Array<any>;

  public fecha: Date;
  public vendedor: number;
  public monto: number;
  public tipo: number;
  public observacion: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteGastos>,
    private FormBuilder: FormBuilder,
    private Servicio: ListadoSalidaVendedoresService
  ) {}

  ngOnInit() {
    this.ListarVendedores();

    this.ListadoGastos = new GastosSalidaDataSource(this.Servicio);
    this.ListadoGastos.GargarGatos(this.data.id, 1, 5);

    this.fecha=new Date();
    this.monto=0;
    this.observacion="";
    
  }

  ListarVendedores(){
    this.Servicio.ListarVendedores(this.data.id).subscribe(res=>{
      this.Vendedores=res['data'].vendedores
      console.log(this.Vendedores)
    })
  }

  AgregarGasto(){

    this.Servicio.CrearGasto(
      this.data.id,
      this.fecha,
      this.vendedor,
      this.monto,
      this.tipo,
      this.observacion
    ).subscribe(res=>{
      this.ListadoGastos.GargarGatos(this.data.id, 1, 5);
    })
  }

  Eliminar(id){
    this.Servicio.EliminarGasto(id).subscribe(res=>{
      this.ListadoGastos.GargarGatos(this.data.id, 1, 5);
    })
  }

  onNoClick(): void {
    this.ventana.close();
  }
}

export class GastosSalidaDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: ListadoSalidaVendedoresService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
    this.InformacionClientes.complete();
    this.CargandoInformacion.complete();
  }

  GargarGatos(
    id_cabecera: number,
    pagina: number,
    total_pagina: number
  ){
    this.CargandoInformacion.next(true);

    this.Servicio.ListarGastos(id_cabecera, pagina , total_pagina)
    .pipe(catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
  		if (res['data']) {
  			this.InformacionClientes.next(res['data'].gastos);
  		}else{
  			this.InformacionClientes.next([])
  		}
  		if (res['mensaje']>0) {
  			this.TotalResultados.next(res['mensaje']);
  		}else{
  			this.TotalResultados.next(0)
  		}
    });
  }

}