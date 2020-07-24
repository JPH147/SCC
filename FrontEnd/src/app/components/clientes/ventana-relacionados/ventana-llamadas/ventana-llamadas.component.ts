import { Component, OnInit, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ClienteService } from '../../clientes.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentanaObservacionesComponent } from '../ventana-observaciones/ventana-observaciones.component';

import { URLLLAMADAS } from '../../../global/url' ;

@Component({
  selector: 'app-ventana-llamadas',
  templateUrl: './ventana-llamadas.component.html',
  styleUrls: ['./ventana-llamadas.component.css']
})
export class VentanaLlamadasComponent implements OnInit {

  public ListadoLlamadas : LlamadasDataSource ;
  public Columnas : Array<string> ;

  private ruta : string = URLLLAMADAS.carpeta ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaObservacionesComponent>,
    private Servicio: ClienteService,) { }

  ngOnInit(): void {
    this.ListadoLlamadas = new LlamadasDataSource(this.Servicio);
    this.ListadoLlamadas.CargarClientes(this.data);

    this.Columnas = ['numero', 'fecha', 'opciones']
  }

  VerArchivo( nombre_archivo ) {
    if(nombre_archivo){
      window.open( this.ruta + nombre_archivo , "_blank");
    }
  }
}

export class LlamadasDataSource implements DataSource<any> {

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
  ){
    this.CargandoInformacion.next(true);

    this.Servicio.ListarLlamadas(id_cliente)
    .pipe(catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      console.log(res)
  		if (res['data']) {
  			this.InformacionClientes.next(res['data']);
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