import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators'
import { ClienteService } from '../../clientes.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {VentanaConfirmarComponent} from '../../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { URLIMAGENES } from 'src/app/core/servicios/url';

@Component({
  selector: 'app-ventana-observaciones',
  templateUrl: './ventana-observaciones.component.html',
  styleUrls: ['./ventana-observaciones.component.css'],
  providers: [ClienteService]
})

export class VentanaObservacionesComponent implements OnInit {

	public observacion: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public ListadoObservaciones: ObservacionesDataSource;
  public Columnas: string[] = [ 'numero', 'observacion', 'fecha', 'opciones'];
  public ObservacionesForm : FormGroup ;
  public archivo : File ;
  public archivo_nombre : string ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaObservacionesComponent>,
    private Servicio: ClienteService,
    private Dialogo: MatDialog,
    private Builder : FormBuilder,
    private ServiciosGenerales : ServiciosGenerales
  ) { }

  ngOnInit() {
    this.ListadoObservaciones = new ObservacionesDataSource(this.Servicio);
    this.ListadoObservaciones.CargarClientes(this.data.id_cliente,1, 5);

    this.CrearFormulario();
  }

  ngAfterViewInit(){
    this.paginator.page
    .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();
  }

  CrearFormulario(){
    this.ObservacionesForm = this.Builder.group({
      observacion: [ "",[
        Validators.required
      ] ],
      fecha: [ new Date(), [
        Validators.required
      ]]
    })
  }

  SubirArchivo(archivo: FileList) {
    this.archivo = archivo.item(0);
    this.archivo_nombre = this.archivo.name ;
    // this.VentanaJudicialForm.get('archivo').setValue(true);
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = null ;
    // this.VentanaJudicialForm.get('archivo').setValue(null);
  }

  CargarData(){
  	this.ListadoObservaciones.CargarClientes(this.data.id_cliente, this.paginator.pageIndex+1, this.paginator.pageSize)
  }

  Eliminar(id){
  	let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
  	  width: '400px',
  	  data: {objeto: 'la observacion', valor: ""}
  	});

	  VentanaConfirmar.afterClosed().subscribe(res => {
	    if (res === true) {
		  	this.Servicio.EliminarObservacion(id).subscribe(res=>{
		  		this.CargarData();
		  	})
	    }
	  });

  }

  Guardar(){
    let random = (new Date()).getTime();
    this.ServiciosGenerales.SubirArchivo(this.archivo)
    .subscribe(archivo=>{
      this.ServiciosGenerales.RenameFile(archivo['data'], "observacion", "_"+random, "observacion" )
      .subscribe(path_archivo=>{
        this.Servicio.CrearObservacion(
          this.data.id_cliente,
          this.ObservacionesForm.value.fecha,
          this.ObservacionesForm.value.observacion,
          path_archivo.mensaje
        ).subscribe(res=>{
          this.ventana.close(res) ;
        })
      })
    })
  }

  onNoClick(): void {
    this.ventana.close();
  }

  VerArchivo(url){
    if(url){
      window.open(url, "_blank");
    }
  }
}

export class ObservacionesDataSource implements DataSource<any> {

  private InformacionClientes = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: ClienteService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionClientes.asObservable();
  }

  disconnect(){
    this.InformacionClientes.complete();
    this.CargandoInformacion.complete();
  }

  CargarClientes(
    id_cliente: number,
    pagina: number,
    total_pagina: number
  ){
  this.CargandoInformacion.next(true);

  this.Servicio.ListarObservacion(id_cliente, pagina , total_pagina)
  .pipe(catchError(() => of([])),
  finalize(() => this.CargandoInformacion.next(false))
  )
  .subscribe(res => {
  		if (res['data']) {
        res['data'].observaciones.map(item=>{
          item.archivo = item.archivo ? URLIMAGENES.carpeta + 'observacion/' + item.archivo : "" ;
        })
  			this.InformacionClientes.next(res['data'].observaciones);
  		}else{
  			this.InformacionClientes.next([])
  		}
  		if (res['mensaje']>0) {
  			this.TotalResultados.next(res['mensaje']);
  		}else{
  			this.TotalResultados.next(0)
  		}
    });
  }
}