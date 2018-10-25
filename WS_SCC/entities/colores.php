<?php 

class Colores{
	private $conn;
	private $table_name = "colores";

	public $clr_nombre;
	
	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarcolores(?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->clr_nombre);

		$result->execute();

		$colores_list=array();
		$colores_list["colores"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$colores_row = array(
				"numero"=>$contador,
				"id"=>$id,
				"nombre"=>$nombre,
			);
			array_push($colores_list["colores"],$colores_row);
		}

		return $colores_list;
	}
	
}

?>