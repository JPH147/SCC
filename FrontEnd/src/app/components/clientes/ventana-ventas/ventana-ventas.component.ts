import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
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

  public estado:number;

  @ViewChild('InputSerie') FiltroSerie: ElementRef;
  @ViewChild('InputNumero') FiltroNumero: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ListadoVentas: VentasClienteDataSource;
  Columnas: string[] = [ 'serie', 'fecha', 'total', 'estado', 'opciones'];

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
    this.ListadoVentas = new VentasClienteDataSource(this.Servicio);
    this.ListadoVentas.CargarVentas(this.data.id, "", "", 0, 1, 5);
  }

  ngAfterViewInit(){

    merge(
      fromEvent(this.FiltroSerie.nativeElement, 'keyup'),
      fromEvent(this.FiltroNumero.nativeElement, 'keyup')
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
  	this.ListadoVentas.CargarVentas(this.data.id, this.FiltroSerie.nativeElement.value , this.FiltroNumero.nativeElement.value , this.estado, this.paginator.pageIndex+1, this.paginator.pageSize)
    console.log(this.data.id, this.FiltroSerie.nativeElement.value , this.FiltroNumero.nativeElement.value, this.estado, this.paginator.pageIndex+1, this.paginator.pageSize)
  }

  HacerVenta(){
    forkJoin(
      this.STelefonos.ListarTelefono(this.data.id,"1",1,50),
      this.SDirecciones.ListarDireccion(this.data.id,"1",1,50)
    )
    .subscribe(res=>{
      if (res[0].mensaje==0 || res[1].mensaje==0) {
        this.snackBar.open("Debe agregar los datos de contacto para el cliente", "Entendido", {
          duration: 5000,
        });
      }else{
        this.ventana.close();
        this.router.navigate(['/ventas/nueva', this.data.id]);
      }
    })
  }

  onNoClick(): void {
    this.ventana.close();
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
    talonario_serie:string,
    talonario_numero:string,
    estado:number,
    pagina: number,
    total_pagina: number
  ){
  	this.CargandoInformacion.next(true);
	
  	this.Servicio.ListarVentasxCliente(
  		id_cliente,
  		talonario_serie,
  		talonario_numero,
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