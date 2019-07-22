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
	public $id;
	public $nombre;
	public $id_tipo;
	public $nombre_tipo;


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

        $contador = $this->total_pagina*($this->numero_pagina-1);

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

    function readxId(){
        $query ="call sp_listarmarcaxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_marca);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->id=$row['id'];
        $this->nombre=$row['nombre'];
        $this->id_tipo=$row['id_tipo'];
        $this->nombre_tipo=$row['nombre_tipo'];
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
	
	function create(){

        $query = "CALL sp_crearmarca (:idtipoproducto, :marca)";
        $result = $this->conn->prepare($query);
		$this->id_tipo_producto = htmlspecialchars(strip_tags($this->id_tipo_producto));
        $this->mrc_nombre = htmlspecialchars(strip_tags($this->mrc_nombre));

		$result->bindParam(":idtipoproducto",$this->id_tipo_producto);
        $result->bindParam(":marca", $this->mrc_nombre);

        if($result->execute())
        {
            $row = $result->fetch(PDO::FETCH_ASSOC);
            $this->id_marca=$row['id'];
            return true;
        }
        
        return false;
	}
	
	function update(){
        $query = "call sp_actualizarmarca(:id, :idtipoproducto, :marca)";
        
        $result = $this->conn->prepare($query);

        $result->bindParam(":id", $this->id_marca);
        $result->bindParam(":idtipoproducto", $this->id_tipo_producto);
        $result->bindParam(":marca", $this->mrc_nombre);

        $this->id_marca=htmlspecialchars(strip_tags($this->id_marca));
        $this->id_tipo_producto=htmlspecialchars(strip_tags($this->id_tipo_producto));
        $this->mdl_nombre=htmlspecialchars(strip_tags($this->mrc_nombre));

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
	}
	
	function delete(){
        $query = "call sp_eliminarmarca(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_marca);

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }

	
}

?>