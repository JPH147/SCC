<?php 

class Institucion{
	private $conn;
	private $table_name = "institucion";

	public $id_institucion;
	public $inst_nombre;
	public $idinstitucion_estado;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarinstitucion";

		$result = $this->conn->prepare($query);
		$result->execute();

		$institucion_list=array();
		$institucion_list["institucion"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$institucion_fila = array(
				"numero"=>$contador,
				"id"=>$id_institucion,
				"nombre"=>$inst_nombre,
				"estado"=>$idinstitucion_estado,
			);
			array_push($institucion_list["institucion"],$institucion_fila);
		}
		return $institucion_list;
	}
}

?>