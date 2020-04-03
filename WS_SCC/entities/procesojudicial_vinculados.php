<?php

Class ProcesoVinculados{

  private $conn;
  
  public $id_proceso_estado ;
  public $id_distrito_juzgado ;
  public $id_instancia_juzgado ;
  public $id_proceso_documento ;
  public $proceso_documento ;
  public $instancia_juzgado ;
  public $distrito_juzgado ;
  public $tipo_juez ;
  public $juzgado_juez ;
  public $nombre ;
  public $numero_pagina ;
  public $total_pagina ;
  
  public function __construct($db){
    $this->conn = $db;
  }

  function read_documentos(){
    $query = "CALL sp_listarprocesojudicialdocumentos(?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->nombre);
    $result->bindParam(2, $this->numero_pagina);
    $result->bindParam(3, $this->total_pagina);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["documentos"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id"=>$id,
        "nombre"=>$nombre,
      );
      array_push($procesos_list["documentos"],$items);
    }
    return $procesos_list;
  }

  function contar_documentos(){

    $query = "CALL sp_listarprocesojudicialdocumentoscontar(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->nombre);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function read_distrito_activo(){
    $query = "CALL sp_listarjuzgadodistritoactivo(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->nombre);
    
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
        "id"=>$id,
        "nombre"=>$nombre,
      );
      array_push($procesos_list["distritos"],$items);
    }
    return $procesos_list;
  }

  function read_distrito(){
    $query = "CALL sp_listarjuzgadodistrito(?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->nombre);
    $result->bindParam(2, $this->numero_pagina);
    $result->bindParam(3, $this->total_pagina);

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
        "id"=>$id,
        "nombre"=>$nombre,
      );
      array_push($procesos_list["distritos"],$items);
    }
    return $procesos_list;
  }

  function contar_distrito(){

    $query = "CALL sp_listarjuzgadodistritocontar(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->nombre);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function create_distrito_juzgado(){
    $query = "call sp_crearjuzgadodistrito(
      :prnombre
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prnombre", $this->nombre);

    $this->nombre=htmlspecialchars(strip_tags($this->nombre));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function update_distrito_juzgado(){
    $query = "call sp_actualizarjuzgadodistrito(
      :prproceso,
      :prnombre
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prproceso", $this->id_distrito_juzgado);
    $result->bindParam(":prnombre", $this->nombre);

    $this->id_distrito_juzgado=htmlspecialchars(strip_tags($this->id_distrito_juzgado));
    $this->nombre=htmlspecialchars(strip_tags($this->nombre));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function delete_distrito_juzgado(){
    $query = "call sp_eliminarjuzgadodistrito(
      :prdistritojuzgado
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prdistritojuzgado", $this->id_distrito_juzgado);

    $this->id_distrito_juzgado=htmlspecialchars(strip_tags($this->id_distrito_juzgado));

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function read_instancia(){
    $query = "CALL sp_listarjuzgadoinstancia(?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_distrito_juzgado);
    $result->bindParam(2, $this->distrito_juzgado);
    $result->bindParam(3, $this->instancia_juzgado);
    $result->bindParam(4, $this->numero_pagina);
    $result->bindParam(5, $this->total_pagina);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["instancias"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador ,
        "id_juzgado_instancia"=>$id_juzgado_instancia ,
        "id_juzgado_distrito"=>$id_juzgado_distrito ,
        "juzgado_distrito"=>$juzgado_distrito ,
        "juzgado_instancia"=>$juzgado_instancia ,
      );
      array_push($procesos_list["instancias"],$items);
    }
    return $procesos_list;
  }

  function contar_instancia(){

    $query = "CALL sp_listarjuzgadoinstanciacontar(?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_distrito_juzgado);
    $result->bindParam(2, $this->distrito_juzgado);
    $result->bindParam(3, $this->instancia_juzgado);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function create_instancia_juzgado(){
    $query = "call sp_crearjuzgadoinstancia(
      :prdistritojuzgado,
      :prinstanciajuzgado
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prdistritojuzgado", $this->id_distrito_juzgado);
    $result->bindParam(":prinstanciajuzgado", $this->instancia_juzgado);

    $this->id_distrito_juzgado=htmlspecialchars(strip_tags($this->id_distrito_juzgado));
    $this->instancia_juzgado=htmlspecialchars(strip_tags($this->instancia_juzgado));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function update_instancia_juzgado(){
    $query = "call sp_actualizarjuzgadoinstancia(
      :prid,
      :prdistritojuzgado,
      :prinstanciajuzgado
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prid", $this->id_instancia_juzgado);
    $result->bindParam(":prdistritojuzgado", $this->id_distrito_juzgado);
    $result->bindParam(":prinstanciajuzgado", $this->instancia_juzgado);

    $this->id_instancia_juzgado=htmlspecialchars(strip_tags($this->id_instancia_juzgado));
    $this->id_distrito_juzgado=htmlspecialchars(strip_tags($this->id_distrito_juzgado));
    $this->instancia_juzgado=htmlspecialchars(strip_tags($this->instancia_juzgado));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function delete_instancia_juzgado(){
    $query = "call sp_eliminarjuzgadoinstancia(
      :prinstanciajuzgado
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prinstanciajuzgado", $this->id_instancia_juzgado);

    $this->id_instancia_juzgado=htmlspecialchars(strip_tags($this->id_instancia_juzgado));

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function read_estado(){
    $query = "CALL sp_listarprocesojudicialestado(?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_proceso_documento);
    $result->bindParam(2, $this->proceso_documento);
    $result->bindParam(3, $this->nombre);
    $result->bindParam(4, $this->numero_pagina);
    $result->bindParam(5, $this->total_pagina);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["estados"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador,
        "id"=>$id,
        "nombre"=>$nombre,
        "id_documento"=>$id_documento,
        "documento"=>$documento,
      );
      array_push($procesos_list["estados"],$items);
    }
    return $procesos_list;
  }

  function contar_estado(){
    $query = "CALL sp_listarprocesojudicialestadocontar(?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_proceso_documento);
    $result->bindParam(2, $this->proceso_documento);
    $result->bindParam(3, $this->nombre);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function create_estado(){
    $query = "call sp_crearprocesojudicialestado(
      :prdocumento ,
      :prnombre
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prdocumento", $this->id_proceso_documento);
    $result->bindParam(":prnombre", $this->nombre);

    $this->id_proceso_documento=htmlspecialchars(strip_tags($this->id_proceso_documento));
    $this->nombre=htmlspecialchars(strip_tags($this->nombre));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function update_estado(){
    $query = "call sp_actualizarprocesojudicialestado(
      :prestado,
      :prdocumento,
      :prnombre
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prestado", $this->id_proceso_estado);
    $result->bindParam(":prdocumento", $this->id_proceso_documento);
    $result->bindParam(":prnombre", $this->nombre);
    
    $this->id_proceso_estado=htmlspecialchars(strip_tags($this->id_proceso_estado));
    $this->id_proceso_documento=htmlspecialchars(strip_tags($this->id_proceso_documento));
    $this->nombre=htmlspecialchars(strip_tags($this->nombre));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function delete_estado(){
    $query = "call sp_eliminarprocesojudicialestado(
      :prestado
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prestado", $this->id_proceso_estado);

    $this->id_proceso_estado=htmlspecialchars(strip_tags($this->id_proceso_estado));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function read_juez(){
    $query = "CALL sp_listarjuzgadojuez(?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_instancia_juzgado);
    $result->bindParam(2, $this->distrito_juzgado);
    $result->bindParam(3, $this->instancia_juzgado);
    $result->bindParam(4, $this->tipo_juez);
    $result->bindParam(5, $this->instancia_juez);
    $result->bindParam(6, $this->numero_pagina);
    $result->bindParam(7, $this->total_pagina);

    $result->execute();
    
    $procesos_list=array();
    $procesos_list["jueces"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);
    
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador=$contador+1;
      $items = array (
        "numero"=>$contador ,
        "id_juzgado_juez"=>$id_juzgado_juez ,
        "id_juzgado_distrito"=>$id_juzgado_distrito ,
        "id_juzgado_instancia"=>$id_juzgado_instancia ,
        "id_tipo"=>$id_tipo ,
        "tipo"=>$tipo ,
        "juzgado_distrito"=>$juzgado_distrito ,
        "juzgado_instancia"=>$juzgado_instancia ,
        "juzgado_juez"=>$juzgado_juez ,
      );
      array_push($procesos_list["jueces"],$items);
    }
    return $procesos_list;
  }

  function contar_juez(){
    $query = "CALL sp_listarjuzgadojuezcontar(?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_instancia_juzgado);
    $result->bindParam(2, $this->distrito_juzgado);
    $result->bindParam(3, $this->instancia_juzgado);
    $result->bindParam(4, $this->tipo_juez);
    $result->bindParam(5, $this->instancia_juez);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function create_juzgado_juez(){
    $query = "call sp_crearjuzgadojuez(
      :prdistritojuzgado,
      :prtipojuez,
      :prjuzgadojuez
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prdistritojuzgado", $this->id_distrito_juzgado);
    $result->bindParam(":prtipojuez", $this->tipo_juez);
    $result->bindParam(":prjuzgadojuez", $this->juzgado_juez);

    $this->id_distrito_juzgado=htmlspecialchars(strip_tags($this->id_distrito_juzgado));
    $this->tipo_juez=htmlspecialchars(strip_tags($this->tipo_juez));
    $this->juzgado_juez=htmlspecialchars(strip_tags($this->juzgado_juez));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function update_juzgado_juez(){
    $query = "call sp_actualizarjuzgadojuez(
      :prid,
      :prdistritojuzgado,
      :prtipojuez,
      :prjuzgadojuez
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prid", $this->id_instancia_juzgado);
    $result->bindParam(":prdistritojuzgado", $this->id_distrito_juzgado);
    $result->bindParam(":prtipojuez", $this->tipo_juez);
    $result->bindParam(":prjuzgadojuez", $this->juzgado_juez);

    $this->id_instancia_juzgado=htmlspecialchars(strip_tags($this->id_instancia_juzgado));
    $this->id_distrito_juzgado=htmlspecialchars(strip_tags($this->id_distrito_juzgado));
    $this->tipo_juez=htmlspecialchars(strip_tags($this->tipo_juez));
    $this->juzgado_juez=htmlspecialchars(strip_tags($this->juzgado_juez));

    if($result->execute())
    {
      return true;
    }
    
    return false;
  }

  function delete_juzgado_juez(){
    $query = "call sp_eliminarjuzgadojuez(
      :prjuzgadojuez
    )";

    $result = $this->conn->prepare($query);

    $result->bindParam(":prjuzgadojuez", $this->juzgado_juez);

    $this->juzgado_juez=htmlspecialchars(strip_tags($this->juzgado_juez));

    if($result->execute())
    {
      return true;
    }
    return false;
  }
}
?>