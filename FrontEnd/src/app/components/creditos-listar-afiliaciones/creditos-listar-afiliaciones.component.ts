import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CreditosService } from '../creditos/creditos.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { CreditosDataSource } from '../creditos-listar/creditos-listar.component';
import { EstadoSesion } from '../usuarios/usuarios.reducer';
import { Store } from '@ngrx/store';
import { Rol } from '../usuarios/usuarios.service';

@Component({
  selector: 'app-creditos-listar-afiliaciones',
  templateUrl: './creditos-listar-afiliaciones.component.html',
  styleUrls: ['./creditos-listar-afiliaciones.component.css'],
  providers : [CreditosService]
})

export class CreditosListarAfiliacionesComponent implements OnInit {
  
  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputDNI', { static: true }) FiltroDNI: ElementRef;
  @ViewChild('InputDocumentos', { static: true }) FiltroDocumentos: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public ListadoCreditos: CreditosDataSource;
  public Columnas: string[] = ['numero', 'fecha', 'codigo', 'cliente_nombre', 'monto_total', 'documentos_adjuntos', 'opciones'];

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Tipos : Array<any>;
  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Servicio: CreditosService
  ) { }

  ngOnInit() {

    this.fecha_inicio = null ;
    this.fecha_fin = null ;

    this.ListadoCreditos = new CreditosDataSource(this.Servicio);
    this.ListadoCreditos.CargarCreditos("","",1,0,this.fecha_inicio,this.fecha_fin,1,1,10,"fecha desc");
  }

  ngAfterViewInit () {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });

    merge(
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup') ,
      fromEvent(this.FiltroDNI.nativeElement, 'keyup') ,
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

  ListarTiposCredito(){
    this.Servicio.ListarTipos().subscribe(res=>{
      this.Tipos=res;
    })
  }

  CargarData() {
    this.ListadoCreditos.CargarCreditos(
      this.FiltroCliente.nativeElement.value,
      this.FiltroDNI.nativeElement.value,
      1,
      this.FiltroDocumentos.value,
      this.fecha_inicio,
      this.fecha_fin,
      1,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

}