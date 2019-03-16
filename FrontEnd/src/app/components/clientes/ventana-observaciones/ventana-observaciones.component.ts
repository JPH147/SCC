import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { ClienteService } from '../clientes.service'
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-ventana-observaciones',
  templateUrl: './ventana-observaciones.component.html',
  styleUrls: ['./ventana-observaciones.component.css'],
  providers: [ClienteService]
})

export class VentanaObservacionesComponent implements OnInit {

	public observacion: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ListadoObservaciones: ObservacionesDataSource;
  Columnas: string[] = [ 'numero', 'observacion', 'fecha', 'opciones'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaObservacionesComponent>,
    private Servicio: ClienteService,
    private Dialogo: MatDialog,
  ) { }

  ngOnInit() {
   this.ListadoObservaciones = new ObservacionesDataSource(this.Servicio);
   this.ListadoObservaciones.CargarClientes(this.data,1, 5);
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
  	this.ListadoObservaciones.CargarClientes(this.data, this.paginator.pageIndex+1, this.paginator.pageSize)
  }

  Eliminar(id){

  	let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
  	  width: '400px',
  	  data: {objeto: 'la observacion', valor: ""}
  	});

	  VentanaConfirmar.afterClosed().subscribe(res => {
	    if (res === true) {
		  	this.Servicio.EliminarObservacion(id).subscribe(res=>{
		  		this.CargarData();
		  	})
	    }
	  });

  }

  Guardar(){
  	this.Servicio.CrearObservacion(this.data, this.observacion, new Date).subscribe(res=>{
  		this.observacion="";
  		this.CargarData()
  	})
  }

  onNoClick(): void {
    this.ventana.close();
  }

}

export class ObservacionesDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: ClienteService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
    this.InformacionClientes.complete();
    this.CargandoInformacion.complete();
  }

  CargarClientes(
    id_cliente: number,
    pagina: number,
    total_pagina: number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarObservacion(id_cliente, pagina , total_pagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
  		if (res['data']) {
  			this.InformacionClientes.next(res['data'].observaciones);
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