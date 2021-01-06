import {Component, OnInit, ViewChild, ElementRef, Optional, Inject} from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, finalize, tap} from 'rxjs/operators';
import {ServiciosDirecciones} from 'src/app/core/servicios/direcciones';
import { MatDialog, MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_FACTORY } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {VentanaConfirmarComponent} from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component'
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { CentrosTrabajoService } from '../centros-trabajo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VentanaCentroTrabajoPnpComponent } from './ventana-centro-trabajo-pnp/ventana-centro-trabajo-pnp.component';

@Component({
  selector: 'app-centro-trabajo-pnp',
  templateUrl: './centro-trabajo-pnp.component.html',
  styleUrls: ['./centro-trabajo-pnp.component.css']
})
export class CentroTrabajoPnpComponent implements OnInit {

  public CentroTrabajoForm : FormGroup ;

  ListadoCentrosTrabajo: CentrosTrabajoDataSource;
  Columnas: string[] ;

  @ViewChild('InputDepartamento', { static: true }) FiltroDepartamento: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data : boolean , 
    private _centrosTrabajo: CentrosTrabajoService ,
    private _builder : FormBuilder ,
    public _dialogo: MatDialog
  ) {}

  ngOnInit() {
    if ( !this.data ) {
      this.Columnas = ['numero', 'comisaria', 'division', 'direccion', 'telefono', 'opciones']
    } else {
      this.Columnas = ['numero', 'comisaria', 'division', 'opciones2']
    }

   this.ListadoCentrosTrabajo = new CentrosTrabajoDataSource(this._centrosTrabajo);
   this.CrearFormulario() ;
   this.CargarData() ;
  }

  ngAfterViewInit () {
   this.paginator.page
    .pipe(
      tap(()=>this.CargarData())
     ).subscribe();

    merge(
      this.CentroTrabajoForm.get('departamento').valueChanges ,
      this.CentroTrabajoForm.get('provincia').valueChanges ,
      this.CentroTrabajoForm.get('distrito').valueChanges ,
      this.CentroTrabajoForm.get('comisaria').valueChanges ,
      this.CentroTrabajoForm.get('division').valueChanges ,
      this.CentroTrabajoForm.get('telefono').valueChanges ,
      this.CentroTrabajoForm.get('direccion').valueChanges ,
    )
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.paginator.pageIndex=0;
       this.CargarData();
     })
    ).subscribe();
  }

  CrearFormulario() {
    this.CentroTrabajoForm = this._builder.group({
      departamento : '' ,
      provincia : '' ,
      distrito : '' ,
      comisaria : '' ,
      division : '' ,
      telefono : '' ,
      direccion : '' ,
    })
  }

  CargarData() {
    this.ListadoCentrosTrabajo.CargarInformacion(
      this.CentroTrabajoForm.get('departamento').value ,
      this.CentroTrabajoForm.get('provincia').value ,
      this.CentroTrabajoForm.get('distrito').value ,
      this.CentroTrabajoForm.get('comisaria').value ,
      this.CentroTrabajoForm.get('division').value ,
      this.CentroTrabajoForm.get('telefono').value ,
      this.CentroTrabajoForm.get('direccion').value ,
      this.paginator?.pageIndex+1 || 1,
      this.paginator?.pageSize || 10,
    );
  }


  Agregar() {
    let Ventana = this._dialogo.open(VentanaCentroTrabajoPnpComponent, {
      width: '1200px'
    });

    Ventana.afterClosed().subscribe(res => {
      this.CargarData();
    });
  }

  Eliminar(centro_trabajo) {
    let Ventana = this._dialogo.open(VentanaConfirmarComponent,{
      width: '400px',
      data: {objeto: 'el centro de trabajo', valor: centro_trabajo.comisaria}
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res==true){
        this._centrosTrabajo.EliminarCentroTrabajo(centro_trabajo.id).subscribe(res=>{
          this.CargarData();
        })
      }
    })
  }

  Editar(centro_trabajo) {
    let Ventana = this._dialogo.open(VentanaCentroTrabajoPnpComponent, {
      width: '1200px',
      data: centro_trabajo
    });
    
    Ventana.afterClosed().subscribe (res => {
      this.CargarData();
    });
  };
}

export class CentrosTrabajoDataSource implements DataSource<any> {

  private InformacionDepartamentos = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados= new BehaviorSubject<number>(0);;

constructor(
  private _centrosTrabajo: CentrosTrabajoService
) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionDepartamentos.asObservable();
  }

  disconnect(){
  this.InformacionDepartamentos.complete();
  this.CargandoInformacion.complete();
  }

  CargarInformacion(
    departamento : string ,
    provincia : string ,
    distrito : string ,
    comisaria : string ,
    division : string ,
    telefono : string ,
    direccion : string ,
    pagina : number ,
    total_pagina : number ,
  ){
  this.CargandoInformacion.next(true);

  this._centrosTrabajo.ListarCentroTrabajo(
    departamento ,
    provincia ,
    distrito ,
    comisaria ,
    division ,
    telefono ,
    direccion ,
    pagina ,
    total_pagina ,
  )
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
    if(res){
      this.TotalResultados.next(res['mensaje']);
      this.InformacionDepartamentos.next(res['data'].centro_trabajo);
    } else {
      this.TotalResultados.next(0);
      this.InformacionDepartamentos.next([]);
    }
  });
  }

}