import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosDirecciones, Distrito} from '../../global/direcciones';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class DistritoDataSource implements DataSource<Distrito> {

  private InformacionDistritos = new BehaviorSubject<Distrito[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();

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
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarDistritos(departamento,provincia,nombre)
  .pipe(catchError(() => of([])),
  	finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => this.InformacionDistritos.next(res));
  }

}
