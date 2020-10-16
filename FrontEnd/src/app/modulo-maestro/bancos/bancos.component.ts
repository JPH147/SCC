import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BancosService } from './bancos.service';
import { VentanaConfirmarComponent } from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { VentanaBancosComponent } from './ventana-bancos/ventana-bancos.component';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent implements OnInit, AfterViewInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoBancos: BancoDataSource;
  public Columnas: string[] = ["numero" , "nombre" , "opciones"];

  @ViewChild('InputNombre', { static: true }) FiltroNombre: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: BancosService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones,
  ) { }

  ngOnInit() {

    this.ListadoBancos = new BancoDataSource(this.Servicio);
    this.ListadoBancos.CargarInformacion("",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    fromEvent(this.FiltroNombre.nativeElement, 'keyup')
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
    this.ListadoBancos.CargarInformacion(
      this.FiltroNombre.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(banco){
    let Ventana = this.Dialogo.open( VentanaBancosComponent, {
      width: '900px',
      data: banco
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res){
          this._notificacion.Snack("Se actualizó el banco satisfactoriamente","");
          this.CargarData();
        }
        if(res===false){
          this._notificacion.Snack("Ocurrió un error al actualizar el banco","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaBancosComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res){
          this._notificacion.Snack("Se creó el banco satisfactoriamente","");
          this.CargarData();
        }
        if(res===false){
          this._notificacion.Snack("Ocurrió un error al crear el banco","")
        }
      }
    })
  }

  Eliminar(banco) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el banco', valor: banco.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarBanco(banco.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

}

export class BancoDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: BancosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarBancos( nombre , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if (res) {
        this.TotalResultados.next(res['mensaje']);
        this.Informacion.next(res['data'].bancos);
      } else{
        this.TotalResultados.next(0);
        this.Informacion.next([]);
      }
    });
  }

}
