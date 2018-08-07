import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';


@Injectable()


export class IngresoProductoService {

  public url: string = URL.url;

  constructor (private http: HttpClient)  {}

    Listado(

     ) {}


}
