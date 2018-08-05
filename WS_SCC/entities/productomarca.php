<?php 

class Marca{
	private $conn;
	private $table_name = "marca";

	public $id_marca;
	public $tprd_nombre;
	public $mrc_nombre;
	public $id_tipo_producto;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarmarca(?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->id_tipo_producto);
		$result->bindParam(2, $this->mrc_nombre);

		$result->execute();

		$marca_list=array();
		$marca_list["marca"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$marca_fila = array(
				"numero"=>$contador,
				"id"=>$id_marca,
				"tipo"=>$tprd_nombre,
				"nombre"=>$mrc_nombre,
			);
			array_push($marca_list["marca"],$marca_fila);
		}

		return $marca_list;
	}

	
}

?>