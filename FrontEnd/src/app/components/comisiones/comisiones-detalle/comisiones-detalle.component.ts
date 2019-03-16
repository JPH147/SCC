import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ComisionesService} from '../comisiones.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-comisiones-detalle',
  templateUrl: './comisiones-detalle.component.html',
  styleUrls: ['./comisiones-detalle.component.css']
})
export class ComisionesDetalleComponent implements OnInit {

  ListadoComisiones: ComisionesDetalleDataSource;
  Columnas: string[] = ['numero', 'fecha' , 'talonario', 'comision_efectiva', 'comision_efectiva_estado', 'comision_retenida', 'comision_retenida_estado'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ComisionesDetalleDataSource>,
		private Servicio: ComisionesService
  ) { }

  ngOnInit() {
   	this.ListadoComisiones = new ComisionesDetalleDataSource(this.Servicio);
  	this.ListadoComisiones.CargarComisiones( this.data.id, 1, 5);
  }

}

export class ComisionesDetalleDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: ComisionesService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
  	this.InformacionClientes.complete();
  	this.CargandoInformacion.complete();
  }

  CargarComisiones(
    id_vendedor: number,
    pagina: number,
    totalpagina: number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarComisionesxVendedor(id_vendedor, pagina, totalpagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
  	  // console.log(res)
      this.TotalResultados.next(res['mensaje']);
      this.InformacionClientes.next(res['data'].vendedores);
    });
  }

}