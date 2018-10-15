<?php 

class Tipo_Producto{
	private $conn;
	private $table_name = "tipo_producto";

	public $id_tipo_producto;
	public $tprd_nombre;
	public $und_nombre;
	public $numero_pagina;
    public $total_pagina;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listartipoproducto(?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->tprd_nombre);
		$result->bindParam(2, $this->und_nombre);

		$result->execute();

		$tipo_producto_list=array();
		$tipo_producto_list["tipo_productos"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$tipo_producto_fila = array(
				"numero"=>$contador,
				"id"=>$id_tipo_producto,
				"nombre"=>$tprd_nombre,
				"unidad_medida"=>$und_nombre
			);
			array_push($tipo_producto_list["tipo_productos"],$tipo_producto_fila);
		}

		return $tipo_producto_list;
	}

	function read2(){
		$query = "CALL sp_listartipoproducto2(?,?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->tprd_nombre);
		$result->bindParam(2, $this->und_nombre);
		$result->bindParam(3, $this->numero_pagina);
		$result->bindParam(4, $this->total_pagina);

		$result->execute();

		$tipo_producto_list=array();
		$tipo_producto_list["tipo_productos"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$tipo_producto_fila = array(
				"numero"=>$contador,
				"id"=>$id_tipo_producto,
				"nombre"=>$tprd_nombre,
				"unidad_medida"=>$und_nombre
			);
			array_push($tipo_producto_list["tipo_productos"],$tipo_producto_fila);
		}

		return $tipo_producto_list;
	}

	function contar(){

        $query = "CALL sp_listartipoproductocontar(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tprd_nombre);
		$result->bindParam(2, $this->und_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }


	function read_unidadmedida(){
	$query = "CALL sp_listarunidadmedida(?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->id_tipo_producto);

		$result->execute();

		$unidad_medida_list=array();
		$unidad_medida_list["unidades"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$unidad_medida_fila = array(
				"numero"=>$contador,
				"id"=>$id,
				"nombre"=>$nombre,
			);
			array_push($unidad_medida_list["unidades"],$unidad_medida_fila);
		}

		return $unidad_medida_list;
	}

	
}

?>