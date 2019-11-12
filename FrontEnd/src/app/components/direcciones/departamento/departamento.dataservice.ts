import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ServiciosDirecciones, Departamento} from '../../global/direcciones';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class DepartamentoDataSource implements DataSource<Departamento> {

  private InformacionDepartamentos = new BehaviorSubject<Departamento[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados= new BehaviorSubject<number>(0);;

constructor(private Servicio: ServiciosDirecciones) { }

  connect(collectionViewer: CollectionViewer): Observable<Departamento[]> {
  return this.InformacionDepartamentos.asObservable();
  }

  disconnect(){
  this.InformacionDepartamentos.complete();
  this.CargandoInformacion.complete();
  }

  CargarDepartamentos(
    nombre: string,
    pagina:number,
    total_pagina:number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarDepartamentos(nombre,pagina,total_pagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    if(res){
      this.TotalResultados.next(res['mensaje']);
      this.InformacionDepartamentos.next(res['data'].departamentos);
    } else {
      this.TotalResultados.next(0);
      this.InformacionDepartamentos.next([]);
    }
  });
  }

}
