import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import {ServiciosGenerales} from 'src/app/core/servicios/servicios';
import {ClienteService} from '../clientes/clientes.service';
import { FileHolder } from 'angular2-image-upload';
import {URL} from 'src/app/core/servicios/url';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.html',
  styleUrls: ['./fileupload.css'],
})

// tslint:disable-next-line:component-class-suffix
export class FileUpload {
  public selectedValue: string;
  public ClientesForm: FormGroup;
  public ruta:string;
  public carga_finalizada:boolean;
  public file:FileHolder;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<FileUpload>,
    private Servicios: ServiciosGenerales,
    private ClienteServicios: ClienteService,
    ) {}

    ngOnInit() {
       this.ruta=URL.url+"file/upload.php"
       this.carga_finalizada=false;
    }

    SubirFoto() {
      if (this.file) {
        let fecha = new Date().getTime() ;
        this.Servicios.RenameFile(this.file.serverResponse.response.body.data, 'CLIENTE', this.data.dni+ "-"+ fecha ,"cliente").subscribe( res => {
          if (res) {
              this.ClienteServicios.ActualizarFoto(this.data.id, res.mensaje).subscribe( res2 => {
                this.ventana.close()
              }
            );
            }
        });
      }else{
        this.ventana.close()
      }
    }

    FotoCargada(file: FileHolder){
      this.carga_finalizada=true;
      this.file=file;
    }
    
  onNoClick(): void {
    this.ventana.close();
  }

}
