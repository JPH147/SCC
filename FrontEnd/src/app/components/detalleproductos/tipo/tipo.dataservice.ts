import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosGenerales} from 'src/app/core/servicios/servicios';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

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

  this.Servicio.ListarTipoProductos2(null,nombre, unidad_medida , prpagina, prtotalpagina)
  .pipe(catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    // console.log(res)
    this.TotalResultados.next(res['mensaje']);
    this.InformacionTipo.next(res['data'].tipo_productos);
    });
  }

}
