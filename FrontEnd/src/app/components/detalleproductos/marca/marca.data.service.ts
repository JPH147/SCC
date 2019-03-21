import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosGenerales} from '../../global/servicios';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class MarcaDataSource implements DataSource<any> {

  private InformacionMarca = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

constructor(private Servicio: ServiciosGenerales) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionMarca.asObservable();
  }

  disconnect() {
  this.InformacionMarca.complete();
  this.CargandoInformacion.complete();
  }


  CargarMarca(
    tipo: string,
    nombre: string,
    prpagina: number,
    prtotalpagina: number
  // tslint:disable-next-line:one-line
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarMarca2(tipo, nombre , prpagina, prtotalpagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.InformacionMarca.next(res['data'].marca);
    });
  }

}
