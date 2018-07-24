import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class ProvinciaDataSource implements DataSource<Provincia> {

  private InformacionProvincias = new BehaviorSubject<Provincia[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();

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
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarProvincias(departamento,nombre)
  .pipe(catchError(() => of([])),
  	finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => this.InformacionProvincias.next(res));
  }

}
