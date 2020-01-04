import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { PlantillasService } from '../plantillas.service';
import {URLIMAGENES} from '../../global/url';
import {ServiciosGenerales} from '../../global/servicios';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector : 'app-ventana-plantillas',
  templateUrl : './ventana-plantillas.component.html',
  styleUrls : ['./ventana-plantillas.component.css'],
  providers : [ ServiciosGenerales ]
})
export class VentanaPlantillasComponent implements OnInit {

  public archivo : string ;
  public ruta : string ;
  public uploader:FileUploader;
  public file : File ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    private ventana: MatDialogRef<VentanaPlantillasComponent> ,
    private Servicio : PlantillasService ,
    private GServicio: ServiciosGenerales,
  ) { }

  ngOnInit() {
    this.ruta = URLIMAGENES.urlimages;
    this.uploader = new FileUploader({url: this.ruta});
  }

  // SubirArchivo(evento){
  //   console.log(evento);
  //   this.archivo = evento.serverResponse.response.body.data;
  // }

  onFileSelected(event) {
    if(event.target.files.length > 0) 
     {
      //  console.log(event.target.files[0]);
       this.file = event.target.files[0];
     }
   }

  Guardar(){
    // console.log(this.uploader.queue);
    // this.uploader.uploadAll();
    this.Servicio.SubirArchivo(this.file).subscribe(res=>{
      // console.log(res);
      this.Servicio.RenameFile(res['data'], this.data.nombre).subscribe( resultado => {
        if (resultado['codigo']==0) {
          this.ventana.close(true);
        } else {
          this.ventana.close(false);
        }
      });
    });
  }

}
