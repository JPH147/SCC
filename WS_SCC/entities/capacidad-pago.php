<?php

  Class Capacidad{

    private $conn;
    private $table_name = "cliente";

    public $id_cliente;
    public $monto;
    public $tipo;
    public $fecha;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
      $query = "CALL sp_listarcapacidadpago (?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->id_cliente);

      $result->execute();
      
      $capacidad_list=array();
      $capacidad_list["montos"]=array();
      $contador = 0;

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $capacidad_item = array (
          "monto"=>$row['monto'],
          "tipo"=>$row['tipo'],
          "fecha"=>$row['fecha'],
        );

        array_push($capacidad_list["montos"],$capacidad_item);

      }
      return $capacidad_list;
    }


    function create(){

      $query = "CALL sp_crearcapacidadpago(:id_cliente,:monto,:tipo,:fecha)"; 

      $result = $this->conn->prepare($query);

          $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
          $this->monto=htmlspecialchars(strip_tags($this->monto));
          $this->tipo=htmlspecialchars(strip_tags($this->tipo));
          $this->fecha=htmlspecialchars(strip_tags($this->fecha));

          $result->bindParam(":id_cliente", $this->id_cliente);
          $result->bindParam(":monto", $this->monto);
          $result->bindParam(":tipo", $this->tipo);
          $result->bindParam(":fecha", $this->fecha);          

          if($result->execute())
          {
            return true;
          }
          
          return false;
      }

  function delete(){

    $query = "CALL sp_eliminarcapacidadpago(:id_cliente,:fecha)"; 

    $result = $this->conn->prepare($query);

    $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
    $this->fecha=htmlspecialchars(strip_tags($this->fecha));

    $result->bindParam(":id_cliente", $this->id_cliente);
    $result->bindParam(":fecha", $this->fecha);          

    if($result->execute())
    {
      return true;
    }
    return false;
  }

}

?>