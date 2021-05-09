import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuariosService } from '../../usuarios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { Rol } from 'src/app/compartido/modelos/login.modelos';

@Component({
  selector: 'app-ventana-permisos',
  templateUrl: './ventana-permisos.component.html',
  styleUrls: ['./ventana-permisos.component.scss']
})
export class VentanaPermisosComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  
  public RolesForm : FormGroup ;
  public Permiso : Rol = null ; // Es la variable que contiene todo el detalle de los permisos

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaPermisosComponent> ,
    private _builder : FormBuilder ,
    private _usuarios : UsuariosService ,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.CrearPermiso() ;
    if ( this.data.id_perfil ) {
      this.SeleccionarPermiso() ;
    }
  }

  CrearFormulario(){
    this.RolesForm = this._builder.group({
      nombre : [ { value : "" , disabled : false }, [
        Validators.required
      ]]
    })
  }

  SeleccionarPermiso(){
    this.Cargando.next(true) ;

    this._usuarios.SeleccionarPerfil(this.data.id_perfil)
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(perfil=>{
      this.RolesForm.get('nombre').setValue(perfil.nombre) ;
      if( perfil.permisos ) {
        this.AsignarPermisos(perfil.permisos) ;
      }
    })
  }
  
  AsignarPermisos( permisos : Rol ) {
    this.Permiso = {
      maestro_general : {
        general : permisos.maestro_general?.general || false ,
        clientes : {
          general : permisos.maestro_general?.clientes?.general || false ,
          agregar : permisos.maestro_general?.clientes?.agregar || false ,
          editar : permisos.maestro_general?.clientes?.editar || false ,
          eliminar : permisos.maestro_general?.clientes?.eliminar || false ,
          confirmar_pendientes : permisos.maestro_general?.clientes?.confirmar_pendientes || false ,
          subir_foto : permisos.maestro_general?.clientes?.subir_foto || false ,
          ver_ventas : permisos.maestro_general?.clientes?.ver_ventas || false ,
          crear_observaciones : permisos.maestro_general?.clientes?.crear_observaciones || false ,
        } ,
        evaluacion : {
          general : permisos.maestro_general?.evaluacion?.general || false ,
        } ,
        seguimiento_documentos : {
          general : permisos.maestro_general?.seguimiento_documentos?.general || false ,
          editar : permisos.maestro_general?.seguimiento_documentos?.editar || false ,
          eliminar : permisos.maestro_general?.seguimiento_documentos?.eliminar || false ,
          registrar_entrega : permisos.maestro_general?.seguimiento_documentos?.registrar_entrega || false ,
          ver_documento : permisos.maestro_general?.seguimiento_documentos?.ver_documento || false ,
        }
      } ,
      ventas : {
        general : permisos.ventas?.general || false ,
        listado_ventas : {
          general : permisos.ventas?.listado_ventas?.general || false ,
          agregar : permisos.ventas?.listado_ventas?.agregar || false ,
          editar : permisos.ventas?.listado_ventas?.editar || false ,
          eliminar : permisos.ventas?.listado_ventas?.eliminar || false ,
          realizar_canjes : permisos.ventas?.listado_ventas?.realizar_canjes || false ,
          abrir_procesos : permisos.ventas?.listado_ventas?.abrir_procesos || false ,
          agregar_pagos_masivos : permisos.ventas?.listado_ventas?.agregar_pagos_masivos || false ,
          establecer_penalidad : permisos.ventas?.listado_ventas?.establecer_penalidad || false ,
          generar_interes : permisos.ventas?.listado_ventas?.generar_interes || false ,
          liquidar : permisos.ventas?.listado_ventas?.liquidar || false ,
          cambiar_acreedor : permisos.ventas?.listado_ventas?.cambiar_acreedor || false ,
        } ,
        salida_ventas : {
          general : permisos.ventas?.salida_ventas?.general || false ,
          agregar : permisos.ventas?.salida_ventas?.agregar || false ,
          editar : permisos.ventas?.salida_ventas?.editar || false ,
          eliminar : permisos.ventas?.salida_ventas?.eliminar || false ,
          registrar_retorno : permisos.ventas?.salida_ventas?.registrar_retorno || false ,
        } ,
        comision_vendedores : {
          general : permisos.ventas?.comision_vendedores?.general || false ,
        } ,
      } ,
      inventarios : {
        general : permisos.inventarios?.general || false ,
        productos : {
          general : permisos.inventarios?.productos?.general || false ,
          agregar : permisos.inventarios?.productos?.agregar || false ,
          subir_foto : permisos.inventarios?.productos?.subir_foto || false ,
          editar : permisos.inventarios?.productos?.editar || false ,
          eliminar : permisos.inventarios?.productos?.eliminar || false ,
        } ,
        stock : {
          general : permisos.inventarios?.stock?.general || false ,
          registrar_ingreso : permisos.inventarios?.stock?.registrar_ingreso || false ,
          registrar_salida : permisos.inventarios?.stock?.registrar_salida || false ,
        } ,
        documentos_almacen : {
          general : permisos.inventarios?.documentos_almacen?.general || false ,
          editar : permisos.inventarios?.documentos_almacen?.editar || false ,
        } ,
        historial_series : {
          general : permisos.inventarios?.historial_series?.general || false ,
    
        }
      } ,
      creditos : {
        general : permisos.creditos?.general || false ,
        listado_creditos : {
          general : permisos.creditos?.listado_creditos?.general || false ,
          agregar : permisos.creditos?.listado_creditos?.agregar || false ,
          editar : permisos.creditos?.listado_creditos?.editar || false ,
          eliminar : permisos.creditos?.listado_creditos?.eliminar || false ,
          abrir_procesos : permisos.creditos?.listado_creditos?.abrir_procesos || false ,
          agregar_pagos_masivos : permisos.creditos?.listado_creditos?.agregar_pagos_masivos || false ,
          establecer_penalidad : permisos.creditos?.listado_creditos?.establecer_penalidad || false ,
          generar_interes : permisos.creditos?.listado_creditos?.generar_interes || false ,
          liquidar : permisos.creditos?.listado_creditos?.liquidar || false ,
          cambiar_acreedor : permisos.creditos?.listado_creditos?.cambiar_acreedor || false ,
          exonerar_afiliacion : permisos.creditos?.listado_creditos?.exonerar_afiliacion || false ,
        } ,
        afiliaciones : {
          general : permisos.creditos?.afiliaciones?.general || false ,
          agregar : permisos.creditos?.afiliaciones?.agregar || false ,
          editar : permisos.creditos?.afiliaciones?.editar || false ,
          eliminar : permisos.creditos?.afiliaciones?.eliminar || false ,
          agregar_pagos_masivos : permisos.creditos?.afiliaciones?.agregar_pagos_masivos || false ,
          desafiliar : permisos.creditos?.afiliaciones?.desafiliar || false ,
        } ,
        refinanciamientos : {
          general : permisos.creditos?.refinanciamientos?.general || false ,
        } ,
      } ,
      procesos_judiciales : {
        general : permisos.procesos_judiciales?.general || false ,
        listado_procesos : {
          general : permisos.procesos_judiciales?.listado_procesos?.general || false ,
          agregar : permisos.procesos_judiciales?.listado_procesos?.agregar || false ,
          editar : permisos.procesos_judiciales?.listado_procesos?.editar || false ,
          eliminar : permisos.procesos_judiciales?.listado_procesos?.eliminar || false ,
          agregar_documentos : permisos.procesos_judiciales?.listado_procesos?.agregar_documentos || false ,
          ver_cronograma : permisos.procesos_judiciales?.listado_procesos?.ver_cronograma || false ,
          realizar_cronograma : permisos.procesos_judiciales?.listado_procesos?.realizar_cronograma || false ,
        }
      } ,
      cobranzas : {
        general : permisos.cobranzas?.general || false ,
        cronograma : {
          general : permisos.cobranzas?.cronograma?.general || false ,
          editar : permisos.cobranzas?.cronograma?.editar || false ,
        } ,
        clientes_morosos : {
          general : permisos.cobranzas?.clientes_morosos?.general || false ,
        } ,
        cobranzas_directas : {
          general : permisos.cobranzas?.cobranzas_directas?.general || false ,
          agregar : permisos.cobranzas?.cobranzas_directas?.agregar || false ,
          editar : permisos.cobranzas?.cobranzas_directas?.editar || false ,
          eliminar : permisos.cobranzas?.cobranzas_directas?.eliminar || false ,
          validar : permisos.cobranzas?.cobranzas_directas?.validar || false ,
        } ,
        cobranzas_planilla : {
          general : permisos.cobranzas?.cobranzas_planilla?.general || false ,
          agregar : permisos.cobranzas?.cobranzas_planilla?.agregar || false ,
          descargar_archivo : permisos.cobranzas?.cobranzas_planilla?.descargar_archivo || false ,
          registrar_pago : permisos.cobranzas?.cobranzas_planilla?.registrar_pago || false ,
          eliminar : permisos.cobranzas?.cobranzas_planilla?.eliminar || false ,
        } ,
        cobranzas_manuales : {
          general : permisos.cobranzas?.cobranzas_manuales?.general || false ,
          agregar : permisos.cobranzas?.cobranzas_manuales?.agregar || false ,
          editar : permisos.cobranzas?.cobranzas_manuales?.editar || false ,
          eliminar : permisos.cobranzas?.cobranzas_manuales?.eliminar || false ,
        } ,
        cobranzas_judiciales : {
          general : permisos.cobranzas?.cobranzas_judiciales?.general || false ,
        } ,
        liquidaciones : {
          general : permisos.cobranzas?.liquidaciones?.general || false ,
          eliminar : permisos.cobranzas?.liquidaciones?.eliminar || false ,
        } ,
      } ,
      tablas_maestras : {
        general : permisos.tablas_maestras?.general || false ,
        cooperativa : permisos.tablas_maestras?.cooperativa || false ,
        bancos : permisos.tablas_maestras?.bancos || false ,
        usuarios : permisos.tablas_maestras?.usuarios || false ,
        direcciones : permisos.tablas_maestras?.direcciones || false ,
        instituciones : permisos.tablas_maestras?.instituciones || false ,
        procesos_judiciales : permisos.tablas_maestras?.procesos_judiciales || false ,
        plantillas : permisos.tablas_maestras?.plantillas || false ,
        productos : permisos.tablas_maestras?.productos || false ,
        proveedores : permisos.tablas_maestras?.proveedores || false ,
        talonarios : permisos.tablas_maestras?.talonarios || false ,
        trabajadores : permisos.tablas_maestras?.trabajadores || false ,
      }
    }
  }

  CrearPermiso(){
    this.Permiso = {
      maestro_general : {
        general : false ,
        clientes : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
          confirmar_pendientes : false ,
          subir_foto : false ,
          ver_ventas : false ,
          crear_observaciones : false ,
        } ,
        evaluacion : {
          general : false ,
        } ,
        seguimiento_documentos : {
          general : false ,
          editar : false ,
          eliminar : false ,
          registrar_entrega : false ,
          ver_documento : false ,
        }
      } ,
      ventas : {
        general : false ,
        listado_ventas : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
          realizar_canjes : false ,
          abrir_procesos : false ,
          agregar_pagos_masivos : false ,
          establecer_penalidad : false ,
          generar_interes : false ,
          liquidar : false ,
          cambiar_acreedor : false ,
        } ,
        salida_ventas : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
          registrar_retorno : false ,
        } ,
        comision_vendedores : {
          general : false ,
        } ,
      } ,
      inventarios : {
        general : false ,
        productos : {
          general : false ,
          agregar : false ,
          subir_foto : false ,
          editar : false ,
          eliminar : false ,
        } ,
        stock : {
          general : false ,
          registrar_ingreso : false ,
          registrar_salida : false ,
        } ,
        documentos_almacen : {
          general : false ,
          editar : false ,
        } ,
        historial_series : {
          general : false ,
    
        }
      } ,
      creditos : {
        general : false ,
        listado_creditos : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
          abrir_procesos : false ,
          agregar_pagos_masivos : false ,
          establecer_penalidad : false ,
          generar_interes : false ,
          liquidar : false ,
          cambiar_acreedor : false ,
          exonerar_afiliacion : false ,
        } ,
        afiliaciones : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
          agregar_pagos_masivos : false ,
          desafiliar : false ,
        } ,
        refinanciamientos : {
          general : false ,
        } ,
      } ,
      procesos_judiciales : {
        general : false ,
        listado_procesos : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
          agregar_documentos : false ,
          ver_cronograma : false ,
          realizar_cronograma : false ,
        }
      } ,
      cobranzas : {
        general : false ,
        cronograma : {
          general : false ,
          editar : false ,
        } ,
        clientes_morosos : {
          general : false ,
        } ,
        cobranzas_directas : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
          validar : false ,
        } ,
        cobranzas_planilla : {
          general : false ,
          agregar : false ,
          descargar_archivo : false ,
          registrar_pago : false ,
          eliminar : false ,
        } ,
        cobranzas_manuales : {
          general : false ,
          agregar : false ,
          editar : false ,
          eliminar : false ,
        } ,
        cobranzas_judiciales : {
          general : false ,
        } ,
        liquidaciones : {
          general : false ,
          eliminar : false ,
        } ,
      } ,
      tablas_maestras : {
        general : false ,
        cooperativa : false ,
        bancos : false ,
        usuarios : false ,
        direcciones : false ,
        instituciones : false ,
        procesos_judiciales : false ,
        plantillas : false ,
        productos : false ,
        proveedores : false ,
        talonarios : false ,
        trabajadores : false ,
      }
    }
  }

  VerificarAtributosPadre(
    grupo : grupo ,
    valor : boolean
  ){
    Object.entries( this.Permiso[grupo] ).forEach( ([key, value]) => {
      if ( Object.isExtensible(value) ) {
        this.VerificarAtributosHijo( grupo, key, valor ) ;
      } else {
        this.Permiso[grupo][key] = valor ;
      }
    });
  }
  
  VerificarAtributosHijo(
    grupo : grupo ,
    subgrupo : string ,
    valor : boolean
  ){
    Object.entries( this.Permiso[grupo][subgrupo] ).forEach( ([key, value]) => {
      this.Permiso[grupo][subgrupo][key] = valor ;
    });
  }

  Guardar(){
    this.Cargando.next(true) ;
    if ( this.data.editar ) {
      this._usuarios.ActualizarPerfil(
        this.data.id_perfil ,
        this.RolesForm.get('nombre').value ,
        'Ventas' ,
        this.Permiso
      )
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(respuesta =>{
        this.ventana.close(respuesta)
      })
    } else {
      this._usuarios.CrearPerfil(
        this.RolesForm.get('nombre').value ,
        'Ventas' ,
        this.Permiso
      )
      .pipe(
        finalize(()=>{
          this.Cargando.next(false) ;
        })
      )
      .subscribe(respuesta =>{
        this.ventana.close(respuesta)
      })
    }
  }

}

type grupo = 'maestro_general' | 'ventas' | 'inventarios' | 'creditos' | 'procesos_judiciales' | 'cobranzas' | 'tablas_maestras' ;