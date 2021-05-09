<?php

require '../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

Class Proceso{

  private $conn;
  
  public $id_proceso ;
  public $id_proceso_nuevo ;
  public $id_proceso_antiguo ;
  public $id_estado ;
  public $id_cliente ;
  public $id_venta ;
  public $id_credito ;
  public $expediente ;
  public $juzgado ;
  public $instancia ;
  public $juez ;
  public $especialista ;
  public $tipo_documento ;
  public $tipo_transaccion ;
  public $id_transaccion;
  public $transacciones ;
  public $numero ;
  public $sumilla ;
  public $archivo ;
  public $comentarios ;
  public $dni ;
  public $nombre ;
  public $fecha ;
  public $trabajador ;
  public $fecha_inicio ;
  public $fecha_fin ;
  public $monto_cuota ;
  public $numero_cuotas ;
  public $total ;
  public $estado ;
  public $numero_pagina ;
  public $total_pagina ;
  public $orden ;
  public $arreglo ;

  public $fecha_notificacion_demandado ;
  public $fecha_notificacion_cooperativa ;
  public $fecha_notificacion_retorno ;

  public $id_proceso_notificacion ;
  public $codigo ;
  public $destinatario ;
  public $anexos ;
  public $juzgado_fecha_resolucion ;
  public $juzgado_fecha_notificacion ;
  public $juzgado_fecha_envio ;
  public $juzgado_fecha_recepcion ;
  public $central_fecha_notificacion ;
  public $central_fecha_cargo ;
  public $observacion ;

  public $path_reporte = '../uploads/reporte-judiciales/';

  public function __construct($db){
    $this->conn = $db;
  }

  function read(){
    $query = "CALL sp_listarprocesojudicial(?,?,?,?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->expediente);
    $result->bindParam(2, $this->distrito_judicial);
    $result->bindParam(3, $this->juzgado);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);
    $result->bindParam(9, $this->numero_pagina);
    $result->bindParam(10, $this->total_pagina);
    $result->bindParam(11, $this->orden);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["procesos"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id"=>$id,
        "ultimo_documento"=>$ultimo_documento,
        "id_tipo_documento"=>$id_tipo_documento,
        "expediente"=>$expediente,
        "id_distrito"=>$id_distrito,
        "distrito"=>$distrito,
        "juzgado"=>$juzgado,
        "vendedor"=>$vendedor,
        "fecha_inicio"=>$fecha_inicio,
        "fecha_ultimo_documento"=>$fecha_ultimo_documento,
        "fecha_ultimo_documento_diferencia"=>$fecha_ultimo_documento_diferencia,
        "sumilla"=>$sumilla,
        "id_tipo"=>$id_tipo,
        "tipo"=>$tipo,
        "id_cliente"=>$id_cliente,
        "cliente_dni"=>$cliente_dni,
        "cliente_nombre"=>$cliente_nombre,
        "total"=>$total,
        "estado"=>$estado
      );
      array_push($procesos_list["procesos"],$items);
    }
    return $procesos_list;
  }

  function contar(){
    $query = "CALL sp_listarprocesojudicialcontar(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->expediente);
    $result->bindParam(2, $this->distrito_judicial);
    $result->bindParam(3, $this->juzgado);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function contarV2() {
    $query = "CALL sp_listarprocesojudicialcontarV2(?,?,?)";
    
    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->fecha_inicio);
    $result->bindParam(2, $this->fecha_fin);
    $result->bindParam(3, $this->estado);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function readxId(){

    $query ="call sp_listarprocesojudicialxId(?)";
      
    $result = $this->conn->prepare($query);
    
    $result->bindParam(1, $this->id_proceso);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $resultado = array (
      "id" => $row['id'] ,
      "expediente" => $row['expediente'] ,
      "id_juzgado_distrito" => $row['id_juzgado_distrito'] ,
      "juzgado_distrito" => $row['juzgado_distrito'] ,
      "id_juzgado_instancia" => $row['id_juzgado_instancia'] ,
      "juzgado_instancia" => $row['juzgado_instancia'] ,
      "id_juez" => $row['id_juez'] ,
      "juez" => $row['juez'] ,
      "id_especialista" => $row['id_especialista'] ,
      "especialista" => $row['especialista'] ,
      "fecha_inicio" => $row['fecha_inicio'] ,
      "sumilla" => $row['sumilla'] ,
      "total_documentos" => $row['total_documentos'] ,
      "codigo" => $row['codigo'] ,
      "id_cliente" => $row['id_cliente'] ,
      "cliente_dni" => "'" . $row['cliente_dni'] ,
      "cliente_nombre" => $row['cliente_nombre'] ,
      "numero_cuotas" => $row['numero_cuotas'] ,
      "total" => $row['total'] ,
      "monto_cuota" => $row['monto_cuota'] ,
      "estado" => $row['estado'] ,
      "devolucion_anexos_fecha" => $row['devolucion_anexos_fecha'] ,
      "devolucion_anexos_comentarios" => $row['devolucion_anexos_comentarios'] ,
      "devolucion_anexos_archivo" => $row['devolucion_anexos_archivo'] ,
    );

    return $resultado;
  }

  function readanteriorxId(){

    $query ="call sp_listarprocesojudicialanteriorxId(?)";
      
    $result = $this->conn->prepare($query);
    
    $result->bindParam(1, $this->id_proceso);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $resultado = array (
      "id" => $row['id'] ,
      "expediente" => $row['expediente'] ,
      "id_juzgado_distrito" => $row['id_juzgado_distrito'] ,
      "juzgado_distrito" => $row['juzgado_distrito'] ,
      "id_juzgado_instancia" => $row['id_juzgado_instancia'] ,
      "juzgado_instancia" => $row['juzgado_instancia'] ,
      "juez" => $row['juez'] ,
      "especialista" => $row['especialista'] ,
      "fecha_inicio" => $row['fecha_inicio'] ,
      "sumilla" => $row['sumilla'] ,
      "tipo" => $row['tipo'] ,
      "codigo" => $row['codigo'] ,
      "id_cliente" => $row['id_cliente'] ,
      "cliente_dni" => $row['cliente_dni'] ,
      "cliente_documento" => $row['cliente_documento'] ,
      "numero_cuotas" => $row['numero_cuotas'] ,
      "total" => $row['total'] ,
      "monto_cuota" => $row['monto_cuota'] ,
      "estado" => $row['estado'] ,
    );

    return $resultado;
  }

  function read_proceso_detallexId(){
    $query = "CALL sp_listarprocesojudicialdetallexId(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_proceso);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["procesos"]=array();
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
        $items = array (
          "id"=>$id,
          "id_tipo_documento"=>$id_tipo_documento,
          "tipo_documento"=>$tipo_documento,
          "fecha"=>$fecha,
          "id_trabajador"=>$id_trabajador,
          "trabajador"=>$trabajador,
          "id_estado"=>$id_estado,
          "estado"=>$estado,
          "numero"=>$numero,
          "sumilla"=>$sumilla,
          "archivo"=>$archivo,
          "comentarios"=>$comentarios,
        );
        array_push($procesos_list["procesos"],$items);
    }

    return $procesos_list;
  }

  function read_proceso_detalle(){
    $query = "CALL sp_listarprocesojudicialdetalle(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_proceso);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["procesos"]=array();
    
    $row = $result->fetchAll(PDO::FETCH_ASSOC);
    $result->closeCursor();
    foreach( $row as $item )
    {
        extract($row);
        $items = array (
          "id"=>$item['id'],
          "id_tipo_documento"=>$item['id_tipo_documento'],
          "tipo_documento"=>$item['tipo_documento'],
          "fecha"=>$item['fecha'],
          "id_trabajador"=>$item['id_trabajador'],
          "trabajador"=>$item['trabajador'],
          "id_estado"=>$item['id_estado'],
          "estado"=>$item['estado'],
          "numero"=>$item['numero'],
          "sumilla"=>$item['sumilla'],
          "archivo"=>$item['archivo'],
          "comentarios"=>$item['comentarios'],
          "fecha_notificacion_demandado" => $item['fecha_notificacion_demandado '],
          "fecha_notificacion_cooperativa" => $item['fecha_notificacion_cooperativa '],
          "fecha_notificacion_retorno" => $item['fecha_notificacion_retorno '],
          "fecha_creacion"=>$item['fecha_creacion'],
          "usuario_creacion"=>$item['usuario_creacion'],
          "fecha_edicion"=>$item['fecha_edicion'],
          "usuario_edicion"=>$item['usuario_edicion'],
          "notificaciones"=>$this->read_procesosjudicialesnotificacionxproceso_parametros($item['id']),
        );
        array_push($procesos_list["procesos"],$items);
    }

    return $procesos_list;
  }

  function read_proceso_detalle_anteriores(){
    $query = "CALL sp_listarprocesojudicialdetalleanteriores(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_proceso);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["procesos"]=array();
    
    $row = $result->fetchAll(PDO::FETCH_ASSOC);
    $result->closeCursor();
    foreach( $row as $item )
    {
        extract($row);
        $items = array (
          "id"=>$item['id'],
          "id_tipo_documento"=>$item['id_tipo_documento'],
          "tipo_documento"=>$item['tipo_documento'],
          "fecha"=>$item['fecha'],
          "id_trabajador"=>$item['id_trabajador'],
          "trabajador"=>$item['trabajador'],
          "numero"=>$item['numero'],
          "sumilla"=>$item['sumilla'],
          "archivo"=>$item['archivo'],
          "comentarios"=>$item['comentarios'],
          "fecha_creacion"=>$item['fecha_creacion'],
          "usuario_creacion"=>$item['usuario_creacion'],
          "fecha_edicion"=>$item['fecha_edicion'],
          "usuario_edicion"=>$item['usuario_edicion'],
        );
        array_push($procesos_list["procesos"],$items);
    }

    return $procesos_list;
  }

  function create_proceso_judicial(){
    $query = "call sp_crearprocesojudicial(
      :prventa,
      :prcredito,
      :prexpediente,
      :prinstancia,
      :prjuez,
      :prespecialista,
      :prfecha,
      :prsumilla,
      :prnumerocuotas,
      :prtotal
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prventa", $this->id_venta);
    $result->bindParam(":prcredito", $this->id_credito);
    $result->bindParam(":prexpediente", $this->expediente);
    $result->bindParam(":prinstancia", $this->instancia);
    $result->bindParam(":prjuez", $this->juez);
    $result->bindParam(":prespecialista", $this->especialista);
    $result->bindParam(":prfecha", $this->fecha_inicio);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prnumerocuotas", $this->numero_cuotas);
    $result->bindParam(":prtotal", $this->total);

    $this->id_venta=htmlspecialchars(strip_tags($this->id_venta));
    $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
    $this->expediente=htmlspecialchars(strip_tags($this->expediente));
    $this->instancia=htmlspecialchars(strip_tags($this->instancia));
    $this->juez=htmlspecialchars(strip_tags($this->juez));
    $this->especialista=htmlspecialchars(strip_tags($this->especialista));
    $this->fecha_inicio=htmlspecialchars(strip_tags($this->fecha_inicio));
    $this->sumilla=htmlspecialchars(strip_tags($this->sumilla));
    $this->numero_cuotas=htmlspecialchars(strip_tags($this->numero_cuotas));
    $this->total=htmlspecialchars(strip_tags($this->total));

    if($result->execute())
    {
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $this->id_proceso=$id;
      }

      return true;
    }
    
    return false;
  }

  function update_proceso_judicial(){
    $query = "call sp_actualizarprocesojudicial(
      :prproceso,
      :prexpediente,
      :prinstancia,
      :prjuez,
      :prespecialista,
      :prfecha,
      :prsumilla,
      :prnumerocuotas,
      :prtotal
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prexpediente", $this->expediente);
    $result->bindParam(":prinstancia", $this->instancia);
    $result->bindParam(":prjuez", $this->juez);
    $result->bindParam(":prespecialista", $this->especialista);
    $result->bindParam(":prfecha", $this->fecha_inicio);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prnumerocuotas", $this->numero_cuotas);
    $result->bindParam(":prtotal", $this->total);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->expediente=htmlspecialchars(strip_tags($this->expediente));
    $this->instancia=htmlspecialchars(strip_tags($this->instancia));
    $this->juez=htmlspecialchars(strip_tags($this->juez));
    $this->especialista=htmlspecialchars(strip_tags($this->especialista));
    $this->fecha_inicio=htmlspecialchars(strip_tags($this->fecha_inicio));
    $this->sumilla=htmlspecialchars(strip_tags($this->sumilla));
    $this->numero_cuotas=htmlspecialchars(strip_tags($this->numero_cuotas));
    $this->total=htmlspecialchars(strip_tags($this->total));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function update_proceso_judicial_traslado(){
    $query = "call sp_actualizarprocesojudicialtraslado(
      :prprocesonuevo,
      :prprocesoantiguo
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prprocesonuevo", $this->id_proceso_nuevo);
    $result->bindParam(":prprocesoantiguo", $this->id_proceso_antiguo);

    $this->id_proceso_nuevo=htmlspecialchars(strip_tags($this->id_proceso_nuevo));
    $this->id_proceso_antiguo=htmlspecialchars(strip_tags($this->id_proceso_antiguo));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  // Cuando un proceso para para ser cobrado
  function update_proceso_judicial_cobranza(){
    $query = "call sp_actualizarprocesojudicialcobranza(
      :prproceso,
      :prfecha
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prfecha", $this->fecha);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function obtener_proximo_numero_judicial_detalle(){
    $query = "call sp_Seleccionarproximonumerodetallejudicial(
      :prproceso,
      :prdocumento,
      :prprocesodetalle
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prdocumento", $this->tipo_documento);
    $result->bindParam(":prprocesodetalle", $this->id_proceso_detalle);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->tipo_documento=htmlspecialchars(strip_tags($this->tipo_documento));
    $this->id_proceso_detalle=htmlspecialchars(strip_tags($this->id_proceso_detalle));

    $result->execute() ;

    $row = $result->fetch(PDO::FETCH_ASSOC) ;
    
    return $row['proximo_numero'] ;
  }

  function create_proceso_judicial_detalle(){
    $query = "call sp_crearprocesojudicialdetalle(
      :prproceso,
      :prdocumento,
      :prfecha,
      :prtrabajador,
      :prestado,
      :prnumero,
      :prsumilla,
      :prarchivo,
      :prcomentarios,
      :prfechanotificaciondemandado,
      :prfechanotificacioncooperativa,
      :prfechanotificacionretorno
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prdocumento", $this->tipo_documento);
    $result->bindParam(":prfecha", $this->fecha);
    $result->bindParam(":prtrabajador", $this->trabajador);
    $result->bindParam(":prestado", $this->id_estado);
    $result->bindParam(":prnumero", $this->numero);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prarchivo", $this->archivo);
    $result->bindParam(":prcomentarios", $this->comentarios);
    $result->bindParam(":prfechanotificaciondemandado", $this->fecha_notificacion_demandado);
    $result->bindParam(":prfechanotificacioncooperativa", $this->fecha_notificacion_cooperativa);
    $result->bindParam(":prfechanotificacionretorno", $this->fecha_notificacion_retorno);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->tipo_documento=htmlspecialchars(strip_tags($this->tipo_documento));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));
    $this->trabajador=htmlspecialchars(strip_tags($this->trabajador));
    $this->id_estado=htmlspecialchars(strip_tags($this->id_estado));
    $this->numero=htmlspecialchars(strip_tags($this->numero));
    $this->sumilla=htmlspecialchars(strip_tags($this->sumilla));
    $this->archivo=htmlspecialchars(strip_tags($this->archivo));
    $this->comentarios=htmlspecialchars(strip_tags($this->comentarios));

    if($result->execute())
    {
      $row = $result->fetch(PDO::FETCH_ASSOC) ;
    
      return $row['id'] ;
      // return true;
    }
    
    return false;
  }

  function update_proceso_judicial_detalle(){
    $query = "call sp_actualizarprocesojudicialdetalle(
      :prproceso,
      :prdocumento,
      :prfecha,
      :prtrabajador,
      :prestado,
      :prnumero,
      :prsumilla,
      :prarchivo,
      :prcomentarios,
      :prfechanotificaciondemandado,
      :prfechanotificacioncooperativa,
      :prfechanotificacionretorno
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prdocumento", $this->tipo_documento);
    $result->bindParam(":prfecha", $this->fecha);
    $result->bindParam(":prtrabajador", $this->trabajador);
    $result->bindParam(":prestado", $this->id_estado);
    $result->bindParam(":prnumero", $this->numero);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prarchivo", $this->archivo);
    $result->bindParam(":prcomentarios", $this->comentarios);
    $result->bindParam(":prfechanotificaciondemandado", $this->fecha_notificacion_demandado);
    $result->bindParam(":prfechanotificacioncooperativa", $this->fecha_notificacion_cooperativa);
    $result->bindParam(":prfechanotificacionretorno", $this->fecha_notificacion_retorno);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->tipo_documento=htmlspecialchars(strip_tags($this->tipo_documento));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));
    $this->trabajador=htmlspecialchars(strip_tags($this->trabajador));
    $this->id_estado=htmlspecialchars(strip_tags($this->id_estado));
    $this->numero=htmlspecialchars(strip_tags($this->numero));
    $this->sumilla=htmlspecialchars(strip_tags($this->sumilla));
    $this->archivo=htmlspecialchars(strip_tags($this->archivo));
    $this->comentarios=htmlspecialchars(strip_tags($this->comentarios));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }
  
  function delete_proceso_judicial(){
    $query = "call sp_eliminarprocesojudicialcabecera(
      :prproceso
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function delete_proceso_judicial_detalle(){
    $query = "call sp_eliminarprocesojudicialdetalle(
      :prproceso
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function create_proceso_judicial_cronograma(){
    $query = "call sp_crearprocesocronograma(
      :prproceso,
      :prcuota,
      :prfecha
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prcuota", $this->monto_cuota);
    $result->bindParam(":prfecha", $this->fecha);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->monto_cuota=htmlspecialchars(strip_tags($this->monto_cuota));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function create_proceso_judicial_traslado(){
    $query = "call sp_crearprocesojudicialtraslado(
      :prprocesoantiguo,
      :prexpediente,
      :prinstancia,
      :prjuez,
      :prespecialista,
      :prsumilla
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prprocesoantiguo", $this->id_proceso);
    $result->bindParam(":prexpediente", $this->expediente);
    $result->bindParam(":prinstancia", $this->instancia);
    $result->bindParam(":prjuez", $this->juez);
    $result->bindParam(":prespecialista", $this->especialista);
    $result->bindParam(":prsumilla", $this->sumilla);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->expediente=htmlspecialchars(strip_tags($this->expediente));
    $this->instancia=htmlspecialchars(strip_tags($this->instancia));
    $this->juez=htmlspecialchars(strip_tags($this->juez));
    $this->especialista=htmlspecialchars(strip_tags($this->especialista));
    $this->sumilla=htmlspecialchars(strip_tags($this->sumilla));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  // Esta función obtiene lafecha más antigua de los procesos que no han sido cerrados
  function read_fecha(){
    $query ="call sp_listarprocesojudicialfecha()";
      
    $result = $this->conn->prepare($query);
    
    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $resultado = array (
      "fecha_inicio" => $row['fecha_inicio'] ,
    );

    return $resultado;
  }

  function readV2(){
    $query = "CALL sp_listarprocesojudicialV3(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->instancia);
    $result->bindParam(2, $this->expediente);
    $result->bindParam(3, $this->dni);
    $result->bindParam(4, $this->nombre);
    $result->bindParam(5, $this->fecha_inicio);
    $result->bindParam(6, $this->fecha_fin);
    $result->bindParam(7, $this->estado);
    $result->bindParam(8, $this->orden);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["procesos"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id"=>$id,
        "ultimo_documento"=>$ultimo_documento,
        "id_tipo_documento"=>$id_tipo_documento,
        "expediente"=>$expediente,
        "id_distrito"=>$id_distrito,
        "id_instancia"=>$id_instancia,
        "distrito"=>$distrito,
        "juzgado"=>$juzgado,
        "vendedor"=>$vendedor,
        "fecha_inicio"=>$fecha_inicio,
        "fecha_ultimo_documento"=>$fecha_ultimo_documento,
        "fecha_ultimo_documento_diferencia"=>$fecha_ultimo_documento_diferencia,
        "sumilla"=>$sumilla,
        "id_cliente"=>$id_cliente,
        "cliente_dni"=>$cliente_dni,
        "cliente_nombre"=>$cliente_nombre,
        "total"=>$total,
        "estado"=>$estado,
        "total_documentos"=>$total_documentos,
      );
      array_push($procesos_list["procesos"],$items);
    }
    return $procesos_list;
  }

  function readV4(){
    $query = "CALL sp_listarprocesojudicialV4(?,?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito);
    $result->bindParam(2, $this->instancia);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);
    $result->bindParam(9, $this->orden);

    $result->execute();
    
    $procesos_list=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id"=>$id,
        "ultimo_documento"=>$ultimo_documento,
        "id_tipo_documento"=>$id_tipo_documento,
        "expediente"=>$expediente,
        "id_distrito"=>$id_distrito,
        "distrito"=>$distrito,
        "id_instancia"=>$id_instancia,
        "instancia"=>$instancia,
        "vendedor"=>$vendedor,
        "fecha_inicio"=>$fecha_inicio,
        "fecha_ultimo_documento"=>$fecha_ultimo_documento,
        "fecha_ultimo_documento_diferencia"=>$fecha_ultimo_documento_diferencia,
        "sumilla"=>$sumilla,
        "id_cliente"=>$id_cliente,
        "cliente_dni"=>$cliente_dni,
        "cliente_nombre"=>$cliente_nombre,
        "total"=>$total,
        "estado"=>$estado,
        "total_documentos"=>$total_documentos,
      );
      array_push($procesos_list,$items);
    }
    return $procesos_list;
  }

  function read_procesos_instanciasV4(){
    $query = "CALL sp_listarprocesojudicialinstanciasV4(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito);
    $result->bindParam(2, $this->instancia);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);

    $result->execute();
    
    $procesos_list=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_distrito"=>$id_distrito,
        "distrito"=>$distrito,
        "id_instancia"=>$id_instancia,
        "instancia"=>$instancia,
      );
      array_push($procesos_list,$items);
    }
    return $procesos_list;
  }

  function read_procesos_distritosV4(){
    $query = "CALL sp_listarprocesojudicialdistritosV4(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito);
    $result->bindParam(2, $this->instancia);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);

    $result->execute();
    
    $procesos_list=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    $row = $result->fetchAll(PDO::FETCH_ASSOC) ;
    $result->closeCursor() ;
    foreach($row as $item)
    {
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_distrito"=>$item['id_distrito'],
        "distrito"=>$item['distrito'],
      );
      array_push($procesos_list,$items);
    }
    return $procesos_list;
  }

  function read_procesos_instancias(){
    $query = "CALL sp_listarprocesojudicialinstancias(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito_judicial);
    $result->bindParam(2, $this->instancia);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["instancias"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    $row = $result->fetchAll(PDO::FETCH_ASSOC) ;
    $result->closeCursor() ;
    
    foreach($row as $item)
    {
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_instancia"=>$item['id_instancia'],
        "instancia"=>$item['instancia'],
        "id_distrito"=>$item['id_distrito'],
        "distrito"=>$item['distrito'],
      );
      array_push($procesos_list["instancias"],$items);
    }
    return $procesos_list;
  }

  function read_procesos_instancias_contar(){
    $query = "CALL sp_listarprocesojudicialinstanciascontar(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito_judicial);
    $result->bindParam(2, $this->juzgado);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function read_procesos_distritos(){
    $query = "CALL sp_listarprocesojudicialdistritos(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito_judicial);
    $result->bindParam(2, $this->juzgado);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["distritos"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_distrito"=>$id_distrito,
        "distrito"=>$distrito,
      );
      array_push($procesos_list["distritos"],$items);
    }
    return $procesos_list;
  }

  function read_procesos_distritos_contar(){
    $query = "CALL sp_listarprocesojudicialdistritoscontar(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito_judicial);
    $result->bindParam(2, $this->juzgado);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function create_proceso_judicial_multiple(){
    $query = "call sp_crearprocesojudicialmultiple(
      :prcliente,
      :prexpediente,
      :prinstancia,
      :prjuez,
      :prespecialista,
      :prfecha,
      :prsumilla,
      :prnumerocuotas,
      :prtotal
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prcliente", $this->id_cliente);
    $result->bindParam(":prexpediente", $this->expediente);
    $result->bindParam(":prinstancia", $this->instancia);
    $result->bindParam(":prjuez", $this->juez);
    $result->bindParam(":prespecialista", $this->especialista);
    $result->bindParam(":prfecha", $this->fecha_inicio);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prnumerocuotas", $this->numero_cuotas);
    $result->bindParam(":prtotal", $this->total);

    $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
    $this->expediente=htmlspecialchars(strip_tags($this->expediente));
    $this->instancia=htmlspecialchars(strip_tags($this->instancia));
    $this->juez=htmlspecialchars(strip_tags($this->juez));
    $this->especialista=htmlspecialchars(strip_tags($this->especialista));
    $this->fecha_inicio=htmlspecialchars(strip_tags($this->fecha_inicio));
    $this->sumilla=htmlspecialchars(strip_tags($this->sumilla));
    $this->numero_cuotas=htmlspecialchars(strip_tags($this->numero_cuotas));
    $this->total=htmlspecialchars(strip_tags($this->total));

    $transacciones = json_decode( $this->transacciones ) ;

    $this->arreglo = array() ;

    if($result->execute())
    {
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $this->id_proceso=$id;
      }
      return true;
    }
    
    return false;
  }

  function create_proceso_judicial_transaccion() {
    // Tipo: 1. Préstamo, 2. Venta
    $query = "call sp_crearprocesojudicialtransacciones(
      :prproceso,
      :prtipo,
      :prtransaccion
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->proceso);
    $result->bindParam(":prtipo", $this->tipo);
    $result->bindParam(":prtransaccion", $this->transaccion);

    $this->proceso=htmlspecialchars(strip_tags($this->proceso));
    $this->tipo=htmlspecialchars(strip_tags($this->tipo));
    $this->transaccion=htmlspecialchars(strip_tags($this->transaccion));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function read_procesosxtransaccion(){
    $query = "CALL sp_listarprocesosjudicialxtransaccion(?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->tipo_transaccion);
    $result->bindParam(2, $this->id_transaccion);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["transacciones"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_proceso"=>$id_proceso,
        "expediente"=>$expediente,
        "id_tipo_documento"=>$id_tipo_documento,
        "estado"=>$estado
      );
      array_push($procesos_list["transacciones"],$items);
    }

    return $procesos_list;
  }
    
  function read_documentostransaccionxproceso() {
    $query = "CALL sp_listardocumentostransaccionxproceso(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_proceso);
    $result->execute();
    
    $documentos=array();
    $documentos["documentos"]=array();

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $items = array (
        "id_credito"=>$id_credito,
        "documento_credito"=>$documento_credito,
        "credito_tipo"=>$credito_tipo,
        "pdf_foto_credito"=>$pdf_foto_credito,
        "pdf_dni_credito"=>$pdf_dni_credito,
        "pdf_cip_credito"=>$pdf_cip_credito,
        "pdf_planilla_credito"=>$pdf_planilla_credito,
        "pdf_voucher_credito"=>$pdf_voucher_credito,
        "pdf_recibo_credito"=>$pdf_recibo_credito,
        "pdf_casilla_credito"=>$pdf_casilla_credito,
        "pdf_transaccion_credito"=>$pdf_transaccion_credito,
        "pdf_autorizacion_credito"=>$pdf_autorizacion_credito,
        "pdf_tarjeta_credito"=>$pdf_tarjeta_credito,
        "pdf_compromiso_credito"=>$pdf_compromiso_credito,
        "pdf_letra_credito"=>$pdf_letra_credito,
        "pdf_ddjj_credito"=>$pdf_ddjj_credito,
        "pdf_otros_credito"=>$pdf_otros_credito,
        "id_venta"=>$id_venta,
        "documento_venta"=>$documento_venta,
        "venta_tipo"=>$venta_tipo,
        "foto_pdf_venta"=>$foto_pdf_venta,
        "contrato_pdf_venta"=> $contrato_pdf_venta,
        "dni_pdf_venta"=>$dni_pdf_venta,
        "cip_pdf_venta"=>$cip_pdf_venta,
        "planilla_pdf_venta"=>$planilla_pdf_venta,
        "letra_pdf_venta"=>$letra_pdf_venta,
        "voucher_pdf_venta"=>$voucher_pdf_venta,
        "autorizacion_pdf_venta"=>$autorizacion_pdf_venta,
        "otros_pdf_venta"=>$otros_pdf_venta,
      );
      array_push($documentos["documentos"],$items);
    }

    return $documentos;
  }

  function verificar_procesojudicial_expediente() {
    $query = "CALL sp_listarprocesojudicialexpedientecontar(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->expediente);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function read_procesosjudicialesnotificacionxproceso(){
    $query = "CALL sp_listarprocesojudicialnotificacionxproceso(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_proceso);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["notificaciones"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_proceso_judicial_notificacion" => $id_proceso_judicial_notificacion ,
        "codigo" => $codigo ,
        "destinatario" => $destinatario ,
        "anexos" => $anexos ,
        "juzgado_fecha_resolucion" => $juzgado_fecha_resolucion ,
        "juzgado_fecha_notificacion" => $juzgado_fecha_notificacion ,
        "juzgado_fecha_envio" => $juzgado_fecha_envio ,
        "juzgado_fecha_recepcion" => $juzgado_fecha_recepcion ,
        "central_fecha_notificacion" => $central_fecha_notificacion ,
        "central_fecha_cargo" => $central_fecha_cargo ,
        "comentarios" => $comentarios ,
        "observacion" => $observacion ,
        "archivo" => $archivo
      );
      array_push($procesos_list["notificaciones"],$items);
    }

    return $procesos_list;
  }

  function read_procesosjudicialesnotificacionxproceso_parametros($proceso){
    $query = "CALL sp_listarprocesojudicialnotificacionxproceso(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $proceso);

    $result->execute();
    
    $procesos_list=array();

    $contador = 0;
    
    $row = $result->fetchAll(PDO::FETCH_ASSOC);
    $result->closeCursor() ;
    foreach($row as $item)
    {
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_proceso_judicial_notificacion" => $item['id_proceso_judicial_notificacion'] ,
        "codigo" => $item['codigo'] ,
        "destinatario" => $item['destinatario'] ,
        "anexos" => $item['anexos'] ,
        "juzgado_fecha_resolucion" => $item['juzgado_fecha_resolucion'] ,
        "juzgado_fecha_notificacion" => $item['juzgado_fecha_notificacion'] ,
        "juzgado_fecha_envio" => $item['juzgado_fecha_envio'] ,
        "juzgado_fecha_recepcion" => $item['juzgado_fecha_recepcion'] ,
        "central_fecha_notificacion" => $item['central_fecha_notificacion'] ,
        "central_fecha_cargo" => $item['central_fecha_cargo'] ,
        "comentarios" => $item['comentarios'] ,
        "observacion" => $item['observacion'] ,
        "archivo" => $item['archivo']
      );
      array_push($procesos_list,$items);
    }

    return $procesos_list;
  }

  function create_proceso_judicial_notificacion() {
    $query = "call sp_crearprocesojudicialnotificacion(
      :prproceso ,
      :prcodigo ,
      :prdestinatario ,
      :pranexos ,
      :prjuzgado_fecha_resolucion ,
      :prjuzgado_fecha_notificacion ,
      :prjuzgado_fecha_envio ,
      :prjuzgado_fecha_recepcion ,
      :prcentral_fecha_notificacion ,
      :prcentral_fecha_cargo ,
      :prcomentarios ,
      :probservacion ,
      :prarchivo
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso ) ;
    $result->bindParam(":prcodigo", $this->codigo ) ;
    $result->bindParam(":prdestinatario", $this->destinatario ) ;
    $result->bindParam(":pranexos", $this->anexos ) ;
    $result->bindParam(":prjuzgado_fecha_resolucion", $this->juzgado_fecha_resolucion ) ;
    $result->bindParam(":prjuzgado_fecha_notificacion", $this->juzgado_fecha_notificacion ) ;
    $result->bindParam(":prjuzgado_fecha_envio", $this->juzgado_fecha_envio ) ;
    $result->bindParam(":prjuzgado_fecha_recepcion", $this->juzgado_fecha_recepcion ) ;
    $result->bindParam(":prcentral_fecha_notificacion", $this->central_fecha_notificacion ) ;
    $result->bindParam(":prcentral_fecha_cargo", $this->central_fecha_cargo ) ;
    $result->bindParam(":prcomentarios", $this->comentarios ) ;
    $result->bindParam(":probservacion", $this->observacion ) ;
    $result->bindParam(":prarchivo", $this->archivo ) ;

    $this->id_proceso = htmlspecialchars(strip_tags($this->id_proceso)) ;
    $this->codigo = htmlspecialchars(strip_tags($this->codigo)) ;
    $this->destinatario = htmlspecialchars(strip_tags($this->destinatario)) ;
    $this->anexos = htmlspecialchars(strip_tags($this->anexos)) ;

    $this->juzgado_fecha_resolucion == "0" ? $this->juzgado_fecha_resolucion = null : null ;
    $this->juzgado_fecha_notificacion == "0" ? $this->juzgado_fecha_notificacion = null : null ;
    $this->juzgado_fecha_envio == "0" ? $this->juzgado_fecha_envio = null : null ;
    $this->juzgado_fecha_recepcion == "0" ? $this->juzgado_fecha_recepcion = null : null ;
    $this->central_fecha_notificacion == "0" ? $this->central_fecha_notificacion = null : null ;
    $this->central_fecha_cargo == "0" ? $this->central_fecha_cargo = null : null ;

    $this->comentarios = htmlspecialchars(strip_tags($this->comentarios)) ;
    $this->observacion = htmlspecialchars(strip_tags($this->observacion)) ;
    $this->archivo = htmlspecialchars(strip_tags($this->archivo)) ;

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function update_proceso_judicial_notificacion() {
    $query = "call sp_actualizarprocesojudicialnotificacion(
      :prprocesojudicialnotificacion ,
      :prcodigo ,
      :prdestinatario ,
      :pranexos ,
      :prjuzgado_fecha_resolucion ,
      :prjuzgado_fecha_notificacion ,
      :prjuzgado_fecha_envio ,
      :prjuzgado_fecha_recepcion ,
      :prcentral_fecha_notificacion ,
      :prcentral_fecha_cargo ,
      :prcomentarios ,
      :probservacion ,
      :prarchivo
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prprocesojudicialnotificacion", $this->id_proceso_notificacion ) ;
    $result->bindParam(":prcodigo", $this->codigo ) ;
    $result->bindParam(":prdestinatario", $this->destinatario ) ;
    $result->bindParam(":pranexos", $this->anexos ) ;
    $result->bindParam(":prjuzgado_fecha_resolucion", $this->juzgado_fecha_resolucion ) ;
    $result->bindParam(":prjuzgado_fecha_notificacion", $this->juzgado_fecha_notificacion ) ;
    $result->bindParam(":prjuzgado_fecha_envio", $this->juzgado_fecha_envio ) ;
    $result->bindParam(":prjuzgado_fecha_recepcion", $this->juzgado_fecha_recepcion ) ;
    $result->bindParam(":prcentral_fecha_notificacion", $this->central_fecha_notificacion ) ;
    $result->bindParam(":prcentral_fecha_cargo", $this->central_fecha_cargo ) ;
    $result->bindParam(":prcomentarios", $this->comentarios ) ;
    $result->bindParam(":probservacion", $this->observacion ) ;
    $result->bindParam(":prarchivo", $this->archivo ) ;

    $this->id_proceso_notificacion = htmlspecialchars(strip_tags($this->id_proceso_notificacion)) ;
    $this->codigo = htmlspecialchars(strip_tags($this->codigo)) ;
    $this->destinatario = htmlspecialchars(strip_tags($this->destinatario)) ;
    $this->anexos = htmlspecialchars(strip_tags($this->anexos)) ;

    $this->juzgado_fecha_resolucion == "0" ? $this->juzgado_fecha_resolucion = null : null ;
    $this->juzgado_fecha_notificacion == "0" ? $this->juzgado_fecha_notificacion = null : null ;
    $this->juzgado_fecha_envio == "0" ? $this->juzgado_fecha_envio = null : null ;
    $this->juzgado_fecha_recepcion == "0" ? $this->juzgado_fecha_recepcion = null : null ;
    $this->central_fecha_notificacion == "0" ? $this->central_fecha_notificacion = null : null ;
    $this->central_fecha_cargo == "0" ? $this->central_fecha_cargo = null : null ;
    
    $this->comentarios = htmlspecialchars(strip_tags($this->comentarios)) ;
    $this->observacion = htmlspecialchars(strip_tags($this->observacion)) ;
    $this->archivo = htmlspecialchars(strip_tags($this->archivo)) ;

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function delete_proceso_judicial_notificacion() {
    $query = "call sp_eliminarprocesojudicialnotificacion(
      :prprocesojudicialnotificacion
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prprocesojudicialnotificacion", $this->id_proceso_notificacion ) ;
    
    $this->id_proceso_notificacion = htmlspecialchars(strip_tags($this->id_proceso_notificacion)) ;
    
    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function update_proceso_judicial_devolucion_anexos() {
    $query = "call sp_actualizarprocesojudicialdevolucionanexos(
      :prproceso ,
      :prfecha ,
      :prcomentarios ,
      :prcarchivo
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso ) ;
    $result->bindParam(":prfecha", $this->fecha ) ;
    $result->bindParam(":prcomentarios", $this->comentarios ) ;
    $result->bindParam(":prcarchivo", $this->archivo ) ;

    $this->id_proceso = htmlspecialchars(strip_tags($this->id_proceso)) ;
    $this->fecha = htmlspecialchars(strip_tags($this->fecha)) ;
    $this->comentarios = htmlspecialchars(strip_tags($this->comentarios)) ;
    $this->archivo = htmlspecialchars(strip_tags($this->archivo)) ;

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function readV4_unlimited() {

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    $query = "CALL sp_listarprocesojudicialunlimitedV4(?,?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->distrito);
    $result->bindParam(2, $this->instancia);
    $result->bindParam(3, $this->expediente);
    $result->bindParam(4, $this->dni);
    $result->bindParam(5, $this->nombre);
    $result->bindParam(6, $this->fecha_inicio);
    $result->bindParam(7, $this->fecha_fin);
    $result->bindParam(8, $this->estado);
    $result->bindParam(9, $this->orden);
    
    $result->execute();

    $archivo = "" ;

    $contador = 0;

    $sheet->setCellValue('A1', 'Contador');
    $sheet->setCellValue('B1', 'Expediente');
    $sheet->setCellValue('C1', 'Distrito');
    $sheet->setCellValue('D1', 'Instancia');
    $sheet->setCellValue('E1', 'Cliente');
    $sheet->setCellValue('F1', 'DNI');
    $sheet->setCellValue('G1', 'CIP');
    $sheet->setCellValue('H1', 'Sede');
    $sheet->setCellValue('I1', 'Situacion');
    $sheet->setCellValue('J1', 'Fecha de inicio');
    $sheet->setCellValue('K1', 'Sumilla');
    $sheet->setCellValue('L1', 'Total');
    $sheet->setCellValue('M1', 'Juez');
    $sheet->setCellValue('N1', 'Especialista');
    $sheet->setCellValue('O1', 'Abogado');
    $sheet->setCellValue('P1', 'Fecha del ultimo documento');
    $sheet->setCellValue('Q1', 'Diferencia de dias respecto al ultimo documento');
    $sheet->setCellValue('R1', 'Total de documentos');
    $sheet->setCellValue('S1', 'Ultimo documento');

    $row = $result->fetchAll(PDO::FETCH_ASSOC);
    $result->closeCursor();
    foreach( $row as $item )
    {
        extract($row);
        $contador=$contador+1;

        $sheet->setCellValue('A' . $contador, $contador );
        $sheet->setCellValue('B' . $contador, $item['expediente'] );
        $sheet->setCellValue('C' . $contador, $item['distrito'] );
        $sheet->setCellValue('D' . $contador, $item['instancia'] );
        $sheet->setCellValue('E' . $contador, $item['cliente_nombre'] );
        $sheet->setCellValue('F' . $contador, $item['cliente_dni'] );
        $sheet->setCellValue('G' . $contador, $item['cip'] );
        $sheet->setCellValue('H' . $contador, $item['sede'] );
        $sheet->setCellValue('I' . $contador, $item['situacion'] );
        $sheet->setCellValue('J' . $contador, $item['fecha_inicio'] );
        $sheet->setCellValue('K' . $contador, $item['sumilla'] );
        $sheet->setCellValue('L' . $contador, $item['total'] );
        $sheet->setCellValue('M' . $contador, $item['juez'] );
        $sheet->setCellValue('N' . $contador, $item['especialista'] );
        $sheet->setCellValue('O' . $contador, $item['vendedor'] );
        $sheet->setCellValue('P' . $contador, $item['fecha_ultimo_documento'] );
        $sheet->setCellValue('Q' . $contador, $item['fecha_ultimo_documento_diferencia'] );
        $sheet->setCellValue('R' . $contador, $item['total_documentos'] );
        $sheet->setCellValue('S' . $contador, $item['ultimo_documento'] . " " . $item['numero_ultimo_documento'] );
    }

    $writer = new Xlsx($spreadsheet);

    $archivo = $this->path_reporte.$this->archivo.'.xlsx';

    $writer->save($archivo);
    
    if( file_exists ( $archivo ) ){
      return $archivo;
    } else {
      return false;
    };
}

}
?>