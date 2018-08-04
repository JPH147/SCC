import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Cliente, ClienteService} from './clientes.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class ClienteDataSource implements DataSource<Cliente> {

  private InformacionClientes = new BehaviorSubject<Cliente[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();

constructor(private Servicio: ClienteService) { }

  connect(collectionViewer: CollectionViewer): Observable<Cliente[]> {
  return this.InformacionClientes.asObservable();
  }

disconnect(){
this.InformacionClientes.complete();
this.CargandoInformacion.complete();
  }

  CargarClientes(
    nombreinst: string,
    dni: string,
    nombre: string,
    apellido: string
  // tslint:disable-next-line:one-line
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.Listado(nombreinst, dni, nombre, apellido)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => this.InformacionClientes.next(res));
  }

}
