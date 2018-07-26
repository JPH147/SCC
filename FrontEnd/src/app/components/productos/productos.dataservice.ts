import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Producto, ProductoService} from './productos.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class ProductoDataSource implements DataSource<Producto> {

  private InformacionProductos = new BehaviorSubject<Producto[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados= new BehaviorSubject<number>(0);;

constructor(private Servicio: ProductoService) { }

  connect(collectionViewer: CollectionViewer): Observable<Producto[]> {
  return this.InformacionProductos.asObservable();
  }

disconnect(){
this.InformacionProductos.complete();
this.CargandoInformacion.complete();
  }

  CargarProductos(
    tipo: string,
    marca: string,
    modelo: string,
    descripcion: string,
    pagina:number,
    total_pagina:number

  ){
  this.CargandoInformacion.next(true);

  this.Servicio.Listado(tipo, marca, modelo, descripcion,pagina,total_pagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.InformacionProductos.next(res['data'].productos)
  });
  }

}
