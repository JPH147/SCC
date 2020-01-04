import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProcesoJudicialVinculadosService } from '../../proceso-judicial-vinculados.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-distrito-judicial',
  templateUrl: './ventana-distrito-judicial.component.html',
  styleUrls: ['./ventana-distrito-judicial.component.css']
})
export class VentanaDistritoJudicialComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public DistritosForm : FormGroup ;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaDistritoJudicialComponent>,
    private Builder : FormBuilder,
    private _distritos : ProcesoJudicialVinculadosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    if(this.data){
      this.DistritosForm.get('id_distrito').setValue(this.data.id);
      this.DistritosForm.get('distrito').setValue(this.data.nombre);
    } else {

    }
  }

  CrearFormulario(){
    this.DistritosForm = this.Builder.group({
      id_distrito : [null, [
        // Validators.required
      ]],
      distrito : ["", [
        Validators.required
      ]]
    })
  }

  Guardar(){
    this.Cargando.next(true);
    if (!this.data) {
      this._distritos.CrearDistritoJudicial(
        this.DistritosForm.value.distrito
      ).subscribe(res=>{
        this.Cargando.next(false);
        this.ventana.close({resultado:res});
      })
    } else {
      this._distritos.ActualizarDistritoJudicial(
        this.DistritosForm.value.id_distrito,
        this.DistritosForm.value.distrito
        ).subscribe(res=>{
          this.Cargando.next(false);
          this.ventana.close({resultado:res});
      })
    }
  }
}