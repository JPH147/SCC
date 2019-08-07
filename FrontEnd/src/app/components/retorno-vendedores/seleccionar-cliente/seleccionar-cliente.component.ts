import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject} from '@angular/core';
import {ClienteService} from '../../clientes/clientes.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, merge, fromEvent} from 'rxjs';
import {catchError, finalize,debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrls: ['./seleccionar-cliente.component.css'],
  providers: [ClienteService]
})

export class SeleccionarClienteComponent implements OnInit, AfterViewInit {

  public id_cliente : number = 0;

  @ViewChild('InputCodigo') FiltroCodigo: ElementRef;
  @ViewChild('InputDNI') FiltroDni: ElementRef;
  @ViewChild('InputNombre') FiltroNombre: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public ListadoCliente: ClienteDataSource;
  public Columnas: string[] = ['numero', 'codigo' , 'dni', 'nombrecliente', 'subsede', 'opciones'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<SeleccionarClienteComponent>,
  	private Servicio: ClienteService,
  ) { }

  ngOnInit() {
    this.ListadoCliente = new ClienteDataSource(this.Servicio);
    this.ListadoCliente.CargarClientes('', '','',1);

    if(this.data) {
      this.id_cliente = this.data.cliente
    }
  }

  ngAfterViewInit() {
    merge(
      fromEvent(this.FiltroDni.nativeElement, 'keyup'),
      fromEvent(this.FiltroNombre.nativeElement, 'keyup'),
      fromEvent(this.FiltroCodigo.nativeElement, 'keyup'),
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex=0;
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
  	this.ListadoCliente.CargarClientes(
			this.FiltroCodigo.nativeElement.value,
			this.FiltroDni.nativeElement.value,
			this.FiltroNombre.nativeElement.value,
    	this.paginator.pageIndex+1
  	)
  }
}

export class ClienteDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: ClienteService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
    this.InformacionClientes.complete();
    this.CargandoInformacion.complete();
  }

  CargarClientes(
    codigo:string,
    dni: string,
    nombre: string,
    prpagina: number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.Listado( codigo, dni, nombre, prpagina, 5,1)
  .pipe(catchError(() => of([])),
  	finalize(() => this.CargandoInformacion.next(false))
  ).subscribe(res => {
      // console.log(res);
      this.TotalResultados.next(res['mensaje']);
      if(res['data']){
        this.InformacionClientes.next(res['data'].clientes);
      }else{
        this.InformacionClientes.next([])
      }
    });
  }

}