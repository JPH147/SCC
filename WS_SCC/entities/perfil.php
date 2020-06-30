<?php
Class Perfil{

  private $conn;

  public $id_perfil ;
  public $nombre ;
  public $resumen ;
  public $permisos ;
  public $numero_pagina ;
  public $total_pagina ;

  public function __construct($db){
    $this->conn = $db;
  }

  function read(){
    $query = "CALL sp_listarperfil(?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->nombre);
    $result->bindParam(2, $this->numero_pagina);
    $result->bindParam(3, $this->total_pagina);

    $result->execute();

    $perfil_list=array();
    $perfil_list["perfiles"]=array();
    $contador = $this->total_pagina*($this->numero_pagina-1);

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
        $contador=$contador+1;
        $perfil_item = array (
            "numero"=>$contador,
            "id_perfil"=>$row['id_perfil'],
            "nombre"=>$row['nombre'],
            "categoria"=>$row['categoria'],
        );

          array_push($perfil_list["perfiles"],$perfil_item);
    }
    return $perfil_list;
  }

  function contar(){
    $query = "CALL sp_listarperfilcontar(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->nombre);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

  function update() {
    $query = "CALL sp_actualizarperfil(
      :prid ,
      :prnombre ,
      :prresumen ,
      :prpermisos
    )";
    $result = $this->conn->prepare($query);

    $this->id_perfil=htmlspecialchars(strip_tags($this->id_perfil));
    $this->nombre=htmlspecialchars(strip_tags($this->nombre));
    $this->resumen=htmlspecialchars(strip_tags($this->resumen));
    // $this->permisos=htmlspecialchars(strip_tags($this->permisos));

    $result->bindParam(":prid", $this->id_perfil);
    $result->bindParam(":prnombre", $this->nombre);
    $result->bindParam(":prresumen", $this->resumen);
    $result->bindParam(":prpermisos", $this->permisos);

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function create() {
    $query = "CALL sp_crearperfil(
      :prnombre ,
      :prresumen ,
      :prpermisos
    )";
    $result = $this->conn->prepare($query);

    $this->nombre=htmlspecialchars(strip_tags($this->nombre));
    $this->resumen=htmlspecialchars(strip_tags($this->resumen));
    // $this->permisos=htmlspecialchars(strip_tags($this->permisos));

    $result->bindParam(":prnombre", $this->nombre);
    $result->bindParam(":prresumen", $this->resumen);
    $result->bindParam(":prpermisos", $this->permisos);

    if($result->execute())
    {
      return true;
    }
    return false;
  }

  function readxId() {
    $query ="CALL sp_listarperfilxId(?)";
    
    $result = $this->conn->prepare($query);
    
    $result->bindParam(1, $this->id_perfil);

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);
    $this->nombre=$row['nombre'];
    $this->permisos=$row['permisos'];
  }

  function delete(){
    $query = "call sp_eliminarperfil(?)";
    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_perfil);

    if($result->execute())
    {
        return true;
    }
    else
    {
        return false;
    }
}
}
?>