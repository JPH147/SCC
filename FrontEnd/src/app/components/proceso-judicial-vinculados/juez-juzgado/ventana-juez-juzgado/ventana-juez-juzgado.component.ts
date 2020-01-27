import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcesoJudicialVinculadosService } from '../../proceso-judicial-vinculados.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-juez-juzgado',
  templateUrl: './ventana-juez-juzgado.component.html',
  styleUrls: ['./ventana-juez-juzgado.component.css']
})
export class VentanaJuezJuzgadoComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public Distritos : Array<any> = [];
  public JuecesForm : FormGroup ;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private ventana : MatDialogRef<VentanaJuezJuzgadoComponent>,
    private Builder : FormBuilder,
    private _instancias : ProcesoJudicialVinculadosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarDistritosJudiciales();
    if(this.data){
      console.log(this.data)
      this.JuecesForm.get('id_juez').setValue(this.data.id_juzgado_juez);
      this.JuecesForm.get('id_distrito').setValue(this.data.id_juzgado_distrito);
      this.JuecesForm.get('id_tipo').setValue(this.data.id_tipo);
      this.JuecesForm.get('juez').setValue(this.data.juzgado_juez);
    }
  }

  ListarDistritosJudiciales(){
    this._instancias.ListarDistritosJudiciales("",1,50).subscribe(res=>{
      this.Distritos = res['data'].distritos
    })
  }

  CrearFormulario(){
    this.JuecesForm = this.Builder.group({
      id_juez : [null, [
        // Validators.required
      ]],
      id_distrito : [null, [
        Validators.required
      ]],
      id_tipo : [null, [
        Validators.required
      ]],
      juez : ["", [
        Validators.required
      ]]
    })
  }

  Guardar(){
    this.Cargando.next(true);
    if (!this.data) {
      this._instancias.CrearJuez(
        this.JuecesForm.value.id_distrito ,
        this.JuecesForm.value.id_tipo ,
        this.JuecesForm.value.juez
      ).subscribe(res=>{
        this.Cargando.next(false);
        this.ventana.close({resultado:res});
      })
    } else {
      this._instancias.ActualizarJuez(
        this.JuecesForm.value.id_juez ,
        this.JuecesForm.value.id_distrito ,
        this.JuecesForm.value.id_tipo ,
        this.JuecesForm.value.juez
      ).subscribe(res=>{
        this.Cargando.next(false);
        this.ventana.close({resultado:res});
      })
    }
  }
}