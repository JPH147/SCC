<?php

Class ClienteObservacion{

  private $conn;
  private $table_name = "cliente_observacion";

  public $idcliente_direccion;
  public $id_cliente;
  public $id_observacion;
  public $clt_nombre;
  public $observacion;
  public $fecha;
  public $archivo;
  public $pagina;
  public $totalpagina;

  public function __construct($db){
    $this->conn = $db;
  }

  function create(){
    $query = "CALL sp_crearclienteobservacion(
        :prcliente,
        :prfecha,
        :probservacion,
        :prarchivo
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prcliente", $this->id_cliente);
    $result->bindParam(":prfecha", $this->fecha);
    $result->bindParam(":probservacion", $this->observacion);
    $result->bindParam(":prarchivo", $this->archivo);

    $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));
    $this->observacion=htmlspecialchars(strip_tags($this->observacion));
    $this->archivo=htmlspecialchars(strip_tags($this->archivo));

    if($result->execute())
    {
        return true;
    }
    return false;
  }

  function delete(){
    $query = "CALL sp_eliminarclienteobservacion(:id_observacion)";

    $result = $this->conn->prepare($query);

    $result->bindParam(":id_observacion", $this->id_observacion);

    $this->id_observacion=htmlspecialchars(strip_tags($this->id_observacion));

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function read() {
    $query = "CALL sp_listarclienteobservacion(:id_cliente, :pagina_inicio, :total_pagina)";

    $result = $this->conn->prepare($query);

    $result->bindParam(":id_cliente", $this->id_cliente);
    $result->bindParam(":pagina_inicio", $this->pagina);
    $result->bindParam(":total_pagina", $this->totalpagina);

    $result->execute();
    $observacion_list=array();
    $observacion_list["observaciones"]=array();
    $contador = 0;

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
        $contador=$contador+1;
        $observacion_item = array (
            "numero"=>$contador,
            "id"=>$row['id'],
            "observacion"=>$row['observacion'],
            "archivo"=>$row['archivo'],
            "fecha"=>$row['fecha'],
        );

        array_push($observacion_list["observaciones"],$observacion_item);
    }
    return $observacion_list;
  }

  function contar(){
    $query = "CALL sp_listarclienteobservacioncontar(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_cliente);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }
}
?>