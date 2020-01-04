import {Component, Inject, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA,MatPaginator} from '@angular/material';
import {VentaService} from '../ventas.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize,debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

@Component({
  selector: 'app-ventana-cronograma',
  templateUrl: './ventana-cronograma.component.html',
  styleUrls: ['./ventana-cronograma.component.css'],
  providers: [VentaService]
})
export class VentanaCronogramaComponent implements OnInit {

  ListadoPagos: CronogramaPagosDataSource;
  Columnas: string[] = [ 'numero', 'pago', 'fecha', 'tipo_pago', 'comprobante'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaCronogramaComponent>,
    private Servicio: VentaService,
  ) { }

  ngOnInit() {
  	if (this.data) {
  		console.log(this.data)
  	}
   this.ListadoPagos = new CronogramaPagosDataSource(this.Servicio);
   this.ListadoPagos.CargarPagos(this.data.id,1, 5);
  }

  ngAfterViewInit(){
    this.paginator.page
    .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();
  }

  CargarData(){
  	this.ListadoPagos.CargarPagos(this.data.id, this.paginator.pageIndex+1, this.paginator.pageSize)
  }

}

export class CronogramaPagosDataSource implements DataSource<any> {

  private InformacionPagos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: VentaService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionPagos.asObservable();
  }

  disconnect(){
    this.InformacionPagos.complete();
    this.CargandoInformacion.complete();
  }

  CargarPagos(
    id_cronograma: number,
    pagina: number,
    total_pagina: number
  ){
  	this.CargandoInformacion.next(true);

  	this.Servicio.ListarPagosCronograma(id_cronograma, pagina , total_pagina)
  	.pipe(catchError(() => of([])),
  	finalize(() => this.CargandoInformacion.next(false))
  	).subscribe(res => {

  		console.log(res)
  		
  		if (res['data']) {
  			this.InformacionPagos.next(res['data'].cronograma_pagos);
  		}else{
  			this.InformacionPagos.next([])
  		}
  		if (res['mensaje']>0) {
  			this.TotalResultados.next(res['mensaje']);
  		}else{
  			this.TotalResultados.next(0)
  		}
    });
  }

}