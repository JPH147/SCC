import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SeguimientosService } from './seguimientos.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { VentanaSeguimientosComponent } from './ventana-seguimientos/ventana-seguimientos.component';
import { VentanaEntregaSeguimientosComponent } from './ventana-entrega-seguimientos/ventana-entrega-seguimientos.component';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { Notificaciones } from '../global/notificacion';

@Component({
  selector: 'app-seguimientos',
  templateUrl: './seguimientos.component.html',
  styleUrls: ['./seguimientos.component.css']
})

export class SeguimientosComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;

  public ListadoSeguimientos: SeguimientosDataSource;
  public Columnas: string[] = ['numero', 'fecha', 'documento', 'cliente', 'courier', 'numero_seguimiento', 'estado', 'opciones'];

  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputNumero', { static: true }) FiltroNumero: ElementRef;
  @ViewChild('InputCourier', { static: true }) FiltroCourier: ElementRef;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Dialogo : MatDialog ,
    private Notificacion : Notificaciones ,
    private Servicio : SeguimientosService
  ) { }

  ngOnInit() {

    this.fecha_inicio = null ;
    this.fecha_fin = null ;

    this.ListadoSeguimientos = new SeguimientosDataSource(this.Servicio);
    this.ListadoSeguimientos.CargarSeguimientos("","","",0,this.fecha_inicio,this.fecha_fin,1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup'),
      fromEvent(this.FiltroNumero.nativeElement, 'keyup'),
      fromEvent(this.FiltroCourier.nativeElement, 'keyup')
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.paginator.pageIndex = 0;
         this.CargarData();
       })
    ).subscribe();
  }

  CargarData() {
    this.ListadoSeguimientos.CargarSeguimientos(
      this.FiltroCliente.nativeElement.value,
      this.FiltroNumero.nativeElement.value,
      this.FiltroCourier.nativeElement.value,
      this.FiltroEstado.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  AbrirVentana(url){
    window.open(url, "_blank")
  }

  VerSeguimiento(id_seguimiento){
    let Ventana = this.Dialogo.open( VentanaSeguimientosComponent ,{
      data : { ver: true , id : id_seguimiento },
      width : '900px'
    } )

    Ventana.afterClosed().subscribe(res=>{
    })
  }

  EditarSeguimiento(id_seguimiento){
    let Ventana = this.Dialogo.open( VentanaSeguimientosComponent ,{
      data : { editar: true , id : id_seguimiento },
      width : '900px'
    } )

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.CargarData();
        this.Notificacion.Snack("Se actualizó el seguimiento satisfactoriamente","");
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al actualizar el seguimiento","");
      }
    })
  }

  EliminarSeguimiento(seguimiento){
    let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el seguimiento', valor: seguimiento.numero_seguimiento}
    });
    
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.Eliminar(seguimiento.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

  RegistrarEntrega(id_seguimiento){
    let Ventana = this.Dialogo.open( VentanaEntregaSeguimientosComponent ,{
      data : id_seguimiento,
      width : '900px'
    } )

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.CargarData();
        this.Notificacion.Snack("Se registró la recepción satisfactoriamente","");
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al registrar la recepción","");
      }
    })
  }

}

export class SeguimientosDataSource implements DataSource<any> {

  private InformacionSeguimientos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: SeguimientosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionSeguimientos.asObservable();
  }

  disconnect() {
    this.InformacionSeguimientos.complete();
    this.CargandoInformacion.complete();
  }

  CargarSeguimientos(
    cliente : string ,
    numero_seguimiento : string ,
    courier : string ,
    estado : number ,
    fecha_inicio : Date ,
    fecha_fin : Date ,
    pagina_inicio : number ,
    pagina_final : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.Listar( cliente , numero_seguimiento , courier , estado , fecha_inicio , fecha_fin , pagina_inicio , pagina_final )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionSeguimientos.next(res['data'].seguimientos);
    });
  }

}
