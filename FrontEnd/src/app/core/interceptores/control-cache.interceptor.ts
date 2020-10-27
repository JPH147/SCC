import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { EstadosGlobales } from 'src/app/compartido/reducers/estados';
import { usuario } from 'src/app/compartido/modelos/login.modelos';

@Injectable()
export class ControlCacheInterceptor implements HttpInterceptor {

  private Usuario : usuario ;

  constructor(
    private _store : Store<EstadosGlobales>
  ) {
    this._store.select('usuario').subscribe(usuario => {
      this.Usuario = usuario ;
    })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ( this.Usuario ) {
      let datos_usuario = { 'usuario_alvis' : this.Usuario.id.toString() } ;
      let nuevo_body = request.body ? request.body.set('usuario_alvis', this.Usuario.id.toString()) : null ;

      const nuevaRequest = request.clone({
        setParams : datos_usuario ,
        body : nuevo_body ,
      });
      return next.handle(nuevaRequest);
    } else {
      return next.handle(request) ;
    }
  }
}
