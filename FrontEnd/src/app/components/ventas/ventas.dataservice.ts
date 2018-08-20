import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Venta, VentaService} from './ventas.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class VentaDataSource implements DataSource<Venta> {

  private InformacionVenta = new BehaviorSubject<Venta[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();

constructor(private Servicio: VentaService) { }

  connect(collectionViewer: CollectionViewer): Observable<Venta[]> {
  return this.InformacionVenta.asObservable();
  }

disconnect() {
this.InformacionVenta.complete();
this.CargandoInformacion.complete();
  }

  GenerarCronograma(
    fechainicio: string,
    monto: any,
    numerocuotas: number,
    inicial: number
  // tslint:disable-next-line:one-line
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.GenerarCronograma(fechainicio, monto, numerocuotas, inicial)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => this.InformacionVenta.next(res));
  }
}
