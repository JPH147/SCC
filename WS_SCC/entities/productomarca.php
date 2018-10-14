<?php 

class Marca{
	private $conn;
	private $table_name = "marca";

	public $id_marca;
	public $tprd_nombre;
	public $mrc_nombre;
	public $id_tipo_producto;
	public $numero_pagina;
	public $total_pagina;
	public $tipo;

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

	function read2(){
		$query = "CALL sp_listarmarca2(?,?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->tipo);
		$result->bindParam(2, $this->mrc_nombre);
		$result->bindParam(3, $this->numero_pagina);
		$result->bindParam(4, $this->total_pagina);
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

	function contar(){

        $query = "CALL sp_listarmarcacontar(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tipo);
		$result->bindParam(2, $this->mrc_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

	
}

?>