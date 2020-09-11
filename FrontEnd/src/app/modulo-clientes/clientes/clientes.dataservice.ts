import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ClienteService} from './clientes.service';
import {BehaviorSubject, Observable, of, Subject, interval} from 'rxjs';
import {catchError, finalize, switchMap, takeUntil, tap} from 'rxjs/operators';

export class ClienteDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);
  private tiempo_consulta = new BehaviorSubject<number>(0) ; // Se coloca esto para asegurarnos que solo se muestre
                                                             // el último valor consultado

  constructor(
    private Servicio: ClienteService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
    this.InformacionClientes.complete();
    this.CargandoInformacion.complete();
  }

  CargarClientes(
    relacion : boolean ,
    codigo:string,
    cip:string,
    dni: string,
    nombre: string,
    institucion: number,
    sede: number,
    prpagina: number,
    prtotalpagina: number,
    estado : number
  ){
    this.CargandoInformacion.next(true);
    this.tiempo_consulta.next(new Date().getTime()) ;

    if( relacion ) {
      this.Servicio.ListadoComercial( codigo, cip, dni, nombre, institucion, sede, prpagina, prtotalpagina, estado)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.CargandoInformacion.next(false)),
      )
      .subscribe(res => {
        this.TotalResultados.next(res['mensaje']);
        this.InformacionClientes.next(res['data'].clientes);
      });
    } else {
      this.Servicio.Listado( codigo, cip, dni, nombre, institucion, sede, prpagina, prtotalpagina, estado, this.tiempo_consulta.value )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.CargandoInformacion.next(false)),
      )
      .subscribe(res => {
        if( res['tiempo'] == this.tiempo_consulta.value ) {
          this.TotalResultados.next(res['mensaje']);
          this.InformacionClientes.next(res['data'].clientes);
        }
      });
    }
  }

}
