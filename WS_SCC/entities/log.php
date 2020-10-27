<?php 

date_default_timezone_set("America/Lima") ;
class Log{

  private $conn;

  public $id_log ;
  public $id_usuario ;
  public $fecha ;
  public $id_referencia ;
  public $id_accion ;
  public $referencia ;

  public $usuario ;
  public $accion ;
  public $fecha_inicio ;
  public $fecha_fin ;
  public $numero_pagina ;
  public $total_pagina ;
  public $total_resultado ;
  public function __construct($db){
    $this->conn = $db;
  }

  function read(){
    $query = "CALL sp_listarlog(?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->usuario ) ;
    $result->bindParam(2, $this->accion ) ;
    $result->bindParam(3, $this->fecha_inicio ) ;
    $result->bindParam(4, $this->fecha_fin ) ;
    $result->bindParam(5, $this->numero_pagina ) ;
    $result->bindParam(6, $this->total_pagina ) ;

    $result->execute();

    $log_list=array();
    $log_list["logs"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador = $contador+1;
      $item = array(
        "numero" => $contador,
        "ig_log" => $ig_log ,
        "usuario" => $usuario ,
        "fecha" => $fecha ,
        "id_accion" => $id_accion ,
        "accion" => $accion ,
        "id_referencia" => $id_referencia ,
        "id_log_referencia" => $id_log_referencia ,
        "referencia" => $referencia ,
      );
      array_push($log_list["logs"],$item);
    }
    return $log_list;
  }

  function contar(){
    $query = "CALL sp_listarlogcontar(?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->usuario ) ;
    $result->bindParam(2, $this->accion ) ;
    $result->bindParam(3, $this->fecha_inicio ) ;
    $result->bindParam(4, $this->fecha_fin ) ;

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

	function create(
    $id_usuario ,
    $id_referencia ,
    $id_accion ,
    $referencia
  ){
		$query = "CALL sp_crearlog(
      :pridusuario,
      :prfecha,
      :pridreferencia,
      :pridaccion,
			:prreferencia
		)";
  
    $momento = date("Y-m-d H:i:s");

		$result = $this->conn->prepare($query);
  
		$result->bindParam(":pridusuario", $id_usuario);
    $result->bindParam(":prfecha", $momento);
    $result->bindParam(":pridreferencia", $id_referencia);
    $result->bindParam(":pridaccion", $id_accion);
    $result->bindParam(":prreferencia", $referencia);
  
    $id_usuario=htmlspecialchars(strip_tags($id_usuario));
    $momento=htmlspecialchars(strip_tags($momento));
    $id_referencia=htmlspecialchars(strip_tags($id_referencia));
    $id_accion=htmlspecialchars(strip_tags($id_accion));
		$referencia=htmlspecialchars(strip_tags($referencia));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

}
?>