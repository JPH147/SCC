import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { ServiciosVentas } from '../../global/ventas';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged , tap } from 'rxjs/operators';

@Component({
  selector: 'app-ventana-talonario',
  templateUrl: './ventana-talonario.component.html',
  styleUrls: ['./ventana-talonario.component.css'],
  providers: [ServiciosVentas]
})
export class VentanaTalonarioComponent implements OnInit, AfterViewInit {

  @ViewChild('InputSerie', { static: true }) FiltroSerie : ElementRef ;
  public TalonariosForm : FormGroup;
  public repetido : boolean ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaTalonarioComponent>,
    private Builder: FormBuilder,
    private Servicios: ServiciosVentas,
  ) {}

  ngOnInit() {
    this.CrearFormulario();
  }

  ngAfterViewInit(){
    fromEvent(this.FiltroSerie.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.VerificarRegistroSerie();
      })
    ).subscribe()    
  }

  CrearFormulario(){
    this.TalonariosForm = this.Builder.group({
      'serie': [{value: "", disabled: false}, [
        Validators.required
      ]],
      'numero_inicio': [{value: 0, disabled: false}, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
      'numero_fin': [ 0, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]]
    });
  }

  Guardar(){
    this.CrearTalonario()
  }

  VerificarRegistroSerie(){
    this.Servicios.VerificarTalonario(this.FiltroSerie.nativeElement.value).subscribe(res=>{
      console.log(res)
      if(res){
        this.repetido=true ;
      } else {
        this.repetido = false ;
      }
    })
  }

  CrearTalonario(){
    this.Servicios.CrearTalonarios(
      this.TalonariosForm.value.serie,
      this.TalonariosForm.value.numero_inicio,
      this.TalonariosForm.value.numero_fin
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

}