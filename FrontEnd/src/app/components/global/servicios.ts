import {Injectable} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {URL} from './url';


@Injectable()

export class ServiciosGenerales{
	public url:string= URL.url;

	constructor(
		private http:HttpClient){
	}

	ngOnInit(){

	}

}
