import { Component, OnInit, Inject } from '@angular/core';
import { ServiciosGenerales } from '../../global/servicios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetalleDocumentoAlmacenService } from '../detalle-documento-almacen.service';

@Component({
  selector: 'app-ventana-editar-documento',
  templateUrl: './ventana-editar-documento.component.html',
  styleUrls: ['./ventana-editar-documento.component.css'],
  providers: [ DetalleDocumentoAlmacenService, ServiciosGenerales ]
})
export class VentanaEditarDocumentoComponent implements OnInit {

  public proveedores : Array<any> ;
  public DocumentoForm : FormGroup ;
  public Hoy = new Date();
  public archivo : File ;
  public archivo_nombre : string = "";
  public archivo_nombre_antiguo : string ;
  public archivo_nombre_antiguo_enlace : string ;
  public editar_archivo : boolean ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    public ventana : MatDialogRef<VentanaEditarDocumentoComponent> ,
    private Builder : FormBuilder ,
    private Servicios: ServiciosGenerales ,
    private Servicio:DetalleDocumentoAlmacenService ,
    private _generales : ServiciosGenerales ,
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarProveedor('');
    this.AsignarInformacion();
    console.log(this.data)
  }

  ngAfterViewInit(){
    this.DocumentoForm.get('proveedor').valueChanges
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.ListarProveedor(this.DocumentoForm.value.proveedor);
      })
     ).subscribe();
  }

  CrearFormulario(){
    this.DocumentoForm = this.Builder.group({
      id_proveedor: [{ value:null,disabled:false }, [Validators.required] ],
      proveedor: [{ value:null,disabled:false }, [] ],
      proveedor_nombre: [{ value:"",disabled:false }, [] ],
      fecha: [{ value: new Date() ,disabled:false }],
      documento: [{ value:"",disabled:false }],
    });
  }

  AsignarInformacion(){
    this.DocumentoForm.get('id_proveedor').setValue(this.data.id_referente) ;
    this.DocumentoForm.get('id_proveedor').setValue(this.data.id_referente) ;
    this.DocumentoForm.get('proveedor_nombre').setValue(this.data.referente) ;
    this.DocumentoForm.get('fecha').setValue(this.data.fecha) ;
    this.DocumentoForm.get('documento').setValue(this.data.documento) ;

    this.archivo_nombre_antiguo = this.data.archivo_nombre ;
    this.archivo_nombre_antiguo_enlace = this.data.archivo ;
    this.editar_archivo = this.data.archivo_nombre ? false : true ;
  }

  displayProveedor(proveedor?: any): string | undefined {
    return proveedor ? proveedor.nombre : "";
  }

  ListarProveedor(nombre: string) {
    this.Servicios.ListarProveedor(nombre).subscribe( res => {
      this.proveedores = res ;
    });
  }

  ProveedorSeleccionado(evento){
    this.proveedores=[];
    this.DocumentoForm.get('id_proveedor').setValue(evento.option.value.id) ;
    this.DocumentoForm.get('proveedor_nombre').setValue(evento.option.value.nombre) ;
  }

  RemoverProveedor(){
    this.DocumentoForm.get('id_proveedor').setValue(null) ;
    this.DocumentoForm.get('proveedor_nombre').setValue("") ;
    this.ListarProveedor("");
  }

  SubirArchivo(archivo: FileList) {
    this.archivo = archivo.item(0);
    this.archivo_nombre = this.archivo.name ;
    // this.VentanaJudicialForm.get('archivo').setValue(true);
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = "" ;
    // this.VentanaJudicialForm.get('archivo').setValue(null);
  }

  Guardar(){
    let random=(new Date()).getTime() ;


    if( this.archivo ) {
      this._generales.SubirArchivo(this.archivo).subscribe(path_archivo=>{
        this._generales.RenameFile(path_archivo['data'], this.DocumentoForm.value.documento, "_" + random, "movimientos almacen")
        .subscribe(archivo_nombre=>{
          this.Servicio.ActualizarCabecera(
            this.data.id,
            this.DocumentoForm.value.id_proveedor,
            this.DocumentoForm.value.fecha,
            this.DocumentoForm.value.documento,
            archivo_nombre.mensaje,
          ).subscribe(res=>{
            this.ventana.close(res)
          })
        })
      })
    } else {
      this.Servicio.ActualizarCabecera(
        this.data.id,
        this.DocumentoForm.value.id_proveedor,
        this.DocumentoForm.value.fecha,
        this.DocumentoForm.value.documento,
        "",
      ).subscribe(res=>{
        this.ventana.close(res)
      })
    }
  }

}
