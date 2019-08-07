import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Cliente, ClienteService} from './clientes.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class ClienteDataSource implements DataSource<Cliente> {

  private InformacionClientes = new BehaviorSubject<Cliente[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: ClienteService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<Cliente[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
    this.InformacionClientes.complete();
    this.CargandoInformacion.complete();
  }

  CargarClientes(
    codigo:string,
    dni: string,
    nombre: string,
    prpagina: number,
    prtotalpagina: number,
    estado : number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.Listado( codigo, dni, nombre, prpagina, prtotalpagina, estado)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
      // console.log(res);
      this.TotalResultados.next(res['mensaje']);
      this.InformacionClientes.next(res['data'].clientes);
    });
  }

}
