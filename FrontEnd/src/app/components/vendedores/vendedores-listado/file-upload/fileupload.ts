import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { FileHolder } from 'angular2-image-upload';
import { URL } from 'src/app/core/servicios/url';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.html',
  styleUrls: ['./fileupload.css'],
  providers:[ServiciosGenerales, ServiciosVentas]
})

// tslint:disable-next-line:component-class-suffix
export class FileUploadVendedores {
  public selectedValue: string;
  public ClientesForm: FormGroup;
  public ruta:string;
  public carga_finalizada:boolean;
  public file:FileHolder;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<FileUploadVendedores>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private _vendedores : ServiciosVentas
    ) {}

    ngOnInit() {
      this.ruta=URL.url+"file/upload.php"
      this.carga_finalizada=false;
    }

    SubirFoto() {
      let fecha = new Date().getTime() ;
      if (this.file) {
        this.Servicios.RenameFile(this.file.serverResponse.response.body.data, 'VENDEDOR', this.data.dni+ "_"+ fecha,"vendedor").subscribe( res => {
          if (res) {
              this._vendedores.ActualizarFoto(this.data.id, res.mensaje).subscribe( res2 => {
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
