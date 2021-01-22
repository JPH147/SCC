<?php

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
          "fecha_creacion"=>$fecha_creacion,
          "usuario_creacion"=>$usuario_creacion,
          "fecha_edicion"=>$fecha_edicion,
          "usuario_edicion"=>$usuario_edicion,
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
          "numero"=>$numero,
          "sumilla"=>$sumilla,
          "archivo"=>$archivo,
          "comentarios"=>$comentarios,
          "fecha_creacion"=>$fecha_creacion,
          "usuario_creacion"=>$usuario_creacion,
          "fecha_edicion"=>$fecha_edicion,
          "usuario_edicion"=>$usuario_edicion,
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
      :prcomentarios
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
      :prcomentarios
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

  function read_procesos_instancias(){
    $query = "CALL sp_listarprocesojudicialinstancias(?,?,?,?,?,?,?,?)";

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
    $procesos_list["instancias"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id_instancia"=>$id_instancia,
        "instancia"=>$instancia,
        "id_distrito"=>$id_distrito,
        "distrito"=>$distrito,
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
}
?>