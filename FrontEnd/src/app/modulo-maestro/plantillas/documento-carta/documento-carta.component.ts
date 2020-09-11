import { Component, OnInit, ViewChild } from '@angular/core';
import { PlantillasService } from '../plantillas.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { VentanaDocumentosComponent } from '../documentos/ventana-documentos/ventana-documentos.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { VentanaConfirmarComponent } from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { PlantillasDataSource } from '../documentos/documentos.component';

@Component({
  selector: 'app-documento-carta',
  templateUrl: './documento-carta.component.html',
  styleUrls: ['./documento-carta.component.css']
})
export class DocumentoCartaComponent implements OnInit {

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
    this.ListadoPlantillas.CargarInformacion(6,0,"",1,10) ;

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
      6 ,
      this.PlantillasForm.get('relevancia').value ,
      this.PlantillasForm.get('usuario').value ,
      this.paginator.pageIndex + 1 ,
      this.paginator.pageSize
    )
  }

  Agregar() {
    let Ventana = this.Dialogo.open(VentanaDocumentosComponent, {
      width : '900px' ,
      data: { tipo_plantilla: 6 }
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

    let nombre_archivo = "carta_aval.docx" ;
    
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

  Eliminar( plantilla ){
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la plantilla', valor: plantilla.comentario}
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