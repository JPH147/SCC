import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';

@Injectable({
  providedIn: 'root'
})
export class ProcesoJudicialVinculadosService {
  
  public url: string = URL.url;

  constructor(
    private http : HttpClient
  ){}

  ListarDocumentosJudiciales(
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"procesojudicialvinculados/read-documentos.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  ListarDistritosJudicialesActivos(
    nombre : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre) ;

    return this.http.get(this.url+"procesojudicialvinculados/read-distrito-activo.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res['data'].distritos;
      } else {
        return [];
      }
    }))
  }

  ListarDistritosJudiciales(
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"procesojudicialvinculados/read-distrito.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearDistritoJudicial(
    distrito_judicial : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", distrito_judicial ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/crear-distrito.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  ActualizarDistritoJudicial(
    id_distrito_judicial : number,
    distrito_judicial : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prdistritojuzgado", id_distrito_judicial.toString() )
      .set("prnombre", distrito_judicial ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/actualizar-distrito.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  EliminarDistritoJudicial(
    id_distrito_judicial : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prid", id_distrito_judicial.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/eliminar-distrito.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }))
  }

  ListarInstanciasJudiciales(
    id_distrito_juzgado : number,
    distrito_juzgado : string,
    instancia_juzgado : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("priddistritojuzgado", id_distrito_juzgado.toString())
      .set("prdistritojuzgado", distrito_juzgado)
      .set("prinstanciajuzgado", instancia_juzgado)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"procesojudicialvinculados/read-instancia.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearInstanciaJudicial(
    id_distrito_juzgado : number,
    instancia_juzgado : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prdistritojuzgado", id_distrito_juzgado.toString() )
      .set("prinstanciajuzgado", instancia_juzgado ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/crear-instancia.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  ActualizarInstanciaJudicial(
    id_instancia_juzgado : number,
    id_distrito_juzgado : number,
    instancia_juzgado : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prid", id_instancia_juzgado.toString() )
      .set("prdistritojuzgado", id_distrito_juzgado.toString() )
      .set("prinstanciajuzgado", instancia_juzgado ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/actualizar-instancia.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  EliminarInstanciaJudicial(
    id_instancia_juzgado : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstanciajuzgado", id_instancia_juzgado.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/eliminar-instancia.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }))
  }

  ListarEstado(
    id_documento : number,
    documento : string,
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("priddocumento", id_documento.toString() )
      .set("prdocumento", documento)
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"procesojudicialvinculados/read-estado.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:{estados:[]}};
      }
    }))
  }

  CrearEstado(
    id_proceso_documento : number,
    documento_estado : string,
  ) :Observable<any> {
    let params = new HttpParams()
    .set("prdocumento", id_proceso_documento.toString() )
      .set("prnombre", documento_estado ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/crear-estado.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  ActualizarEstado(
    id_documento_estado : number,
    id_proceso_documento : number,
    documento_estado : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prprocesoestado", id_documento_estado.toString() )
      .set("prdocumento", id_proceso_documento.toString() )
      .set("prnombre", documento_estado ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/actualizar-estado.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  EliminarEstado(
    id_documento_estado : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prid", id_documento_estado.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/eliminar-estado.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }))
  }

  ListarJuez(
    id_instancia_juzgado : number,
    instancia_juzgado : string,
    distrito_juzgado : string,
    tipo : string,
    instancia_juez : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("pridinstanciajuzgado", id_instancia_juzgado ? id_instancia_juzgado.toString() : "0")
      .set("prinstanciajuzgado", instancia_juzgado)
      .set("prdistritojuzgado", distrito_juzgado)
      .set("prtipo", tipo)
      .set("prinstanciajuez", instancia_juez)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"procesojudicialvinculados/read-juez.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearJuez(
    id_distrito_juzgado : number,
    tipo_juez : number,
    juzgado_juez : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prdistritojuzgado", id_distrito_juzgado.toString() )
      .set("prtipojuez", tipo_juez.toString() )
      .set("prjuzgadojuez", juzgado_juez ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/crear-juez.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  ActualizarJuez(
    id_instancia_juzgado : number,
    id_distrito_juzgado : number,
    tipo_juez : number,
    juzgado_juez : string,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prid", id_instancia_juzgado.toString() )
      .set("prdistritojuzgado", id_distrito_juzgado.toString() )
      .set("prtipojuez", tipo_juez.toString() )
      .set("prjuzgadojuez", juzgado_juez ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/actualizar-juez.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  EliminarJuez(
    juzgado_juez : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prjuzgadojuez", juzgado_juez.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+"procesojudicialvinculados/eliminar-juez.php",params, { headers : headers } )
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return true ;
      } else {
        console.log('No hay datos que mostrar');
        return false ;
      }
    }))
  }

}
