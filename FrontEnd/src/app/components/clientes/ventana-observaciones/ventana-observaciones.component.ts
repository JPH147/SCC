import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ventana-observaciones',
  templateUrl: './ventana-observaciones.component.html',
  styleUrls: ['./ventana-observaciones.component.css']
})
export class VentanaObservacionesComponent implements OnInit {

	public ObservacionForm: FormGroup;
  public observaciones: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaObservacionesComponent>,
    private Builder: FormBuilder,
  ) { }

  ngOnInit() {
  	this.ObservacionForm = this.Builder.group({
  		observaciones: this.Builder.array([this.CrearObservacion()])
  	})
  }

  CrearObservacion(): FormGroup {
    return this.Builder.group({
      observacion: ['',[
      ]]
    });
  }

  AgregarObservacion(): void {
    this.observaciones = this.ObservacionForm.get('observaciones') as FormArray;
    this.observaciones.push(this.CrearObservacion());
  }

  onNoClick(): void {
    this.ventana.close();
  }

}
