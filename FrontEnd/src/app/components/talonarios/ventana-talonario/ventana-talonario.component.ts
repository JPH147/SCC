import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged , tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ventana-talonario',
  templateUrl: './ventana-talonario.component.html',
  styleUrls: ['./ventana-talonario.component.css'],
  providers: [ServiciosVentas]
})
export class VentanaTalonarioComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  @ViewChild('InputSerie', { static: true }) FiltroSerie : ElementRef ;
  public TalonariosForm : FormGroup;
  public repetido : boolean ;
  public serie_original : string ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaTalonarioComponent>,
    private Builder: FormBuilder,
    private Servicios: ServiciosVentas,
  ) {}

  ngOnInit() {
    this.CrearFormulario() ;
    if ( this.data ) {
      this.serie_original = this.data.serie ;
      this.TalonariosForm.get('serie').setValue(this.data.serie) ;
      this.TalonariosForm.get('numero_inicio').setValue(this.data.numero_inicio) ;
      this.TalonariosForm.get('numero_fin').setValue(this.data.numero_fin) ;
    }
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

  VerificarRegistroSerie(){
    if ( this.TalonariosForm.get('serie').value != this.serie_original ) {
      this.Cargando.next(true) ;
      this.Servicios.VerificarTalonario(this.FiltroSerie.nativeElement.value)
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(res=>{
        if(res){
          this.repetido=true ;
        } else {
          this.repetido = false ;
        }
      })
    }
  }

  Guardar() {
    this.Cargando.next(true) ;
    if ( this.data ) {
      this.Servicios.ActualizarTalonarios( this.TalonariosForm.get('serie').value, -1).subscribe(res => {
        this.CrearTalonario() ;
      });
    } else {
      this.CrearTalonario() ;
    }
  }

  CrearTalonario(){
    this.Servicios.CrearTalonarios(
      this.TalonariosForm.value.serie,
      this.TalonariosForm.value.numero_inicio,
      this.TalonariosForm.value.numero_fin
    )
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

}