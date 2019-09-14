import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSelect, MatPaginator, MatSort, MatDialog } from '@angular/material'
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { InstitucionesService } from '../instituciones.service';
import { VentanaConfirmarComponent } from '../../global/ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-subsede',
  templateUrl: './subsede.component.html',
  styleUrls: ['./subsede.component.css']
})
export class SubsedeComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoSubsedes: SubsedeDataSource;
  public Columnas: string[] = ["numero" , "institucion" , "sede" , "nombre" , "opciones"];

  @ViewChild('InputInstitucion') FiltroInstitucion: ElementRef;
  @ViewChild('InputSede') FiltroSede: ElementRef;
  @ViewChild('InputSubsede') FiltroSubsede: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private Servicio: InstitucionesService,
    private Dialogo : MatDialog
  ) { }

  ngOnInit() {

    this.ListadoSubsedes = new SubsedeDataSource(this.Servicio);
    this.ListadoSubsedes.CargarInformacion("","","",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroInstitucion.nativeElement, 'keyup'),
      fromEvent(this.FiltroSede.nativeElement, 'keyup')
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
    this.ListadoSubsedes.CargarInformacion(
      this.FiltroInstitucion.nativeElement.value,
      this.FiltroSede.nativeElement.value,
      this.FiltroSubsede.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  // EliminarCobranza(cobranza){
   
  //   let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
  //     data: { objeto: "la cobranza", valor: cobranza.numero_operacion+" en el banco "+cobranza.banco }
  //   })

  //   Ventana.afterClosed().subscribe(res=>{
  //     if (res) {
  //       this.Servicio.EliminarCobranzaDirecta(cobranza.id).subscribe(res=>{
  //         // console.log(res);
  //         this.CargarData();
  //       });
  //     }
  //   })

  // }
 
}

export class SubsedeDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: InstitucionesService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    institucion : string ,
    sede : string ,
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarSubsede( institucion , sede , nombre , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].subsede);
    });
  }

}