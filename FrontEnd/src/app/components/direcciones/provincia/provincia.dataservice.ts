import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class ProvinciaDataSource implements DataSource<Provincia> {

  private InformacionProvincias = new BehaviorSubject<Provincia[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados= new BehaviorSubject<number>(0);;

constructor(private Servicio: ServiciosDirecciones) { }

  connect(collectionViewer: CollectionViewer): Observable<Provincia[]> {
  	return this.InformacionProvincias.asObservable();
  }

  disconnect(){
	  this.InformacionProvincias.complete();
	  this.CargandoInformacion.complete();
  }

  CargarProvincias(
  	departamento:string,
    nombre: string,
    pagina:number,
    total_pagina:number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarProvincias(departamento,nombre,pagina,total_pagina)
  .pipe(catchError(() => of([])),
  	finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    if(res){
      this.TotalResultados.next(res['mensaje']);
      this.InformacionProvincias.next(res['data'].provincias);
    } else {
      this.TotalResultados.next(0);
      this.InformacionProvincias.next([]);
    }
  });
  }

}
