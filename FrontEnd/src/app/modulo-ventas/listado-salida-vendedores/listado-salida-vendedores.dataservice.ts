import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ListadoSalidaVendedoresService} from './listado-salida-vendedores.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class ListadoSalidaVendedoresDataSource implements DataSource<any> {

  private Datos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

constructor(private Servicio: ListadoSalidaVendedoresService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.Datos.asObservable();
  }

  disconnect() {
  this.Datos.complete();
  this.CargandoInformacion.complete();
  }

  CargarDatos(
    pecosa: string,
    sucursal: number,
    fecha_inicio: Date,
    fecha_fin: Date,
    destino: string,
    vendedor:string,
    estado:number,
    pagina: number,
    total_pagina: number,
    orden: string
  ) {
  this.CargandoInformacion.next(true);

  this.Servicio.Listado(pecosa, sucursal, fecha_inicio, fecha_fin, destino,vendedor,estado, pagina, total_pagina, orden)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.Datos.next(res['data'].salidas)
  });
  }

}
