import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Cliente, ClienteService} from './clientes.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class ClienteDataSource implements DataSource<Cliente> {

  private InformacionClientes = new BehaviorSubject<Cliente[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

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
    sede: string,
    subsede: string,
    dni: string,
    nombre: string,
    prpagina: number,
    prtotalpagina: number
  // tslint:disable-next-line:one-line
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.Listado(nombreinst, sede , subsede, dni, nombre, prpagina, prtotalpagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    console.log(res);
    this.TotalResultados.next(res['mensaje']);
     this.InformacionClientes.next(res['data'].clientes);
    });
  }

}
