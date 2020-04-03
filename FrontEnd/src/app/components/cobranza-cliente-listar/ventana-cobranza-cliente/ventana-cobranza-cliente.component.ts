import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of, merge, fromEvent, forkJoin } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { Router } from '@angular/router';
import { CobranzasService } from '../../cobranzas-listar/cobranzas.service';

@Component({
  selector: 'app-ventana-cobranza-cliente',
  templateUrl: './ventana-cobranza-cliente.component.html',
  styleUrls: ['./ventana-cobranza-cliente.component.css']
})
export class VentanaCobranzaClienteComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public ListadoCronograma: CronogramaDataSource;
  public Columnas: string[] = [ 'numero', 'tipo', 'codigo', 'fecha', 'monto_total'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaCobranzaClienteComponent>,
    private Servicio: CobranzasService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ListadoCronograma = new CronogramaDataSource(this.Servicio);
    this.ListadoCronograma.CargarCronograma(this.data.cliente, this.data.fecha_inicio, this.data.fecha_fin, 1, 5);
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
      this.data.fecha_inicio,
      this.data.fecha_fin,
      this.paginator.pageIndex+1,
      this.paginator.pageSize)
  }

  onNoClick(): void {
    this.ventana.close();
  }

  // VerConograma(transaccion){
  //   if(transaccion.id_tipo<3){
  //     this.router.navigate(['/creditos/ver', transaccion.id]);
  //   }
  //   if(transaccion.id_tipo==3){
  //     this.router.navigate(['/ventas', transaccion.id]);
  //   }
  //   if(transaccion.id_tipo==4){
  //     this.router.navigate(['/ventas', 'salida', transaccion.id]);
  //   }
  //   this.ventana.close();
  // }

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
    id_cliente: number,
    fecha_inicio:Date,
    fecha_fin:Date,
    pagina: number,
    total_pagina: number
  ){
  	this.CargandoInformacion.next(true);
  	this.Servicio.ListarCronogramaxCliente(
  		id_cliente,
  		fecha_inicio,
  		fecha_fin,
  		pagina ,
  		total_pagina
  	)
  	.pipe(catchError(() => of([])),
  	  finalize(() => this.CargandoInformacion.next(false))
  	)
  	.subscribe(res => {
      console.log(res)
  		if (res['data']) {
  			this.InformacionClientes.next(res['data'].cronograma);
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