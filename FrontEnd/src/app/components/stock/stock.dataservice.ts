import { Component } from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {stock, StockService } from './stock.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize, subscribeOn} from 'rxjs/operators';
import {of} from 'rxjs';
import { ReturnStatement } from '@angular/compiler';

export class StockDataSource implements DataSource <stock> {
private InformacionStock = new BehaviorSubject<stock[]> ([]);
private CargandoInformacion = new BehaviorSubject<boolean>(false);
public Cargando = this.CargandoInformacion.asObservable();
public Totalresultados = new BehaviorSubject<number> (0);

constructor (private Servicio: StockService) {}
  // tslint:disable-next-line:no-shadowed-variable
  connect(CollectionViewer: CollectionViewer): Observable<stock[]> {
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
    ) {
    this.CargandoInformacion.next(true);
    this.Servicio.ListarStock(almacen, tipo, marca, modelo, producto, pagina_inicio, total_pagina, orden, )
    .pipe(catchError(() => of ([])),
    finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.Totalresultados.next(res['mensaje']);
      this.InformacionStock.next(res['data'].stock);
    });

}
}
