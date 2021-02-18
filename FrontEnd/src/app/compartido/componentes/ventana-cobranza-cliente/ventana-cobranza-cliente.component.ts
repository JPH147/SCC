import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of, merge, fromEvent, forkJoin } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { Router } from '@angular/router';
import { CobranzasService } from '../../../modulo-cobranzas/cobranzas-listar/cobranzas.service';

@Component({
  selector: 'app-ventana-cobranza-cliente',
  templateUrl: './ventana-cobranza-cliente.component.html',
  styleUrls: ['./ventana-cobranza-cliente.component.css']
})
export class VentanaCobranzaClienteComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public ListadoCronograma: CronogramaDataSource;
  public Columnas: string[] = [ 'numero', 'identificador', 'fecha_transaccion', 'ultima_fecha_pago', 'meses_sin_pagar', 'opciones'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaCobranzaClienteComponent>,
    private Servicio: CobranzasService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ListadoCronograma = new CronogramaDataSource(this.Servicio);
    this.ListadoCronograma.CargarCronograma(this.data.cliente, this.data.tipo_comparacion, this.data.limite, 1, 5);
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
  	this.ListadoCronograma.CargarCronograma(
      this.data.cliente,
      this.data.tipo_comparacion,
      this.data.limite,
      this.paginator.pageIndex+1,
      this.paginator.pageSize)
  }

  VerTransaccion(transaccion) {
    if(transaccion.tipo_transaccion==1){
      this.router.navigate(['/creditos','afiliaciones','ver', transaccion.id_transaccion] );
    }
    if(transaccion.tipo_transaccion==2){
      this.router.navigate(['/creditos','creditos','ver', transaccion.id_transaccion] );
    }
    if(transaccion.tipo_transaccion==3){
      this.router.navigate(['/ventas','ventas', transaccion.id_transaccion] );
    }
    if(transaccion.tipo_transaccion==4){
      this.router.navigate(['/ventas','ventas','salida', transaccion.id_transaccion] );
    }
    this.ventana.close();
  }

  onNoClick(): void {
    this.ventana.close();
  }
}

export class CronogramaDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: CobranzasService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
    this.InformacionClientes.complete();
    this.CargandoInformacion.complete();
  }

  CargarCronograma(
    cliente : number,
    tipo_comparacion : number,
    limite : number,
    numero_pagina : number,
    total_pagina : number,
  ){
  	this.CargandoInformacion.next(true);
  	this.Servicio.ListarCobranzasxClientePeriodosDetallado(
      cliente,
      // Se coloca 0 porque se deben mostrar todas las transacciones del cliente, 
      // idenpendientemente si algunas sean morosas y otras muy morosas
  		0 ,
  		0 ,
  		numero_pagina ,
  		total_pagina
  	)
  	.pipe(catchError(() => of([])),
  	  finalize(() => this.CargandoInformacion.next(false))
  	)
  	.subscribe(res => {
  		if (res['data']) {
  			this.InformacionClientes.next(res['data'].cobranza);
  		}else{
  			this.InformacionClientes.next([])
  		}
  		if (res['mensaje']>0) {
  			this.TotalResultados.next(res['mensaje']);
  		}else{
  			this.TotalResultados.next(0)
  		}
    });
  }

}