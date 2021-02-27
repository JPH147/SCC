import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import {URLIMAGENES} from 'src/app/core/servicios/url';
import {ServiciosGenerales} from 'src/app/core/servicios/servicios';
import { FileUploader } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CobranzasService } from '../../cobranzas-listar/cobranzas.service';

@Component({
  selector: 'app-ventana-cobranza-directa-listar',
  templateUrl: './ventana-cobranza-directa-listar.component.html',
  styleUrls: ['./ventana-cobranza-directa-listar.component.css']
})
export class VentanaCobranzaDirectaListarComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public archivo : File ;
  public archivo_anterior : string = "";
  public archivo_nombre : string = "";
  public archivo_extension : string = "";
  public archivo_anterior_url : string = "";

  public usuario : any ;
  public ruta : string ;
  public uploader:FileUploader;
  public file : File ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : number ,
    private _generales: ServiciosGenerales ,
    private ventana : MatDialogRef<VentanaCobranzaDirectaListarComponent> ,
    private Servicio: CobranzasService,
  ) { }

  ngOnInit(): void {
    this.SeleccionarCobranza(this.data)
  }

  SeleccionarCobranza(id_cobranza){
    this.Servicio.SeleccionarCobranzaDirecta(id_cobranza).subscribe(res=>{
      res.archivo != "" ? this.archivo_anterior = res.archivo : null ;
      res.archivo != "" ? this.archivo_anterior_url = URLIMAGENES.carpeta+'cobranza/'+ res.archivo : null ;
    })
  }

  SubirArchivo(archivo: FileList) {
    this.archivo = archivo.item(0);
    this.archivo_nombre = this.archivo.name ;
    this.archivo_extension = this.archivo_nombre.split('.').pop();
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = "" ;
    this.archivo_extension = "" ;
  }

  Guardar(){
    this.Cargando.next(true) ;
    let random = new Date().getTime() ;

    this._generales.SubirArchivo(this.archivo).subscribe(path_archivo=>{
      this._generales.RenameFile(path_archivo['data'], random.toString() , "voucher_directa" , "cobranza")
      .subscribe(archivo_nombre=>{
        this.Servicio.ActualizarCobranzaDirectaVoucher(
          this.data ,
          archivo_nombre.mensaje
        )
        .pipe(
          finalize(()=>this.Cargando.next(false))
        )
        .subscribe(res=>{
          this.ventana.close(res);
        })
      })
    })
  }
}
