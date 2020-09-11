import { Component } from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {StockService } from './stock.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, subscribeOn} from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';
import {ServiciosProductoSerie} from 'src/app/core/servicios/productoserie';

export class StockDataSource implements DataSource <any> {

  private InformacionStock = new BehaviorSubject<any[]> ([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public Totalresultados = new BehaviorSubject<number> (0);

  constructor (
    private Servicio: StockService,
  ) {}
  
  connect(CollectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionStock.asObservable();
   }

  disconnect() {
    this.InformacionStock.complete();
    this.CargandoInformacion.complete();
    }

  CargarStock(
    almacen: string,
    tipo: string,
    marca: string,
    modelo: string,
    producto: string,
    pagina_inicio: number,
    total_pagina: number,
    orden: string
  ){
    this.CargandoInformacion.next(true);
    this.Servicio.ListarStock(almacen, tipo, marca, modelo, producto, pagina_inicio, total_pagina, orden, )
    .pipe(catchError(() => of ([])),
    finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      // console.log(almacen,tipo,marca,modelo,producto,pagina_inicio,total_pagina,orden);
      this.Totalresultados.next(res['mensaje']);
      this.InformacionStock.next(res['data'].stock);
    });
  }

}

export class StockSerieDataSource implements DataSource <any> {

  private InformacionStock = new BehaviorSubject<any[]> ([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public Totalresultados = new BehaviorSubject<number> (0);

  constructor (private Servicio: ServiciosProductoSerie) {}

  connect(CollectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionStock.asObservable();
    }

  disconnect() {
    this.InformacionStock.complete();
    this.CargandoInformacion.complete();
    }

  CargarStock(
    almacen: string,
    producto: number,
    pagina: number,
    total_pagina: number
  ){
    this.CargandoInformacion.next(true);
    this.Servicio.Listado(almacen, producto,pagina,total_pagina)
    .pipe(catchError(() => of ([])),
    finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      // console.log(almacen,producto,pagina,total_pagina);
      this.Totalresultados.next(res['mensaje']);
      this.InformacionStock.next(res['data'].producto_series);
    });
  }
  
}