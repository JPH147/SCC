import { Injectable } from '@angular/core';
import db from '../dexie';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor() { }

  // public async GuardarDistritosOffline(
  //   distritos : Array<any>
  // ) {
  //   try {
  //     await db.table('proceso_judicial_distrito').clear() ;
      
  //     await db.table('proceso_judicial_distrito').bulkAdd(distritos) ;
  //   } catch (error) {
  //     console.log(error) ;
  //   }
  // }

  public async GuardarInstanciasOffline(
    instancias : Array<any>
  ) {
    try {
      await db.table('proceso_judicial_instancia').clear() ;

      await db.table('proceso_judicial_instancia').bulkAdd(instancias) ;
    } catch (error) {
      console.log(error) ;
    }
  }

  public async ListarInstanciasxDistrito(
    id_distrito : number ,
  ) :Promise<any[]> {
    try {
      await db.table('proceso_judicial_instancia').where("id_distrito").equals(id_distrito).toArray() ;
      return db.table('proceso_judicial_instancia').where("id_distrito").equals(id_distrito).toArray() ; ;
    } catch (error) {
      console.log(error) ;
      return [] ;
    }
  }

  public async GuardarProcesosOffline(
    procesos : Array<any>
  ) {
    try {
      await db.table('proceso_judicial_procesos').clear() ;

      await db.table('proceso_judicial_procesos').bulkAdd(procesos) ;
    } catch (error) {
      console.log(error) ;
    }
  }

  public async ListarProcesosxInstancia(
    id_instancia : number ,
  ) :Promise<any[]> {
    return db.table('proceso_judicial_procesos').where('id_instancia').equals(id_instancia).toArray() ;      
    // try {
    // } catch (error) {
    //   console.log(error) ;
    //   return [] ;
    // }
  }

  public async ContarProcesosxInstancia(
    id_instancia : number ,
  ) :Promise<number> {
    return db.table('proceso_judicial_procesos').where('id_instancia').equals(id_instancia).count() ;
  }

  public async ContarProcesosxDistrito(
    id_distrito : number ,
  ) :Promise<number> {
    await db.table('proceso_judicial_procesos').where('id_distrito').equals(id_distrito).count() ;
    return db.table('proceso_judicial_procesos').where('id_distrito').equals(id_distrito).count() ;
    // try {
    //   let relacion_tipos_activo = await db.table('proceso_judicial_procesos').where('id_distrito').equals(id_distrito).count() ;
    //   console.log(relacion_tipos_activo) ;
    // } catch (error) {
    //   console.log(error) ;
    //   return 0 ;
    // }
  }
}
