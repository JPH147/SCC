import { Component, OnInit } from '@angular/core';
import {CollectionViewer, DataSource } from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {ReglasEvaluacionService} from './reglas-evaluacion.service';

@Component({
  selector: 'app-reglas-evaluacion',
  templateUrl: './reglas-evaluacion.component.html',
  styleUrls: ['./reglas-evaluacion.component.css']
})

export class ReglasEvaluacionComponent implements OnInit {

  public ListadoReglas: ReglasEvaluacionDataSource;
  public Columnas: string[] = ['numero', 'tipo', 'desde', 'hasta'];

  constructor(
    private Servicio: ReglasEvaluacionService
  ) { }

  ngOnInit() {
    this.ListadoReglas = new ReglasEvaluacionDataSource(this.Servicio);
    this.ListadoReglas.CargarReglas();
  }

}

export class ReglasEvaluacionDataSource implements DataSource<any> {

    private InformacionProveedores = new BehaviorSubject<any>([]);
    private CargandoInformacion = new BehaviorSubject<boolean>(false);
    public Cargando = this.CargandoInformacion.asObservable();
    public TotalResultados= new BehaviorSubject<number>(0);;

    constructor (private Servicio: ReglasEvaluacionService) {}

    connect(CollectionViewer: CollectionViewer): Observable<any> {
        return this.InformacionProveedores.asObservable();
    }

    disconnect(){
        this.InformacionProveedores.complete();
        this.CargandoInformacion.complete();
    }

    CargarReglas(){

        this.CargandoInformacion.next(true);

        this.Servicio.ListarReglas()
        .pipe(catchError(() => of([])),
        finalize(() => this.CargandoInformacion.next(false))
        )
        .subscribe(res => {
            this.TotalResultados.next(res['mensaje']);
            this.InformacionProveedores.next(res['data'].reglas);
          });
    }

}
