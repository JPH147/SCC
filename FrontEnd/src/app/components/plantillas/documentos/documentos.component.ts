import { Component, OnInit, ViewChild } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, forkJoin,fromEvent, merge, BehaviorSubject, of} from 'rxjs';
import { PlantillasService } from '../plantillas.service';
import { VentanaPlantillasComponent } from './ventana-plantillas/ventana-plantillas.component';
import {saveAs} from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { Notificaciones } from '../../global/notificacion';
import { VentanaDocumentosComponent } from './ventana-documentos/ventana-documentos.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, tap, finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { VentanaConfirmarComponent } from '../../global/ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ListadoPlantillas : PlantillasDataSource;
  public Columnas : Array<string> ;
  public Documentos : Array<any> ;
  public Listado : Array<any>;
  public ListadoTransaccion : Array<any>;
  public ListadoAutorizacion : Array<any>;
  public ListadoDDJJ : Array<any>;
  public ListadoTarjeta : Array<any>;
  public ListadoCompromiso : Array<any>;
  public ListadoCarta : Array<any>;

  public Tipos : Array<any> = [] ;
  public PlantillasForm : FormGroup ;

  constructor(
    private Servicio : PlantillasService ,
    private Notificacion : Notificaciones ,
    private Dialogo : MatDialog ,
    private _builder : FormBuilder
  ) { }

  ngOnInit() {
    this.ListarTiposPlantilla() ;
    this.CrearFormulario() ;
    
    this.ListadoPlantillas = new PlantillasDataSource(this.Servicio);
    this.ListadoPlantillas.CargarInformacion(0,0,"",1,10) ;

    this.Columnas= ["numero", "tipo_plantilla" ,"fecha" ,"usuario" ,"comentarios" ,"opciones"];
  }

  ngAfterViewInit(){
    this.PlantillasForm.get('usuario').valueChanges
    .pipe(
      distinctUntilChanged() ,
      debounceTime(200) ,
      tap(()=>{
        this.paginator.pageIndex = 0;
        this.CargarInformacion() ;
      })
    ).subscribe() ;
    
    this.paginator.page
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.CargarInformacion();
      })
    ).subscribe();
  }

  CrearFormulario(){
    this.PlantillasForm = this._builder.group({
      tipo : [ { value : 0 , disabled : false } ] ,
      relevancia : [ { value : 0 , disabled : false } ] ,
      usuario : [ { value : "" , disabled : false } ] ,
    })
  }

  Descargar(nombre_archivo){
    this.Servicio.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      saveAs(res, nombre_archivo);
    })
  }

  ListarTiposPlantilla() {
    this.Servicio.ListarTipos().subscribe(res=>{
      this.Tipos = res ;
    })
  }

  CargarInformacion() {
    this.ListadoPlantillas.CargarInformacion(
      this.PlantillasForm.get('tipo').value ,
      this.PlantillasForm.get('relevancia').value ,
      this.PlantillasForm.get('usuario').value ,
      this.paginator.pageIndex + 1 ,
      this.paginator.pageSize
    )
  }

  Agregar() {
    let Ventana = this.Dialogo.open(VentanaDocumentosComponent, {
      width : '900px' ,
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.CargarInformacion() ;
        this.Notificacion.Snack("Se creó el archivo satisfactoriamente","");
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al crear el archivo","");
      }
    })
  }

  EstablecerPlantillaPrimaria(plantilla) {
    this.ListadoPlantillas.CargandoInformacion.next(true) ;

    let nombre_archivo = this.ObtenerNombreArchivo(plantilla.id_tipo_plantilla) ;
    
    this.Servicio.CopiarPlantilla( nombre_archivo, plantilla.archivo )
    .subscribe(res=>{
      if ( res ) {
        this.ListadoPlantillas.CargandoInformacion.next(false) ;
        this.Servicio.ActualizarPlantillaRelevancia(plantilla.id_plantilla, plantilla.id_tipo_plantilla)
        .subscribe(resultado => {
          if ( resultado ) {
            this.Notificacion.Snack("Se actualizó la plantilla satisfactoriamente","") ;
            this.CargarInformacion();
          } else {
            this.Notificacion.Snack("Ocurrió un error al actualizar la plantilla","") ;
          }
        });
      } else {
        this.Notificacion.Snack("Ocurrió un error al actualizar la plantilla","") ;
        this.ListadoPlantillas.CargandoInformacion.next(false) ;
      }
    })

  }

  ObtenerNombreArchivo( tipo_plantilla ) : string {
    if (tipo_plantilla==1) return "transaccion_X.docx" ;
    if (tipo_plantilla==2) return "autorizacion_X.docx" ;
    if (tipo_plantilla==3) return "ddjj_X.docx" ;
    if (tipo_plantilla==4) return "tarjeta_X.docx" ;
    if (tipo_plantilla==5) return "compromiso_X.docx" ;
    if (tipo_plantilla==6) return "carta_aval.docx" ;
  }

  Eliminar( plantilla ){
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el plantilla', valor: plantilla.comentario}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarPlantilla(plantilla.id_plantilla).subscribe(res => {
          this.CargarInformacion();
        });
      }
    });
  }

}

export class PlantillasDataSource implements DataSource<any>{

  private InformacionPlantillas = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private _plantillas : PlantillasService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionPlantillas.asObservable();
  }

  disconnect() {
    this.InformacionPlantillas.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    tipo : number ,
    relevancia : number ,
    usuario : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ){
    this.CargandoInformacion.next(true) ;
    this._plantillas.ListarPlantillas(
      tipo ,
      relevancia ,
      usuario ,
      numero_pagina ,
      total_pagina ,
    )
    .pipe(
      finalize(()=>{
        this.CargandoInformacion.next(false) ;
      })
    )
    .subscribe( res=> {
      if ( res ) {
        this.InformacionPlantillas.next( res['data'].plantillas ) ;
        this.TotalResultados.next( res['mensaje'] ) ;
      } else {
        this.InformacionPlantillas.next( [] ) ;
        this.TotalResultados.next( 0 ) ;
      }
    })
  }

}