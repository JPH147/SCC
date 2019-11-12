<?php

Class Proceso{

  private $conn;
  
  public $id_proceso ;
  public $id_venta ;
  public $id_credito ;
  public $expediente ;
  public $juzgado ;
  public $tipo_documento ;
  public $numero ;
  public $sumilla ;
  public $archivo ;
  public $comentarios ;
  public $dni ;
  public $nombre ;
  public $fecha ;
  public $fecha_inicio ;
  public $fecha_fin ;
  public $monto_cuota ;
  public $numero_cuotas ;
  public $total ;
  public $estado ;
  public $numero_pagina ;
  public $total_pagina ;
  public $orden ;

  public function __construct($db){
    $this->conn = $db;
  }

  function read(){
    // $query = "call sp_listarprocesojudicial(?,?,?,?,?,?,?,1,10,'id asc')";
    $query = "CALL sp_listarprocesojudicial(?,?,?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->expediente);
    $result->bindParam(2, $this->juzgado);
    $result->bindParam(3, $this->dni);
    $result->bindParam(4, $this->nombre);
    $result->bindParam(5, $this->fecha_inicio);
    $result->bindParam(6, $this->fecha_fin);
    $result->bindParam(7, $this->estado);
    $result->bindParam(8, $this->numero_pagina);
    $result->bindParam(9, $this->total_pagina);
    $result->bindParam(10, $this->orden);

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
        "juzgado"=>$juzgado,
        "fecha_inicio"=>$fecha_inicio,
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

    $query = "CALL sp_listarprocesojudicialcontar(?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->expediente);
    $result->bindParam(2, $this->juzgado);
    $result->bindParam(3, $this->dni);
    $result->bindParam(4, $this->nombre);
    $result->bindParam(5, $this->fecha_inicio);
    $result->bindParam(6, $this->fecha_fin);
    $result->bindParam(7, $this->estado);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function readxId(){

    $query ="call sp_listarprocesojudicialxId(?)";
      
    $result = $this->conn->prepare($query);
    
    $result->bindParam(1, $this->id_proceso);

    // $Detalle = $this->read_cobranza_detallexdirecta($this->id_proceso);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $resultado = array (
      "id" => $row['id'] ,
      "expediente" => $row['expediente'] ,
      "juzgado" => $row['juzgado'] ,
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
      // "detalle" => $Detalle
    );

    return $resultado;
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
          "tipo_documento"=>$tipo_documento,
          "fecha"=>$fecha,
          "numero"=>$numero,
          "sumilla"=>$sumilla,
          "archivo"=>$archivo,
          "comentarios"=>$comentarios
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
      :prjuzgado,
      :prfecha,
      :prsumilla,
      :prnumerocuotas,
      :prtotal
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prventa", $this->id_venta);
    $result->bindParam(":prcredito", $this->id_credito);
    $result->bindParam(":prexpediente", $this->expediente);
    $result->bindParam(":prjuzgado", $this->juzgado);
    $result->bindParam(":prfecha", $this->fecha_inicio);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prnumerocuotas", $this->numero_cuotas);
    $result->bindParam(":prtotal", $this->total);

    $this->id_venta=htmlspecialchars(strip_tags($this->id_venta));
    $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
    $this->expediente=htmlspecialchars(strip_tags($this->expediente));
    $this->juzgado=htmlspecialchars(strip_tags($this->juzgado));
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
      :prjuzgado,
      :prfecha,
      :prsumilla,
      :prnumerocuotas,
      :prtotal
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prexpediente", $this->expediente);
    $result->bindParam(":prjuzgado", $this->juzgado);
    $result->bindParam(":prfecha", $this->fecha_inicio);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prnumerocuotas", $this->numero_cuotas);
    $result->bindParam(":prtotal", $this->total);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->expediente=htmlspecialchars(strip_tags($this->expediente));
    $this->juzgado=htmlspecialchars(strip_tags($this->juzgado));
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

  function create_proceso_judicial_detalle(){
    $query = "call sp_crearprocesojudicialdetalle(
      :prproceso,
      :prdocumento,
      :prfecha,
      :prnumero,
      :prsumilla,
      :prarchivo,
      :prcomentarios
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prdocumento", $this->tipo_documento);
    $result->bindParam(":prfecha", $this->fecha);
    $result->bindParam(":prnumero", $this->numero);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prarchivo", $this->archivo);
    $result->bindParam(":prcomentarios", $this->comentarios);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->tipo_documento=htmlspecialchars(strip_tags($this->tipo_documento));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));
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

  function update_proceso_judicial_detalle(){
    $query = "call sp_actualizarprocesojudicialdetalle(
      :prproceso,
      :prdocumento,
      :prfecha,
      :prnumero,
      :prsumilla,
      :prarchivo,
      :prcomentarios
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_proceso);
    $result->bindParam(":prdocumento", $this->tipo_documento);
    $result->bindParam(":prfecha", $this->fecha);
    $result->bindParam(":prnumero", $this->numero);
    $result->bindParam(":prsumilla", $this->sumilla);
    $result->bindParam(":prarchivo", $this->archivo);
    $result->bindParam(":prcomentarios", $this->comentarios);

    $this->id_proceso=htmlspecialchars(strip_tags($this->id_proceso));
    $this->tipo_documento=htmlspecialchars(strip_tags($this->tipo_documento));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));
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

}
?>