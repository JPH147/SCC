<?php 

class Tipo_Producto{
	private $conn;
	private $table_name = "tipo_producto";

	public $id_tipo_producto;
	public $tprd_nombre;
	public $und_nombre;
	public $numero_pagina;
	public $total_pagina;
	
	public $idunidadmedida;

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

	function create()
    {
        $query = "CALL sp_creartipoproducto (:prnombre, :idunidadmedida)";
        $result = $this->conn->prepare($query);
		$this->tprd_nombre = htmlspecialchars(strip_tags($this->tprd_nombre));
        $this->idunidadmedida = htmlspecialchars(strip_tags($this->idunidadmedida));

		$result->bindParam(":prnombre",$this->tprd_nombre);
        $result->bindParam(":idunidadmedida", $this->idunidadmedida);

        if($result->execute())
        {
            return true;
        }
        
        return false;
	}
	
	function update()
    {
        $query = "call sp_actualizartipoproducto(:id, :nombre, :idunidad)";
        
        $result = $this->conn->prepare($query);

        $result->bindParam(":id", $this->id_tipo_producto);
        $result->bindParam(":nombre", $this->tprd_nombre);
        $result->bindParam(":idunidad", $this->idunidadmedida);

        $this->id_tipo_producto=htmlspecialchars(strip_tags($this->id_tipo_producto));
        $this->tprd_nombre=htmlspecialchars(strip_tags($this->tprd_nombre));
        $this->idunidadmedida=htmlspecialchars(strip_tags($this->idunidadmedida));

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
	}
	
	function readxId(){

        $query = "CALL sp_listartipoproductoxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_tipo_producto);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->id_tipo_producto=$row['id'];
        $this->tprd_nombre=$row['nombre'];
        $this->idunidadmedida=$row['idunidad'];
    }

	
}

?>