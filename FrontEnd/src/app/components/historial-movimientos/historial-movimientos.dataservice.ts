import { Injectable } from '@angular/core';
import { HistorialMovimientosService } from './historial-movimientos.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, from } from 'rxjs';
import {catchError, finalize } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class HistorialMovimientosDataService implements DataSource<any> {

  private InformacionProductos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio:HistorialMovimientosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionProductos.asObservable();
  }

  disconnect() {
    this.InformacionProductos.complete();
    this.CargandoInformacion.complete();
  }

  CargarDatos(
    almacen:string,
    tipo:string,
    referente:string,
    fecha_inicio: Date,
    fecha_fin: Date,
    documento:string,
    pagina_inicio: number,
    total_pagina: number,
    orden:string,
  ) {
  this.CargandoInformacion.next(true);
  this.Servicio.ListarMovimientos(
    almacen,
    tipo,
    referente,
    fecha_inicio,
    fecha_fin,
    documento,
    pagina_inicio,
    total_pagina,
    orden
  )
  .pipe(catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.InformacionProductos.next(res['data'].transacciones)
    });
  }

}
