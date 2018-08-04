<?php 

class Marca{
	private $conn;
	private $table_name = "modelo";

	public $id_modelo;
	public $tprd_nombre;
	public $mrc_nombre;
	public $mdl_nombre;
	public $id_marca;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarmodelo(?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->id_marca);
		$result->bindParam(2, $this->mdl_nombre);

		$result->execute();

		$modelo_list=array();
		$modelo_list["modelo"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$modelo_fila = array(
				"numero"=>$contador,
				"id"=>$id_modelo,
				"tipo"=>$tprd_nombre,
				"marca"=>$mrc_nombre,
				"nombre"=>$mdl_nombre
			);
			array_push($modelo_list["modelo"],$modelo_fila);
		}

		return $modelo_list;
	}

	
}

?>