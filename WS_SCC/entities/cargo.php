<?php
  Class Cargo{

    private $conn;
    private $table_name = "cliente";

    public $id_sede;
    public $id_cargo;
    public $total_resultado;
    public $institucion;
    public $sede;
    public $nombre;
    public $cargo;
    public $cargo_estado;
    public $pagina;
    public $totalpagina;

    public function __construct($db){
        $this->conn = $db;
    }

    function read_cargo(){
      $query = "CALL sp_listarclientecargo(?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->id_sede);

      $result->execute();
  
      $cliente_list=array();
      $cliente_list["cargos"]=array();

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $cliente_item = array (
              "id"=>$row['id'],
              "nombre"=>$row['nombre'],
          );

          array_push($cliente_list["cargos"],$cliente_item);
      }
      return $cliente_list; 
    }

    function read_cargo_estado(){
      $query = "CALL sp_listarclientecargoestado(?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->sede);

      $result->execute();
  
      $cliente_list=array();
      $cliente_list["estados"]=array();

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $cliente_item = array (
              "id"=>$row['id'],
              "nombre"=>$row['nombre'],
          );

          array_push($cliente_list["estados"],$cliente_item);
      }
      return $cliente_list; 
    }

    function read_cargo_normal(){
      $query = "CALL sp_listarclientecargos(?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->institucion);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->cargo);
      $result->bindParam(4, $this->pagina);
      $result->bindParam(5, $this->totalpagina);

      $result->execute();
  
      $cliente_list=array();
      $cliente_list["cargos"]=array();

      $contador = $this->pagina*($this->totalpagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador = $contador+1;
        $cliente_item = array (
          "numero"=>$contador,
          "id_cargo"=>$row['id_cargo'],
          "id_institucion"=>$row['id_institucion'],
          "institucion"=>$row['institucion'],
          "id_sede"=>$row['id_sede'],
          "sede"=>$row['sede'],
          "cargo"=>$row['cargo'],
        );
        array_push($cliente_list["cargos"],$cliente_item);
      }
      return $cliente_list; 
    }

    function read_cargo_normal_contar(){
      $query = "CALL sp_listarclientecargoscontar(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->institucion);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->cargo);

      $result->execute();
  
      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_cargo_estado_normal(){
      $query = "CALL sp_listarclientecargosestado(?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->institucion);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->cargo_estado);
      $result->bindParam(4, $this->pagina);
      $result->bindParam(5, $this->totalpagina);

      $result->execute();
  
      $cliente_list=array();
      $cliente_list["cargo_estados"]=array();

      $contador = $this->pagina*($this->totalpagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador = $contador+1;
        $cliente_item = array (
          "numero"=>$contador,
          "id_cargo_estado"=>$row['id_cargo_estado'],
          "id_institucion"=>$row['id_institucion'],
          "institucion"=>$row['institucion'],
          "id_sede"=>$row['id_sede'],
          "sede"=>$row['sede'],
          "cargo_estado"=>$row['cargo_estado'],
        );
        array_push($cliente_list["cargo_estados"],$cliente_item);
      }
      return $cliente_list; 
    }

    function read_cargo_estado_normal_contar(){
      $query = "CALL sp_listarclientecargosestadocontar(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->institucion);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->cargo_estado);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function create_cargo(){
      $query = "CALL sp_crearclientecargo(
        :prsede,
        :prcargo
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prsede", $this->sede);
      $result->bindParam(":prcargo", $this->cargo);
    
      $this->sede=htmlspecialchars(strip_tags($this->sede));
      $this->cargo=htmlspecialchars(strip_tags($this->cargo));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function create_cargo_estado(){
      $query = "CALL sp_crearclientecargoestado(
        :prsede,
        :prcargo_estado
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prsede", $this->sede);
      $result->bindParam(":prcargo_estado", $this->cargo_estado);
    
      $this->sede=htmlspecialchars(strip_tags($this->sede));
      $this->cargo_estado=htmlspecialchars(strip_tags($this->cargo_estado));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function update_cargo(){
      $query = "CALL sp_actualizarclientecargo(
        :prcargo,
        :prsede,
        :prnombre
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcargo", $this->cargo);
      $result->bindParam(":prsede", $this->sede);
      $result->bindParam(":prnombre", $this->nombre);
    
      $this->cargo=htmlspecialchars(strip_tags($this->cargo));
      $this->sede=htmlspecialchars(strip_tags($this->sede));
      $this->nombre=htmlspecialchars(strip_tags($this->nombre));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function update_cargo_estado(){
      $query = "CALL sp_actualizarclientecargoestado(
        :prcargo_estado,
        :prsede,
        :prnombre
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcargo_estado", $this->cargo_estado);
      $result->bindParam(":prsede", $this->sede);
      $result->bindParam(":prnombre", $this->nombre);
    
      $this->cargo_estado=htmlspecialchars(strip_tags($this->cargo_estado));
      $this->sede=htmlspecialchars(strip_tags($this->sede));
      $this->nombre=htmlspecialchars(strip_tags($this->nombre));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

  }
?>