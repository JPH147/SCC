import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, merge } from 'rxjs';
import { UsuariosService } from '../components/usuarios/usuarios.service';
import { debounceTime, distinctUntilChanged, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public LoginForm : FormGroup ;
  public error : boolean = false ;

  constructor(
    private _usuarios : UsuariosService ,
    private _builder : FormBuilder ,
    private _router : Router
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
  }

  ngAfterViewInit(){
    merge(
      this.LoginForm.get('usuario').valueChanges ,
      this.LoginForm.get('password').valueChanges
    ).pipe(
      debounceTime(200) ,
      distinctUntilChanged() ,
      tap(()=>{
        this.error = false ;
      })
    ).subscribe()
  }

  CrearFormulario() {
    this.LoginForm = this._builder.group({
      usuario : [ { value : "" , disabled :false },[
        Validators.required
      ] ] ,
      password : [ { value : "" , disabled :false },[
        Validators.required
      ] ] ,
    })
  }

  IniciarSesion(){
    this.Cargando.next(true) ;
    this._usuarios.TryLogin(
      this.LoginForm.value.usuario ,
      this.LoginForm.value.password
    )
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      if( res ) {
        this._router.navigate(['inicio'])
      } else {
        this.error = true ;
      }
    })
  }
}
