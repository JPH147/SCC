import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ProcesoJudicialVinculadosService } from '../proceso-judicial-vinculados.service';
import { VentanaConfirmarComponent } from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaJuezJuzgadoComponent } from './ventana-juez-juzgado/ventana-juez-juzgado.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';

@Component({
  selector: 'app-juez-juzgado',
  templateUrl: './juez-juzgado.component.html',
  styleUrls: ['./juez-juzgado.component.css']
})
export class JuezJuzgadoComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoInstancias: InstanciaDataSource;
  public Columnas: string[] = ["numero" , "juzgado_distrito" , "juzgado_instancia" , "tipo" , "juzgado_juez" , "opciones"];

  @ViewChild('InputDistrito', { static: true }) FiltroDistrito: ElementRef;
  @ViewChild('InputInstancia', { static: true }) FiltroInstancia: ElementRef;
  @ViewChild('InputTipo', { static: true }) FiltroTipo: ElementRef;
  @ViewChild('InputJuez', { static: true }) FiltroJuez: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: ProcesoJudicialVinculadosService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones,
  ) { }

  ngOnInit() {

    this.ListadoInstancias = new InstanciaDataSource(this.Servicio);
    this.ListadoInstancias.CargarInformacion("","","","",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroDistrito.nativeElement, 'keyup') ,
      fromEvent(this.FiltroInstancia.nativeElement, 'keyup') ,
      fromEvent(this.FiltroTipo.nativeElement, 'keyup') ,
      fromEvent(this.FiltroJuez.nativeElement, 'keyup')
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
    this.ListadoInstancias.CargarInformacion(
      this.FiltroDistrito.nativeElement.value,
      this.FiltroInstancia.nativeElement.value,
      this.FiltroTipo.nativeElement.value,
      this.FiltroJuez.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(instancia){
    let Ventana = this.Dialogo.open( VentanaJuezJuzgadoComponent, {
      width: '900px',
      data: instancia
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizó al juez satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar al juez","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaJuezJuzgadoComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó al juez satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear al juez","")
        }
      }
    })
  }

  Eliminar(instancia){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "al juez", valor: instancia.juzgado_juez }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarJuez(instancia.id_juzgado_juez).subscribe(res=>{
          this.CargarData()
        });
      }
    })
  }

}

export class InstanciaDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: ProcesoJudicialVinculadosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    distrito_judicial : string ,
    instancia_judicial : string ,
    tipo : string ,
    juez : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarJuez( 0 , distrito_judicial, instancia_judicial, tipo , juez , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].jueces);
    });
  }

}