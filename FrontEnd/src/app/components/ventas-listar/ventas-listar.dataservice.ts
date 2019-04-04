import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {VentasServicio} from './ventas-listar.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class VentaDataSource implements DataSource<any> {

  private InformacionProductos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

constructor(private Servicio: VentasServicio) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionProductos.asObservable();
  }

  disconnect() {
  this.InformacionProductos.complete();
  this.CargandoInformacion.complete();
  }

  CargarVentas(
    cliente:string,
    tipo_venta:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
    orden:string
  ) {
  this.CargandoInformacion.next(true);

  this.Servicio.Listado(cliente,tipo_venta,fecha_inicio,fecha_fin,estado,pagina_inicio,pagina_final,orden)
  .pipe(
    catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    this.TotalResultados.next(res['mensaje']);
    this.InformacionProductos.next(res['data'].ventas)
  });
  }

}
