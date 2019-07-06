import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, merge, fromEvent} from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ComisionesService} from './comisiones.service';
import {MatPaginator, MatSelect,MatDialog} from '@angular/material';
import {ComisionesDetalleComponent} from './comisiones-detalle/comisiones-detalle.component';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.css']
})
export class ComisionesComponent implements OnInit {

	public fecha_inicio: Date = new Date((new Date).valueOf() - 1000*60*60*24*120)
	public fecha_fin: Date = new Date()

  @ViewChild('InputVendedor') FiltroVendedor: ElementRef;
	@ViewChild('InputPecosa') FiltroPecosa: ElementRef;

	@ViewChild(MatPaginator) paginator: MatPaginator;

  ListadoComisiones: ComisionesDataSource;
  Columnas: string[] = ['numero', 'pecosa','nombre_vendedor', 'comision_efectiva' , 'comision_retenida', 'opciones'];
  
  constructor(
  	private Servicio: ComisionesService,
    private Dialogo: MatDialog
  ) { }

  ngOnInit() {
   	this.ListadoComisiones = new ComisionesDataSource(this.Servicio);
  	this.ListadoComisiones.CargarComisiones( 1, 1, '', this.fecha_inicio, this.fecha_fin, '',1, 10);
  }

  ngAfterViewInit(){
    
  	merge(
      fromEvent(this.FiltroVendedor.nativeElement,'keyup'),
			fromEvent(this.FiltroPecosa.nativeElement,'keyup')
  	).pipe(
  		debounceTime(200),
  		distinctUntilChanged(),
  		tap(()=>{
  			this.CargarInformacion()
  		})
  	).subscribe()

  	this.paginator.page.subscribe(res=>{
  		this.CargarInformacion()
  	})
  }

  VerDetalle(id_vendedor, nombre_vendedor){
    let VentanaDetalle = this.Dialogo.open(ComisionesDetalleComponent,{
      data: {id: id_vendedor, nombre: nombre_vendedor},
      width: '1200px'
    })
  }

  CargarInformacion(){
  	this.ListadoComisiones.CargarComisiones(
      1,1,
			this.FiltroVendedor.nativeElement.value,
			this.fecha_inicio,
			this.fecha_fin,
			this.FiltroPecosa.nativeElement.value,
			this.paginator.pageIndex+1,
			this.paginator.pageSize,
  	)
  }

}

export class ComisionesDataSource implements DataSource<any> {

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
    estado_comision_efectiva: number,
    estado_comision_retenida: number,
    vendedor: string,
    fecha_inicio:Date,
    fecha_fin:Date,
    pecosa: string,
    pagina: number,
    totalpagina: number
  ){
    this.CargandoInformacion.next(true);

    this.Servicio.ComisionesListado(estado_comision_efectiva, estado_comision_retenida , vendedor, fecha_inicio, fecha_fin, pecosa, pagina, totalpagina)
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
  		// console.log(res)
      this.TotalResultados.next(res['mensaje']);
      this.InformacionClientes.next(res['data'].vendedores);
    });
  }

}
