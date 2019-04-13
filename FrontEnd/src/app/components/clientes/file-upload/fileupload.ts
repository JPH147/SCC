import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {ClienteService} from '../clientes.service';
import { FileHolder } from '../../../../../node_modules/angular2-image-upload';
import {URL} from '../../global/url';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.html',
  styleUrls: ['./fileupload.css'],
  providers:[ServiciosGenerales, ClienteService]
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
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ClienteServicios: ClienteService,
    ) {}

    ngOnInit() {
       this.ruta=URL.url+"file/upload.php"
       this.carga_finalizada=false;
    }


     // onUploadFinished(file: FileHolder) {
      
    SubirFoto() {
      if (this.file) {
        this.Servicios.RenameFile(this.file.serverResponse.response.body.data, 'CLIENTE', this.data.dni+ "-"+Math.floor(Math.random() * 100000),"cliente").subscribe( res => {
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
