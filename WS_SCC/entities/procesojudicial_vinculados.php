<?php

Class ProcesoVinculados{

  private $conn;
  
  public $id_distrito_juzgado ;
  public $id_instancia_juzgado ;
  public $instancia_juzgado ;
  public $distrito_juzgado ;
  public $nombre ;
  public $numero_pagina ;
  public $total_pagina ;

  public function __construct($db){
    $this->conn = $db;
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
}
?>