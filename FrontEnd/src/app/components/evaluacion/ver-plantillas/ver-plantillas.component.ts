import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EvaluacionService } from '../../evaluacion/evaluacion.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-ver-plantillas',
  templateUrl: './ver-plantillas.component.html',
  styleUrls: ['./ver-plantillas.component.css']
})
export class VerPlantillasComponent implements OnInit {

  public aporte : string ;
  public celular : string ;
  public prestamo : string ;
  public ddjj : string ;
  public tarjeta : string ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VerPlantillasComponent>,
    private Servicios : EvaluacionService
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.aporte = 'AUTORIZACION_APORTE.pdf' ;
    this.celular = 'AUTORIZACION_CELULAR.pdf' ;
    this.prestamo = 'AUTORIZACION_PRESTAMO.pdf' ;
    this.tarjeta = 'DECLARACION_JURADA_2018.pdf' ;
    this.ddjj = 'TARJETA_PNP.pdf' ;
  }

  AbrirArchivo(nombre_archivo){
    this.Servicios.ObtenerArchivosEstandar(nombre_archivo).subscribe(res=>{
      console.log(res);
      saveAs(res, nombre_archivo);
    })
  }

}
