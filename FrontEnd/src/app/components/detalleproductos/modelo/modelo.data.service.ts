import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosGenerales} from '../../global/servicios';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class ModeloDataSource implements DataSource<any> {

  private InformacionModelo = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

constructor(private Servicio: ServiciosGenerales) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionModelo.asObservable();
  }

  disconnect() {
  this.InformacionModelo.complete();
  this.CargandoInformacion.complete();
  }


  CargarModelo(
    marca: string,
    nombre: string,
    prpagina: number,
    prtotalpagina: number
  // tslint:disable-next-line:one-line
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarModelo2(marca, nombre , prpagina, prtotalpagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    console.log(res);
    this.TotalResultados.next(res['mensaje']);
    console.log(this.TotalResultados);
    this.InformacionModelo.next(res['data'].modelo);
    });
  }

}
