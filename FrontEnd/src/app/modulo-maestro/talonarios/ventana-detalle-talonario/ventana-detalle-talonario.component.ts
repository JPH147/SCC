import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { URL, URLIMAGENES } from 'src/app/core/servicios/url';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { VentanaAdjuntoComponent } from '../ventana-adjunto/ventana-adjunto.component';

@Component({
  selector: 'app-ventana-detalle-talonario',
  templateUrl: './ventana-detalle-talonario.component.html',
  styleUrls: ['./ventana-detalle-talonario.component.css']
})
export class VentanaDetalleTalonarioComponent implements OnInit {

  public ListadoTalonarios : TalonariosDataSource ;
  public Columnas : Array <string> = [ "numero" , "talonario" , "estado" , "detalle" , "opciones" ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : any ,
    private ventana : MatDialogRef<VentanaDetalleTalonarioComponent> ,
    private _router : Router ,
    private _servicio: ServiciosVentas ,
    private _dialogo : MatDialog ,
    private _notificacion : Notificaciones
  ) { }

  ngOnInit(): void {
    this.ListadoTalonarios = new TalonariosDataSource(this._servicio) ;
    this.CargarData() ;
  }

  onNoClick() {
    this.ventana.close() ;
  }

  CargarData(){
    this.ListadoTalonarios.CargarInformacion(this.data) ;
  }

  Descargar(archivo : string) {
    console.log(URL.url, URLIMAGENES.carpeta, archivo) ;
    let path : string = URLIMAGENES.carpeta + "venta/" + archivo ;
    window.open(path, "_blank");
  }

  Ver(talonario) {
    if ( talonario.tipo_venta == 1 ) {
      this.ventana.close() ;
      this._router.navigate(['/ventas','ventas', talonario.id_venta]) ;
    }
    if ( talonario.tipo_venta == 2 ) {
      this.ventana.close() ;
      this._router.navigate(['/ventas','ventas', 'salida', talonario.id_venta]) ;
    }
  }

  SubirAdjunto(talonario) {
    let Ventana = this._dialogo.open(VentanaAdjuntoComponent,{
      width: '900px' ,
      data : talonario.id_talonario ,
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData() ;
        this._notificacion.Snack("Se adjuntó el archivo satisfactoriamente","")
      }
      if(res === false){
        this._notificacion.Snack("Ocurrió un error al adjuntar el archivo","")
      }
    })
  }
}

export class TalonariosDataSource implements DataSource<any>{

  public Informacion = new BehaviorSubject<any>([])
  public TotalResultados = new BehaviorSubject<any>([])
  public Cargando = new BehaviorSubject <boolean> (false)

  constructor(
    private Servicio: ServiciosVentas
  ){ }

  connect(collectionViewer: CollectionViewer) {
    return this.Informacion.asObservable()
  }

  disconnect() {
    this.Informacion.complete()
  }

  CargarInformacion(
    serie : string
  ){
    this.Cargando.next(true);
    this.Servicio.ListarTalonariosDetalle(serie)
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      console.log(res) ;
      this.Informacion.next(res) ;
    })
  }
}