export type usuario = {
  id : number ,
  usuario : string ,
  rol : string ,
  id_perfil : number ,
  perfil : string ,
  permisos : Rol ,
}

export type Rol = {
  maestro_general : {
    general : boolean ,
    clientes : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      confirmar_pendientes : boolean ,
      subir_foto : boolean ,
      ver_ventas : boolean ,
      crear_observaciones : boolean ,
    } ,
    evaluacion : {
      general : boolean ,
    } ,
    seguimiento_documentos : {
      general : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      registrar_entrega : boolean ,
      ver_documento : boolean ,
    }
  } ,
  ventas : {
    general : boolean ,
    listado_ventas : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      realizar_canjes : boolean ,
      abrir_procesos : boolean ,
      agregar_pagos_masivos : boolean ,
      establecer_penalidad : boolean ,
      generar_interes : boolean ,
      liquidar : boolean
    } ,
    salida_ventas : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      registrar_retorno : boolean ,
    } ,
    comision_vendedores : {
      general : boolean ,
    } ,
  } ,
  inventarios : {
    general : boolean ,
    productos : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      subir_foto : boolean ,
    } ,
    stock : {
      general : boolean ,
      registrar_ingreso : boolean ,
      registrar_salida : boolean ,
    } ,
    documentos_almacen : {
      general : boolean ,
      editar : boolean ,
    } ,
    historial_series : {
      general : boolean ,
    }
  } ,
  creditos : {
    general : boolean ,
    listado_creditos : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      abrir_procesos : boolean ,
      agregar_pagos_masivos : boolean ,
      establecer_penalidad : boolean ,
      generar_interes : boolean ,
      liquidar : boolean
    } ,
    afiliaciones : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      agregar_pagos_masivos : boolean ,
    } ,
    refinanciamientos : {
      general : boolean ,
    } ,
  } ,
  procesos_judiciales : {
    general : boolean ,
    listado_procesos : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      agregar_documentos : boolean ,
      ver_cronograma : boolean ,
      realizar_cronograma : boolean ,
    } ,
  } ,
  cobranzas : {
    general : boolean ,
    cronograma : {
      general : boolean ,
      editar : boolean ,
    } ,
    clientes_morosos : {
      general : boolean ,
    } ,
    cobranzas_directas : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      validar : boolean ,
    } ,
    cobranzas_planilla : {
      general : boolean ,
      agregar : boolean ,
      descargar_archivo : boolean ,
      registrar_pago : boolean ,
      eliminar : boolean ,
    } ,
    cobranzas_manuales : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
    }
  } ,
  tablas_maestras : {
    general : boolean ,
    cooperativa : boolean ,
    bancos : boolean ,
    usuarios : boolean ,
    direcciones : boolean ,
    instituciones : boolean ,
    procesos_judiciales : boolean ,
    plantillas : boolean ,
    productos : boolean ,
    proveedores : boolean ,
    talonarios : boolean ,
    trabajadores : boolean ,
  }
}