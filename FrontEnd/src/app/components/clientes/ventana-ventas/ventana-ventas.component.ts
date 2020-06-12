import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of, merge, fromEvent, forkJoin } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { VentaService } from '../../ventas/ventas.service';
import {ServiciosTelefonos} from '../../global/telefonos';
import {ServiciosDirecciones} from '../../global/direcciones';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventana-ventas',
  templateUrl: './ventana-ventas.component.html',
  styleUrls: ['./ventana-ventas.component.css'],
  providers: [VentaService, ServiciosTelefonos, ServiciosDirecciones]
})

export class VentanaVentasComponent implements OnInit {

  public estado : number;
  public fecha : Date;

  @ViewChild('InputDocumento', { static: true }) FiltroDocumento: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ListadoVentas: VentasClienteDataSource;
  Columnas: string[] = [ 'documento', 'tipo','fecha', 'total', 'estado', 'opciones'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaVentasComponent>,
    private Servicio: VentaService,
    private STelefonos: ServiciosTelefonos,
    private SDirecciones: ServiciosDirecciones,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.estado=0;
    this.fecha = new Date();
    this.ListadoVentas = new VentasClienteDataSource(this.Servicio);
    this.ListadoVentas.CargarVentas(this.data.id, "", this.fecha, 0, 1, 5);
  }

  ngAfterViewInit(){

    merge(
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup')
     ).pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.paginator.pageIndex=0
       this.CargarData();
     })
    ).subscribe();

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
  	this.ListadoVentas.CargarVentas(
      this.data.id,
      this.FiltroDocumento.nativeElement.value,
      this.fecha,
      this.estado,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    )
  }

  HacerVenta(){
    this.ventana.close();
    this.router.navigate(['/ventas/nueva', this.data.id]);
  }

  HacerCredito(){
    this.ventana.close();
    this.router.navigate(['/creditos/nuevo-cliente', this.data.id]);
  }

  onNoClick(): void {
    this.ventana.close();
  }

  VerVenta(transaccion){
    if(transaccion.id_tipo<3){
      this.router.navigate(['/creditos/ver', transaccion.id], {queryParams: {}});
    }
    if(transaccion.id_tipo==3){
      this.router.navigate(['/ventas', transaccion.id], {queryParams: {}});
    }
    if(transaccion.id_tipo==4){
      this.router.navigate(['/ventas', 'salida', transaccion.id], {queryParams: {}});
    }
    this.ventana.close(true);
  }

}

export class VentasClienteDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: VentaService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
  this.InformacionClientes.complete();
  this.CargandoInformacion.complete();
  }

  CargarVentas(
    id_cliente: number,
    documento:string,
    fecha:Date,
    estado:number,
    pagina: number,
    total_pagina: number
  ){
  	this.CargandoInformacion.next(true);
  	this.Servicio.ListarVentasxCliente(
  		id_cliente,
  		documento,
  		fecha,
  		estado,
  		pagina ,
  		total_pagina
  	)
  	.pipe(catchError(() => of([])),
  	finalize(() => this.CargandoInformacion.next(false))
  	)
  	.subscribe(res => {
  		if (res['data']) {
  			this.InformacionClientes.next(res['data'].ventas);
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