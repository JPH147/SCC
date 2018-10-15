import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosGenerales} from '../../global/servicios';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

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
    console.log(res);
    this.TotalResultados.next(res['mensaje']);
    console.log(this.TotalResultados);
    this.InformacionMarca.next(res['data'].marca);
    });
  }

}
