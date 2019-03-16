<?php 

class ComisionRetenida{

	private $conn;
	private $table_name = "comision_retenida";

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarcomisionretenida()";

		$result = $this->conn->prepare($query);

		$result->execute();

		$comision_list=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$comision_row = array(
				"numero"=>$contador,
				"id"=>$id,
				"comision"=>$comision,
				"fecha"=>$fecha,
			);
			array_push($comision_list,$comision_row);
		}

		return $comision_list;
	}
	
}

?>