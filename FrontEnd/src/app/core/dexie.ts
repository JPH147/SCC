import Dexie from 'dexie' ;

const db : Dexie = new Dexie('alvis') ;

db.version(1).stores({
  // proceso_judicial_distrito : "++id, id_distrito, distrito" ,
  proceso_judicial_instancia : "++id, id_instancia, instancia, id_distrito, distrito" ,
  proceso_judicial_procesos : "++id, id_distrito, distrito, id_instancia, instancia" ,
})

export default db ;