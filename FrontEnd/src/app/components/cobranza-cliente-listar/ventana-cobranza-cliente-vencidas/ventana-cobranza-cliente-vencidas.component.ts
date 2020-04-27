import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of, merge, fromEvent, forkJoin } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { Router } from '@angular/router';
import { CobranzasService } from '../../cobranzas-listar/cobranzas.service';
import { ClienteService } from '../../clientes/clientes.service';
@Component({
  selector: 'app-ventana-cobranza-cliente-vencidas',
  templateUrl: './ventana-cobranza-cliente-vencidas.component.html',
  styleUrls: ['./ventana-cobranza-cliente-vencidas.component.css']
})
export class VentanaCobranzaClienteVencidasComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public ListadoCronograma: CronogramaDataSource;
  public Columnas: string[] = [ 'numero', 'tipo', 'codigo', 'fecha', 'monto_total', 'estado'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaCobranzaClienteVencidasComponent>,
    private Servicio: CobranzasService,
    private router: Router,
    private _clientes : ClienteService
  ) { }

  ngOnInit() {
    this.ListadoCronograma = new CronogramaDataSource(this.Servicio);
    this.ListadoCronograma.CargarCronograma(this.data.cliente, 1, 5);
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
      this.paginator.pageIndex+1,
      this.paginator.pageSize)
  }

  onNoClick(): void {
    this.ventana.close();
  }

  Verificar(){
    this._clientes.VerificarPagosCliente(this.data.cliente).subscribe(res=>{
      if( res['codigo']===0 ) {
        this.ventana.close( true )
      } else {
        this.ventana.close( false )
      }
    })
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
    id_cliente: number,
    pagina: number,
    total_pagina: number
  ){
  	this.CargandoInformacion.next(true);
  	this.Servicio.ListarCronogramaVencidoxCliente(
  		id_cliente,
  		pagina ,
  		total_pagina
  	)
  	.pipe(catchError(() => of([])),
  	  finalize(() => this.CargandoInformacion.next(false))
  	)
  	.subscribe(res => {
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