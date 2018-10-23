import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosGenerales} from '../../global/servicios';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class TipoDataSource implements DataSource<any> {

  private InformacionTipo = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

constructor(private Servicio: ServiciosGenerales) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionTipo.asObservable();
  }

  disconnect() {
  this.InformacionTipo.complete();
  this.CargandoInformacion.complete();
  }


  CargarTipo(
    nombre: string,
    unidad_medida: string,
    prpagina: number,
    prtotalpagina: number
  // tslint:disable-next-line:one-line
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarTipoProductos2(nombre, unidad_medida , prpagina, prtotalpagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.InformacionTipo.next(res['data'].tipo_productos);
    });
  }

}
