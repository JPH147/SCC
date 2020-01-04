import { Component, OnInit, Inject } from '@angular/core';
import { ServiciosGenerales } from '../../global/servicios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ventana-editar-documento',
  templateUrl: './ventana-editar-documento.component.html',
  styleUrls: ['./ventana-editar-documento.component.css']
})
export class VentanaEditarDocumentoComponent implements OnInit {

  public proveedores : Array<any> ;
  public DocumentoForm : FormGroup ;
  public Hoy = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private Builder : FormBuilder ,
    private Servicios: ServiciosGenerales
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarProveedor('');
    this.AsignarInformacion();
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
    this.DocumentoForm.get('proveedor_nombre').setValue(this.data.referente) ;
    this.DocumentoForm.get('fecha').setValue(this.data.fecha) ;
    this.DocumentoForm.get('documento').setValue(this.data.documento) ;
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

  Guardar(){

  }

}
