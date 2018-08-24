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
    }


      onUploadFinished(file: FileHolder) {

        if ( this.data) {
        console.log(file);
        this.Servicios.RenameFile(file.serverResponse.response._body, 'FOTO', this.data.dni,"cliente").subscribe( res => {
          console.log(res);
          if (res) {
              this.ClienteServicios.ActualizarFoto(this.data.id, res.mensaje).subscribe( res2 => {
                console.log(res2);
              }
            );
            }
        });
        }
        console.log(file.serverResponse.response._body);
        console.log(this.data);
        }

  onNoClick(): void {
    this.ventana.close();
  }

}
