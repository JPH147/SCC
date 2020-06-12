import { Component, OnInit, Inject } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-editar-cuotas',
  templateUrl: './ventana-editar-cuotas.component.html',
  styleUrls: ['./ventana-editar-cuotas.component.css']
})
export class VentanaEditarCuotasComponent implements OnInit {

  public ListadoCobranza: CobranzaPNPDataSource;
  public Columnas: string[] = ['tipo', 'codigo', 'fecha', 'monto', 'opciones'];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaEditarCuotasComponent> ,
  ) { }

  ngOnInit(): void {
    this.ListadoCobranza = new CobranzaPNPDataSource() ;
    this.ListadoCobranza.AsignarCuotas(this.data.cuotas) ;
  }

  Guardar() {
    this.ventana.close( this.ListadoCobranza.InformacionCobranzas.value ) ;
  }

}

export class CobranzaPNPDataSource implements DataSource<any> {

  public InformacionCobranzas = new BehaviorSubject<any[]>([]);

  constructor(
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCobranzas.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.InformacionCobranzas.complete()
  }

  AsignarCuotas(  
    cuotas : Array<any>
  ) {
    this.InformacionCobranzas.next(cuotas);
  }
}