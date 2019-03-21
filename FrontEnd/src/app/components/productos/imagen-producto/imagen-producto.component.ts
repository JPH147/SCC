import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosGenerales} from '../../global/servicios';
import { NgControl } from '@angular/forms';
import {ProductoService} from '../productos.service';
import { FileHolder } from 'angular2-image-upload';
import {URL} from '../../global/url';
import * as moment from 'moment';

@Component({
  selector: 'app-imagen-producto',
  templateUrl: './imagen-producto.component.html',
  styleUrls: ['./imagen-producto.component.css'],
  providers:[ServiciosGenerales, ProductoService]
})

// tslint:disable-next-line:component-class-suffix
export class ImagenProductoComponent {
  public selectedValue: string;
  public ClientesForm: FormGroup;
  public ruta:string;
  public carga_finalizada:boolean;
  public file:FileHolder;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ImagenProductoComponent>,
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ProductoServicios: ProductoService,
    ) {}

    ngOnInit() {
      this.ruta=URL.url+"file/upload.php";
      this.carga_finalizada=false;
    }

    SubirFoto() {
      if ( this.data) {
        // console.log(file);
        this.Servicios.RenameFile(this.file.serverResponse.response.body, 'PRODUCTO', this.data.id+"-"+Math.floor(Math.random() * 100000),"producto").subscribe( res => {
          if (res) {
            this.ProductoServicios.ActualizarFoto(this.data.id, res.mensaje).subscribe(res=>{
              this.ventana.close()
            });
          }
        });
      }
      // console.log(file.serverResponse.response._body);
      // console.log(this.data);
    }

    FotoCargada(file: FileHolder){
      this.carga_finalizada=true;
      this.file=file;
    }

  onNoClick(): void {
    this.ventana.close();
  }

}
