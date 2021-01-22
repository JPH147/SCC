import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of, merge, fromEvent } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { VentaService } from '../../../modulo-ventas/ventas/ventas.service';
import {ServiciosTelefonos} from 'src/app/core/servicios/telefonos';
import {ServiciosDirecciones} from 'src/app/core/servicios/direcciones';
import { Router } from '@angular/router';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Store } from '@ngrx/store';
import { EstadoSesion } from 'src/app/compartido/reducers/permisos.reducer';
import { ClienteService } from '../../../modulo-clientes/clientes/clientes.service';

@Component({
  selector: 'app-ventana-ventas',
  templateUrl: './ventana-ventas.component.html',
  styleUrls: ['./ventana-ventas.component.scss'],
  providers: [VentaService, ServiciosTelefonos, ServiciosDirecciones]
})

export class VentanaVentasComponent implements OnInit {

  @ViewChild('InputDocumento', { static: true }) FiltroDocumento: ElementRef;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public estado : number;
  public fecha : Date;

  ListadoVentas: VentasClienteDataSource;
  Columnas: string[] = [ 'documento', 'tipo','fecha', 'total', 'estado', 'opciones'];

  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaVentasComponent>,
    private Servicio: VentaService,
    private _clientes : ClienteService ,
    private router: Router
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.estado=2;
    this.fecha = new Date();
    this.ListadoVentas = new VentasClienteDataSource(this.Servicio);
    this.ListadoVentas.CargarVentas(this.data.id, "", this.fecha, 2, 1, 50);
  }

  ngAfterViewInit(){

    merge(
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup')
     ).pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
      //  this.paginator.pageIndex=0
       this.CargarData();
     })
    ).subscribe();

    // this.paginator.page
    // .pipe(
    //  debounceTime(200),
    //  distinctUntilChanged(),
    //  tap(() => {
    //    this.CargarData();
    //  })
    // ).subscribe();
  }

  CargarData(){
  	this.ListadoVentas.CargarVentas(
      this.data.id,
      this.FiltroDocumento.nativeElement.value,
      this.fecha,
      this.estado,
      1 ,
      50
    )
  }

  HacerVenta(){
    this.ventana.close();
    this.router.navigate(['/ventas','ventas','nueva', this.data.id]);
  }

  HacerCredito(){
    this.ventana.close();
    this.router.navigate(['/creditos','creditos','nuevo-cliente', this.data.id]);
  }

  onNoClick(): void {
    this.ventana.close();
  }

  VerVenta(transaccion){
    console.log(transaccion) ;
    if(transaccion.id_tipo==1){
      this.router.navigate(['/creditos','afiliaciones','ver', transaccion.id], {queryParams: {}});
    }
    if(transaccion.id_tipo==2){
      this.router.navigate(['/creditos','creditos','ver', transaccion.id], {queryParams: {}});
    }
    if(transaccion.id_tipo==3){
      this.router.navigate(['/ventas','ventas', transaccion.id], {queryParams: {}});
    }
    if(transaccion.id_tipo==4){
      this.router.navigate(['/ventas','ventas','salida', transaccion.id], {queryParams: {}});
    }
    this.ventana.close(true);
  }

  VerPlanilla() {
    this._clientes.ObtenerInformacionPlanillaPNP2(this.data.cliente.codigo, this.data.cliente.dni)
  }

}

export class VentasClienteDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  public Informacion = this.InformacionClientes.asObservable();
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