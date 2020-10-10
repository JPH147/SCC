import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ControlCacheInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const nuevaRequest = request.clone({
    //   setHeaders: {
    //     'Cache-Control': 'no-cache',
    //     // Pragma: 'no-cache'
    //   }
    // });
    // console.log(nuevaRequest) ;
    // return next.handle(nuevaRequest);
    // console.log(request) ;
    return next.handle(request) ;
  }
}
