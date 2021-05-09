import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CreditosService } from '../../creditos/creditos.service';

@Component({
  selector: 'app-ventana-desafiliar',
  templateUrl: './ventana-desafiliar.component.html',
  styleUrls: ['./ventana-desafiliar.component.css']
})
export class VentanaDesafiliarComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : informacion_ventana_desafiliar ,
    private ventana : MatDialogRef<VentanaDesafiliarComponent> ,
    private _creditos : CreditosService ,
  ) { }

  ngOnInit(): void {
  }

  ConfirmarAfiliacion() {
    this.Cargando.next(true) ;

    this._creditos.ActualizarEstadoCredito(
      this.data.id_credito ,
      this.data.tipo === 'desafiliar' ? 2 : 1 ,
    ).subscribe(resultado => {
      this.ventana.close(resultado) ;
    })
  }
}

export type informacion_ventana_desafiliar = {
  tipo : 'desafiliar' | 'reafiliar' ,
  id_credito : number ,
}