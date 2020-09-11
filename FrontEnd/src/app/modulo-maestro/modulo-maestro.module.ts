import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { ImageUploadModule } from 'angular2-image-upload';
import { MaterialModule } from '../material/material.module';

import { ModuloMaestroRoutingModule } from './modulo-maestro-routing.module';
import { CooperativaConfiguracionComponent } from './cooperativa-configuracion/cooperativa-configuracion.component';
import { DireccionesComponent } from './direcciones/direcciones.component';
import { DepartamentoComponent } from './direcciones/departamento/departamento.component';
import { VentanaEmergenteDepartamento } from './direcciones/departamento/ventana-emergente/ventanaemergente';
import { DistritoComponent } from './direcciones/distrito/distrito.component';
import { VentanaEmergenteDistrito } from './direcciones/distrito/ventana-emergente/ventanaemergente';
import { ProvinciaComponent } from './direcciones/provincia/provincia.component';
import { VentanaEmergenteProvincia } from './direcciones/provincia/ventana-emergente/ventanaemergente';
import { FileUploadProveedores } from './file-upload/fileupload';
import { InstitucionComponent } from './instituciones/institucion/institucion.component';
import { InstitucionesComponent } from './instituciones/instituciones.component';
import { VentanaInstitucionComponent } from './instituciones/institucion/ventana-institucion/ventana-institucion.component';
import { CargoComponent } from './instituciones/cargo/cargo.component';
import { VentanaCargoComponent } from './instituciones/cargo/ventana-cargo/ventana-cargo.component';
import { CargoEstadoComponent } from './instituciones/cargo-estado/cargo-estado.component';
import { VentanaCargoEstadoComponent } from './instituciones/cargo-estado/ventana-cargo-estado/ventana-cargo-estado.component';
import { SedeComponent } from './instituciones/sede/sede.component';
import { VentanaSedeComponent } from './instituciones/sede/ventana-sede/ventana-sede.component';
import { SubsedeComponent } from './instituciones/subsede/subsede.component';
import { VentanaSubsedeComponent } from './instituciones/subsede/ventana-subsede/ventana-subsede.component';
import { PlantillasComponent } from './plantillas/plantillas.component';
import { CooperativaDireccionesComponent } from './plantillas/cooperativa-direcciones/cooperativa-direcciones.component';
import { VentanaCooperativaDireccionesComponent } from './plantillas/cooperativa-direcciones/ventana-cooperativa-direcciones/ventana-cooperativa-direcciones.component';
import { DocumentoAutorizacionComponent } from './plantillas/documento-autorizacion/documento-autorizacion.component';
import { DocumentoCartaComponent } from './plantillas/documento-carta/documento-carta.component';
import { DocumentoCompromisoComponent } from './plantillas/documento-compromiso/documento-compromiso.component';
import { DocumentoDeclaracionComponent } from './plantillas/documento-declaracion/documento-declaracion.component';
import { DocumentoTarjetaComponent } from './plantillas/documento-tarjeta/documento-tarjeta.component';
import { DocumentoTransaccionComponent } from './plantillas/documento-transaccion/documento-transaccion.component';
import { DocumentosComponent } from './plantillas/documentos/documentos.component';
import { VentanaDocumentosComponent } from './plantillas/documentos/ventana-documentos/ventana-documentos.component';
import { VentanaPlantillasComponent } from './plantillas/documentos/ventana-plantillas/ventana-plantillas.component';
import { ProcesoJudicialVinculadosComponent } from './proceso-judicial-vinculados/proceso-judicial-vinculados.component';
import { DistritoJudicialComponent } from './proceso-judicial-vinculados/distrito-judicial/distrito-judicial.component';
import { VentanaDistritoJudicialComponent } from './proceso-judicial-vinculados/distrito-judicial/ventana-distrito-judicial/ventana-distrito-judicial.component';
import { EstadoDocumentosComponent } from './proceso-judicial-vinculados/estado-documentos/estado-documentos.component';
import { VentanaEstadoDocumentosComponent } from './proceso-judicial-vinculados/estado-documentos/ventana-documentos/ventana-documentos.component';
import { InstanciaJudicialComponent } from './proceso-judicial-vinculados/instancia-judicial/instancia-judicial.component';
import { VentanaInstanciaJudicialComponent } from './proceso-judicial-vinculados/instancia-judicial/ventana-instancia-judicial/ventana-instancia-judicial.component';
import { JuezJuzgadoComponent } from './proceso-judicial-vinculados/juez-juzgado/juez-juzgado.component';
import { VentanaJuezJuzgadoComponent } from './proceso-judicial-vinculados/juez-juzgado/ventana-juez-juzgado/ventana-juez-juzgado.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { VentanaEmergenteProveedores } from './proveedores/ventana-emergente/ventana-emergente.component';
import { ProveedoresMovimientosComponent } from './proveedores-movimientos/proveedores-movimientos.component';
import { ReglasEvaluacionComponent } from './reglas-evaluacion/reglas-evaluacion.component';
import { TalonariosComponent } from './talonarios/talonarios.component';
import { VentanaTalonarioComponent } from './talonarios/ventana-talonario/ventana-talonario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosListarComponent } from './usuarios/usuarios-listar/usuarios-listar.component';
import { VentanaUsuariosComponent } from './usuarios/usuarios-listar/ventana-usuarios/ventana-usuarios.component';
import { PermisosListarComponent } from './usuarios/permisos-listar/permisos-listar.component';
import { VentanaPermisosComponent } from './usuarios/permisos-listar/ventana-permisos/ventana-permisos.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { VendedoresCargoComponent } from './vendedores/vendedores-cargo/vendedores-cargo.component';
import { VentanaVendedoresCargoComponent } from './vendedores/vendedores-cargo/ventana-vendedores-cargo/ventana-vendedores-cargo.component';
import { VendedoresListadoComponent } from './vendedores/vendedores-listado/vendedores-listado.component';
import { VentanaVendedorComponent } from './vendedores/vendedores-listado/ventana-vendedor/ventana-vendedor';
import { FileUploadVendedores } from './vendedores/vendedores-listado/file-upload/fileupload';
import { VentanaParametrosPlantillasComponent } from './instituciones/sede/ventana-parametros-plantillas/ventana-parametros-plantillas.component';

@NgModule({
  declarations: [
    CooperativaConfiguracionComponent ,
    DireccionesComponent ,
    DepartamentoComponent ,
    VentanaEmergenteDepartamento ,
    DistritoComponent ,
    VentanaEmergenteDistrito ,
    ProvinciaComponent ,
    VentanaEmergenteProvincia ,
    FileUploadProveedores ,
    InstitucionesComponent ,
    InstitucionComponent ,
    VentanaInstitucionComponent ,
    CargoComponent ,
    VentanaCargoComponent ,
    CargoEstadoComponent ,
    VentanaCargoEstadoComponent ,
    SedeComponent ,
    VentanaSedeComponent ,
    VentanaParametrosPlantillasComponent ,
    SubsedeComponent ,
    VentanaSubsedeComponent ,
    PlantillasComponent ,
    CooperativaDireccionesComponent ,
    VentanaCooperativaDireccionesComponent ,
    DocumentoAutorizacionComponent ,
    DocumentoCartaComponent ,
    DocumentoCompromisoComponent ,
    DocumentoDeclaracionComponent ,
    DocumentoTarjetaComponent ,
    DocumentoTransaccionComponent ,
    DocumentosComponent ,
    VentanaDocumentosComponent ,
    VentanaPlantillasComponent ,
    ProcesoJudicialVinculadosComponent ,
    DistritoJudicialComponent ,
    VentanaDistritoJudicialComponent ,
    EstadoDocumentosComponent ,
    VentanaEstadoDocumentosComponent ,
    InstanciaJudicialComponent ,
    VentanaInstanciaJudicialComponent ,
    JuezJuzgadoComponent ,
    VentanaJuezJuzgadoComponent ,
    ProveedoresComponent ,
    VentanaEmergenteProveedores ,
    ProveedoresMovimientosComponent ,
    ReglasEvaluacionComponent ,
    TalonariosComponent ,
    VentanaTalonarioComponent ,
    UsuariosComponent ,
    UsuariosListarComponent ,
    VentanaUsuariosComponent ,
    PermisosListarComponent ,
    VentanaPermisosComponent ,
    VendedoresComponent ,
    VendedoresCargoComponent ,
    VentanaVendedoresCargoComponent ,
    VendedoresListadoComponent ,
    VentanaVendedorComponent ,
    FileUploadVendedores ,
  ],
  imports: [
    ModuloMaestroRoutingModule ,
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    RouterModule ,
    MaterialModule ,
    ImageUploadModule ,
  ]
})
export class ModuloMaestroModule { }
