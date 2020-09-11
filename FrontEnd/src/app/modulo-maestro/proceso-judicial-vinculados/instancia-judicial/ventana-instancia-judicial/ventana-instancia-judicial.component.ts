import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcesoJudicialVinculadosService } from '../../proceso-judicial-vinculados.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-instancia-judicial',
  templateUrl: './ventana-instancia-judicial.component.html',
  styleUrls: ['./ventana-instancia-judicial.component.css']
})
export class VentanaInstanciaJudicialComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public Distritos : Array<any> = [];
  public InstanciasForm : FormGroup ;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaInstanciaJudicialComponent>,
    private Builder : FormBuilder,
    private _instancias : ProcesoJudicialVinculadosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarDistritosJudiciales();
    if(this.data){
      this.InstanciasForm.get('id_instancia').setValue(this.data.id_juzgado_instancia);
      this.InstanciasForm.get('id_distrito').setValue(this.data.id_juzgado_distrito);
      this.InstanciasForm.get('instancia').setValue(this.data.juzgado_instancia);
    }
  }

  ListarDistritosJudiciales(){
    this._instancias.ListarDistritosJudiciales("",1,50).subscribe(res=>{
      this.Distritos = res['data'].distritos
    })
  }

  CrearFormulario(){
    this.InstanciasForm = this.Builder.group({
      id_instancia : [null, [
        // Validators.required
      ]],
      id_distrito : [null, [
        Validators.required
      ]],
      instancia : ["", [
        Validators.required
      ]]
    })
  }

  Guardar(){
    this.Cargando.next(true);
    if (!this.data) {
      this._instancias.CrearInstanciaJudicial(
        this.InstanciasForm.value.id_distrito ,
        this.InstanciasForm.value.instancia ,
      ).subscribe(res=>{
        this.Cargando.next(false);
        this.ventana.close({resultado:res});
      })
    } else {
      this._instancias.ActualizarInstanciaJudicial(
        this.InstanciasForm.value.id_instancia ,
        this.InstanciasForm.value.id_distrito ,
        this.InstanciasForm.value.instancia
      ).subscribe(res=>{
        this.Cargando.next(false);
        this.ventana.close({resultado:res});
      })
    }
  }
}