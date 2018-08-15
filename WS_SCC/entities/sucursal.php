<?php 

class Sucursal{
	
	private $conn;

	public $id;
	public $nombre;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarsucursal(?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->id);
		$result->bindParam(2, $this->nombre);

		$result->execute();

		$sucursal_list=array();
		$sucursal_list["sucursal"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$sucursal_item = array(
				"numero"=>$contador,
				"id"=>$id,
				"nombre"=>$nombre,
			);
			array_push($sucursal_list["sucursal"],$sucursal_item);
		}

		return $sucursal_list;
	}

	
}

?>