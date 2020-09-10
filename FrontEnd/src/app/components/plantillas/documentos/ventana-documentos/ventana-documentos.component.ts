import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { PlantillasService } from '../../plantillas.service';
import {URLIMAGENES} from 'src/app/core/servicios/url';
import {ServiciosGenerales} from 'src/app/core/servicios/servicios';
import { FileUploader } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-documentos',
  templateUrl: './ventana-documentos.component.html',
  styleUrls: ['./ventana-documentos.component.css'],
  providers : [ ServiciosGenerales ]
})
export class VentanaDocumentosComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  public PlantillasForm : FormGroup ;
  public Tipos : Array<any> = [] ;

  public archivo : File ;
  public archivo_nombre : string = "";
  public archivo_extension : string = "";

  public usuario : any ;
  public ruta : string ;
  public uploader:FileUploader;
  public file : File ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    private ventana: MatDialogRef<VentanaDocumentosComponent> ,
    private Servicio : PlantillasService ,
    private _generales: ServiciosGenerales ,
    private _builder : FormBuilder ,
    private _cookie : CookieService ,
  ) { }

  ngOnInit() {
    this.ruta = URLIMAGENES.urlimages;
    this.uploader = new FileUploader({url: this.ruta});

    this.CrearFormulario() ;
    this.ListarTiposPlantilla() ;
    this.Verificarusuario() ;

    this.PlantillasForm.get('tipo_plantilla').setValue(this.data.tipo_plantilla) ;
  }

  CrearFormulario() {
    this.PlantillasForm = this._builder.group({
      tipo_plantilla : [ { value : "" , disabled : false },[
        Validators.required ,
      ] ] ,
      comentarios : [ { value : "" , disabled : false },[
      ] ]
    })
  }

  ListarTiposPlantilla(){
    this.Servicio.ListarTipos().subscribe(res=>{
      this.Tipos = res ;
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

  Verificarusuario() {
    this.usuario = JSON.parse( this._cookie.get('usuario') ) ;
  }

  Guardar(){
    this.Cargando.next(true) ;
    let random = new Date().getTime() ;

    this._generales.SubirArchivo(this.archivo).subscribe(path_archivo=>{
      this._generales.RenameFile(path_archivo['data'], random.toString() , "_" + this.archivo_nombre , "plantillas")
      .subscribe(archivo_nombre=>{
        this.Servicio.CrearPlantilla(
          this.PlantillasForm.get('tipo_plantilla').value ,
          new Date() ,
          this.usuario.id ,
          this.PlantillasForm.get('comentarios').value ,
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
  