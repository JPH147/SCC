import { Injectable } from '@angular/core';
import { HistorialSerieService, ProductoSerie } from './historial-serie.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, from } from 'rxjs';
import {catchError, finalize } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class HistorialSerieDataService implements DataSource<ProductoSerie> {

  private InformacionProductos = new BehaviorSubject<ProductoSerie[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio:HistorialSerieService ) { }

  connect(collectionViewer: CollectionViewer): Observable<ProductoSerie[]> {
    return this.InformacionProductos.asObservable();
    }

    disconnect() {
      this.InformacionProductos.complete();
      this.CargandoInformacion.complete();
      }

      CargarProductos(
        serie: string,
        pagina: number,
        total_pagina: number
        
      ) {
      this.CargandoInformacion.next(true);
    
      this.Servicio.ListadoSerie(serie, pagina, total_pagina)
      .pipe(catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
      )
      .subscribe(res => {
        this.TotalResultados.next(res['mensaje']);
        // tslint:disable-next-line:semicolon
        console.log(res['data'].series);
        this.InformacionProductos.next(res['data'].series)
      });
      }





}
