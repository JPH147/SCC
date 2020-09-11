import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EvaluacionService } from '../../../modulo-clientes/evaluacion/evaluacion.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-ventana-archivos',
  templateUrl: './ventana-archivos.component.html',
  styleUrls: ['./ventana-archivos.component.css']
})
export class VentanaArchivosComponent implements OnInit {

  public autorizacion : string ;
  public ddjj : string ;
  public transaccion : string ;
  public tarjeta : string ;
  public compromiso : string ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaArchivosComponent>,
    private Servicios : EvaluacionService
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.autorizacion = this.data.pdf_autorizacion;
    this.ddjj = this.data.pdf_ddjj;
    this.transaccion = this.data.pdf_transaccion;
    this.tarjeta = this.data.pdf_tarjeta;
    this.compromiso = this.data.pdf_compromiso;
  }

  AbrirArchivo(nombre_archivo){
    this.Servicios.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      saveAs(res, nombre_archivo+'.docx');
    })
  }

}
