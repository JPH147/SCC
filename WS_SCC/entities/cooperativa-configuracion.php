<?php 

class Cooperativa{

  private $conn;

  public $id_cooperativa ;
  public $departamento ;
  public $provincia ;
  public $distrito ;
  public $direccion ;
  public $relevancia ;
  public $principal ;
  public $numero_pagina ;
  public $total_pagina ;
  public $total_resultado ;

  public function __construct($db){
    $this->conn = $db;
  }

  function read(){
    $query = "CALL sp_listarcooperativadireccion(?,?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->departamento ) ;
    $result->bindParam(2, $this->provincia ) ;
    $result->bindParam(3, $this->distrito ) ;
    $result->bindParam(4, $this->direccion ) ;
    $result->bindParam(5, $this->relevancia ) ;
    $result->bindParam(6, $this->principal ) ;
    $result->bindParam(7, $this->numero_pagina ) ;
    $result->bindParam(8, $this->total_pagina ) ;

    $result->execute();

    $direccion_list=array();
    $direccion_list["direccion"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador = $contador+1;
      $item = array(
        "numero" => $contador,
        "id_cooperativa_direccion" => $id_cooperativa_direccion ,
        "id_departamento" => $id_departamento ,
        "id_provincia" => $id_provincia ,
        "id_distrito" => $id_distrito ,
        "departamento" => $departamento ,
        "provincia" => $provincia ,
        "distrito" => $distrito ,
        "cooperativa_direccion" => $cooperativa_direccion ,
        "relevancia" => $relevancia ,
        "principal" => $principal ,
      );
      array_push($direccion_list["direccion"],$item);
    }
    return $direccion_list;
  }

  function contar(){
    $query = "CALL sp_listarcooperativadireccioncontar(?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->departamento ) ;
    $result->bindParam(2, $this->provincia ) ;
    $result->bindParam(3, $this->distrito ) ;
    $result->bindParam(4, $this->direccion ) ;
    $result->bindParam(5, $this->relevancia ) ;
    $result->bindParam(6, $this->principal ) ;

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

	function create(){
		$query = "CALL sp_crearcooperativadireccion(
			:prdistrito,
			:prdireccion
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
  
		$this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

	function update(){
		$query = "CALL sp_actualizarcooperativadireccion(
      :prid,
      :prdistrito,
			:prdireccion
		)";
  
		$result = $this->conn->prepare($query);
  
    $result->bindParam(":prid", $this->id_cooperativa);
    $result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
  
    $this->id_cooperativa=htmlspecialchars(strip_tags($this->id_cooperativa));
    $this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
  }
  
	function delete(){
		$query = "CALL sp_eliminarcooperativadireccion(
      :prid
		)";
  
		$result = $this->conn->prepare($query);
  
    $result->bindParam(":prid", $this->id_cooperativa);
  
    $this->id_cooperativa=htmlspecialchars(strip_tags($this->id_cooperativa));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

}
?>