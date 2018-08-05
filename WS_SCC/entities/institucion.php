<?php 

class Institucion{
	private $conn;
	private $table_name = "institucion";

	public $id_institucion;
	public $inst_nombre;
	public $isnt_abreviatura;
	public $isnt_representante_legal;
	public $dst_nombre;
	public $inst_direccion;
	public $inst_telefono;
	public $inst_codigo_cooperativa;
	public $inst_estado;


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
				"abreviatura"=>$isnt_abreviatura,
				"representante"=>$isnt_representante_legal,
				"distrito"=>$dst_nombre,
				"direccion"=>$inst_direccion,
				"telefono"=>$inst_telefono,
				"codigo"=>$inst_codigo_cooperativa
			);
			array_push($institucion_list["institucion"],$institucion_fila);
		}
		return $institucion_list;
	}
}

?>