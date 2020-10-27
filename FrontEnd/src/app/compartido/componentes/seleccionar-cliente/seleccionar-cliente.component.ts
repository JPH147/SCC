import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject} from '@angular/core';
import {ClienteService} from 'src/app/modulo-clientes/clientes/clientes.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, merge, fromEvent} from 'rxjs';
import {catchError, finalize,debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrls: ['./seleccionar-cliente.component.css'],
  providers: [ClienteService]
})

export class SeleccionarClienteComponent implements OnInit, AfterViewInit {

  public id_cliente : number = 0;

  @ViewChild('InputCodigo', { static: true }) FiltroCodigo: ElementRef;
  @ViewChild('InputDNI', { static: true }) FiltroDni: ElementRef;
  @ViewChild('InputNombre', { static: true }) FiltroNombre: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ListadoCliente: ClienteDataSource;
  public Columnas: string[] = ['numero', 'codigo' , 'dni', 'nombrecliente', 'subsede', 'opciones'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<SeleccionarClienteComponent>,
  	private Servicio: ClienteService,
  ) { }

  ngOnInit() {
    this.ListadoCliente = new ClienteDataSource(this.Servicio);
    this.ListadoCliente.CargarClientes('','', '','',1,new Date().getTime());

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
      "",
			this.FiltroDni.nativeElement.value,
			this.FiltroNombre.nativeElement.value,
      this.paginator.pageIndex+1,
      new Date().getTime()
  	)
  }
}

export class ClienteDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);
  private tiempo_consulta = new BehaviorSubject<number>(0)

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
    cip:string,
    dni: string,
    nombre: string,
    prpagina: number,
    tiempo_consulta : number 
  ){
    this.CargandoInformacion.next(true);

    this.tiempo_consulta.next(new Date().getTime()) ;

    this.Servicio.Listado( codigo, cip, dni, nombre,0,0, prpagina, 5,1, tiempo_consulta)
    .pipe(catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    ).subscribe(res => {
      if(res['data']){
        if( res['tiempo'] == this.tiempo_consulta.value ) {
          this.TotalResultados.next(res['mensaje']);
          this.InformacionClientes.next(res['data'].clientes);
        }
        this.InformacionClientes.next(res['data'].clientes);
      }else{
        this.TotalResultados.next(0);
        this.InformacionClientes.next([])
      }
    });
  }

}