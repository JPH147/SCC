<?php 

class Talonario{
	private $conn;
	//private $table_name = "tipo_producto";

	public $serie;

	public function __construct($db){
		$this->conn = $db;
	}

	function read_serie(){
		$query = "CALL sp_listartalonarioserie()";

		$result = $this->conn->prepare($query);

		$result->execute();

		$talonario_list=array();
		$talonario_list["series"]=array();

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			// $contador = $contador+1;
			$talonario_fila = array(
				"serie"=>$serie,
			);
			array_push($talonario_list["series"],$talonario_fila);
		}

		return $talonario_list;
	}

	function read_numero(){
		$query = "CALL sp_listartalonarionumero(?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->serie);

		$result->execute();

		$talonario_list=array();
		$talonario_list["numeros"]=array();

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$talonario_fila = array(
				"id"=>$id,
				"serie"=>$serie,
				"numero"=>$numero
			);
			array_push($talonario_list["numeros"],$talonario_fila);
		}

		return $talonario_list;
	}

}

?>