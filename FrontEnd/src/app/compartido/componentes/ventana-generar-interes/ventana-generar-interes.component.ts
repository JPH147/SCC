import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CreditosService } from 'src/app/modulo-creditos/creditos/creditos.service';

@Component({
  selector: 'app-ventana-generar-interes',
  templateUrl: './ventana-generar-interes.component.html',
  styleUrls: ['./ventana-generar-interes.component.css']
})
export class VentanaGenerarInteresComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : any ,
    private ventana : MatDialogRef<VentanaGenerarInteresComponent> ,
    private _creditos : CreditosService ,
  ) { }

  ngOnInit(): void {
  }

  public Guardar() {
    if ( this.data.id_credito ) {
      this._creditos.GenerarInteres(this.data.id_credito).subscribe( res => {
        this.ventana.close(res) ;
      })
    }
  }
}
