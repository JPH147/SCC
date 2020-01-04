import { Component, OnInit } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, forkJoin,fromEvent, merge, BehaviorSubject, of} from 'rxjs';
import { PlantillasService } from './plantillas.service';
import { VentanaPlantillasComponent } from './ventana-plantillas/ventana-plantillas.component';
import {saveAs} from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { Notificaciones } from '../global/notificacion';

@Component({
  selector: 'app-plantillas',
  templateUrl: './plantillas.component.html',
  styleUrls: ['./plantillas.component.css']
})

export class PlantillasComponent implements OnInit {

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

  constructor(
    private Servicio : PlantillasService ,
    private Notificacion : Notificaciones ,
    private Dialogo : MatDialog
  ) { }

  ngOnInit() {
    this.ListadoPlantillas = new PlantillasDataSource();
    this.Columnas= ["numero", "planilla", "referente", "opciones"];
    this.CrearDocumentos();
    this.CrearDocumentosPlantillas();
    this.CrearListado();
  }

  CrearListado(){
    this.Listado = this.ListadoTransaccion;
    this.ListadoPlantillas.CargarInformacion(this.Listado);
  }

  Descargar(nombre_archivo){
    this.Servicio.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      saveAs(res, nombre_archivo);
    })
  }

  Subir(plantilla){
    let Ventana = this.Dialogo.open(VentanaPlantillasComponent, {
      width: '900px',
      data: plantilla
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res) {
        this.Notificacion.Snack("Se actualizó el archivo satisfactoriamente","");
      }
      if(res===false) {
        this.Notificacion.Snack("Ocurrió un error al actualizar el archivo","");
      }
    })
  }

  CrearDocumentos(){
    this.Documentos = [
      {id:1, nombre: "Transacción"},
      {id:2, nombre: "Autorización"},
      {id:3, nombre: "Declaración jurada"},
      {id:4, nombre: "Tarjeta de socio"},
      {id:5, nombre: "Compromiso de pago"},
      {id:6, nombre: "Carta del aval"},
    ]
  }

  CrearDocumentosPlantillas(){
    this.ListadoTransaccion = [
      {numero: 1, nombre: "transaccion_X.docx", referente: "Todos"},
      // {numero: 1, nombre: "transaccion_1.docx", referente: "Policía Nacional del Perú"},
      // {numero: 2, nombre: "transaccion_2.docx", referente: "Caja Pensión"},
      // {numero: 3, nombre: "transaccion_3.docx", referente: "Ejército"},
      // {numero: 4, nombre: "transaccion_4.docx", referente: "Ministerio de educación"},
      // {numero: 5, nombre: "transaccion_5.docx", referente: "Ministerio de salud"},
      // {numero: 6, nombre: "transaccion_6.docx", referente: "Otros"}
    ];
    this.ListadoAutorizacion = [
      {numero: 1, nombre: "autorizacion_X.docx", referente: "Todos"},
      // {numero: 2, nombre: "autorizacion_2.docx", referente: "Caja Pensión"},
      // {numero: 3, nombre: "autorizacion_3.docx", referente: "Ejército"},
      // {numero: 4, nombre: "autorizacion_4.docx", referente: "Ministerio de educación"},
      // {numero: 5, nombre: "autorizacion_5.docx", referente: "Ministerio de salud"},
      // {numero: 6, nombre: "autorizacion_6.docx", referente: "Otros"}
    ];
    this.ListadoDDJJ = [
      {numero: 1, nombre: "ddjj_X.docx", referente: "Todos"}
    ];
    this.ListadoTarjeta = [
      {numero: 1, nombre: "tarjeta_X.docx", referente: "Todos"},
      // {numero: 1, nombre: "tarjeta_1.docx", referente: "PNP, Caja Pensión y Ejército"},
      // {numero: 2, nombre: "tarjeta_2.docx", referente: "MINEDU, MINSA y otros"},
    ];
    this.ListadoCompromiso = [
      {numero: 1, nombre: "compromiso_X.docx", referente: "Todos"},
      // {numero: 1, nombre: "compromiso_1.docx", referente: "PNP, Caja Pensión y Ejército"},
      // {numero: 2, nombre: "compromiso_2.docx", referente: "MINEDU, MINSA y otros"},
    ];
    this.ListadoCarta = [
      {numero: 1, nombre: "carta_aval.docx", referente: "Avales"}
    ];
  }

  CambioDocumento(evento){
    if (evento.value==1) this.Listado = this.ListadoTransaccion;
    if (evento.value==2) this.Listado = this.ListadoAutorizacion;
    if (evento.value==3) this.Listado = this.ListadoDDJJ;
    if (evento.value==4) this.Listado = this.ListadoTarjeta;
    if (evento.value==5) this.Listado = this.ListadoCompromiso;
    if (evento.value==6) this.Listado = this.ListadoCarta;
    this.ListadoPlantillas.CargarInformacion(this.Listado);
  }

}

export class PlantillasDataSource implements DataSource<any>{

  private InformacionPlantillas = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionPlantillas.asObservable();
  }

  disconnect() {
    this.InformacionPlantillas.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(listado){
    this.InformacionPlantillas.next(listado);
  }

}