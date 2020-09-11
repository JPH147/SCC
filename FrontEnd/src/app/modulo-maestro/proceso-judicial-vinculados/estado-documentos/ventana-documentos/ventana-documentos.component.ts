import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcesoJudicialVinculadosService } from '../../proceso-judicial-vinculados.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-documentos',
  templateUrl: './ventana-documentos.component.html',
  styleUrls: ['./ventana-documentos.component.css']
})
export class VentanaEstadoDocumentosComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public EstadosForm : FormGroup ;
  public TipoDocumentos : Array<any> = [] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaEstadoDocumentosComponent>,
    private Builder : FormBuilder,
    private _distritos : ProcesoJudicialVinculadosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarDocumentos();

    if(this.data){
      this.EstadosForm.get('id_estado').setValue(this.data.id);
      this.EstadosForm.get('documento').setValue(this.data.id_documento);
      this.EstadosForm.get('estado').setValue(this.data.nombre);
    }
  }

  CrearFormulario(){
    this.EstadosForm = this.Builder.group({
      id_estado : [null, [
        // Validators.required
      ]],
      documento : ["", [
        Validators.required
      ]] ,
      estado : ["", [
        Validators.required
      ]]
    })
  }

  ListarDocumentos(){
    this._distritos.ListarDocumentosJudiciales("",1,50).subscribe(res=>{
      this.TipoDocumentos = res['data'].documentos ;
    })
  }

  Guardar(){
    this.Cargando.next(true);
    if (!this.data) {
      this._distritos.CrearEstado(
        this.EstadosForm.value.documento,
        this.EstadosForm.value.estado
      ).subscribe(res=>{
        this.Cargando.next(false);
        this.ventana.close({resultado:res});
      })
    } else {
      this._distritos.ActualizarEstado(
        this.EstadosForm.value.id_estado,
        this.EstadosForm.value.documento,
        this.EstadosForm.value.estado
        ).subscribe(res=>{
          this.Cargando.next(false);
          this.ventana.close({resultado:res});
      })
    }
  }
}