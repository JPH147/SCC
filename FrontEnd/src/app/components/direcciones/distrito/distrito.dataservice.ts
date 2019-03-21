import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosDirecciones, Distrito} from '../../global/direcciones';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class DistritoDataSource implements DataSource<Distrito> {

  private InformacionDistritos = new BehaviorSubject<Distrito[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados= new BehaviorSubject<number>(0);;

constructor(private Servicio: ServiciosDirecciones) { }

  connect(collectionViewer: CollectionViewer): Observable<Distrito[]> {
  	return this.InformacionDistritos.asObservable();
  }

  disconnect(){
	  this.InformacionDistritos.complete();
	  this.CargandoInformacion.complete();
  }

  CargarDistritos(
  	departamento:string,
    provincia:string,
    nombre: string,
    pagina:number,
    total_pagina:number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarDistritos(departamento,provincia,nombre,pagina,total_pagina)
  .pipe(catchError(() => of([])),
  	finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.InformacionDistritos.next(res['data'].distritos);
  });
  }

}
