import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError , finalize , debounceTime , distinctUntilChanged , tap } from 'rxjs/operators'
import { CobranzasService } from '../cobranzas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventana-pagos',
  templateUrl: './ventana-pagos.component.html',
  styleUrls: ['./ventana-pagos.component.css']
})
export class VentanaPagosComponent implements OnInit {

	public observacion: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public ListadoPagos: PagosDataSource;
  public Columnas: string[] = [ 'numero' , 'fecha_pago' , 'tipo' , 'documento' , 'monto' , 'opciones' ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaPagosComponent>,
    private router : Router ,
    private Servicio: CobranzasService
  ) { }

  ngOnInit() {
   this.ListadoPagos = new PagosDataSource(this.Servicio);
   this.ListadoPagos.CargarPagos( this.data.tipo , this.data.cuota , 1 , 5 );
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
  	this.ListadoPagos.CargarPagos( this.data.tipo , this.data.cuota , this.paginator.pageIndex+1 , this.paginator.pageSize )
  }

  onNoClick(): void {
    this.ventana.close();
  }

  Ver(cuota){
    console.log(cuota);
    if( cuota.id_cobranza_directa > 0 ) {
      this.router.navigate(['cobranza-directa','ver',cuota.id_cobranza_directa]);
      this.ventana.close();
    }
  }

}

export class PagosDataSource implements DataSource<any> {

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

  CargarPagos(
    tipo : number , 
    id_cuota: number ,
    pagina: number ,
    total_pagina: number
  ){
    this.CargandoInformacion.next(true);

    this.Servicio.ListarPagosxCuota(tipo, id_cuota, pagina , total_pagina)
    .pipe( catchError(() => of([]) ),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.InformacionClientes.next(res['data'].pagos);
  		this.TotalResultados.next(res['mensaje']);
  	});
  }

}