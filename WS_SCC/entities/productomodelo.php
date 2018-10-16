<?php 

class Modelo{
	private $conn;
	private $table_name = "modelo";

	public $id_modelo;
	public $tprd_nombre;
	public $mrc_nombre;
	public $mdl_nombre;
	public $id_marca;
	public $marca;
	public $numero_pagina;
	public $total_pagina;
	public $id_tipo;

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

	function read2(){
		$query = "CALL sp_listarmodelo2(?,?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->marca);
		$result->bindParam(2, $this->mdl_nombre);
		$result->bindParam(3, $this->numero_pagina);
		$result->bindParam(4, $this->total_pagina);

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

	function contar(){

        $query = "CALL sp_listarmodelocontar(?,?)";

        $result = $this->conn->prepare($query);

		$result->bindParam(1, $this->marca);
		$result->bindParam(2, $this->mdl_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
	}
	
	function create()
    {
        $query = "CALL sp_crearmodelo (:idmarca, :modelo)";
        $result = $this->conn->prepare($query);
		$this->id_marca = htmlspecialchars(strip_tags($this->id_marca));
        $this->mdl_nombre = htmlspecialchars(strip_tags($this->mdl_nombre));

		$result->bindParam(":idmarca",$this->id_marca);
        $result->bindParam(":modelo", $this->mdl_nombre);

        if($result->execute())
        {
            return true;
        }
        
        return false;
	}
	
	function update()
    {
        $query = "call sp_actualizarmodelo(:id, :idmarca, :modelo)";
        
        $result = $this->conn->prepare($query);

        $result->bindParam(":id", $this->id_modelo);
        $result->bindParam(":idmarca", $this->id_marca);
        $result->bindParam(":modelo", $this->mdl_nombre);

        $this->id_modelo=htmlspecialchars(strip_tags($this->id_modelo));
        $this->id_marca=htmlspecialchars(strip_tags($this->id_marca));
        $this->mdl_nombre=htmlspecialchars(strip_tags($this->mdl_nombre));

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

        $query = "CALL sp_listarmodeloxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_modelo);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->id_modelo=$row['id'];
        $this->id_marca=$row['idmarca'];
        $this->mdl_nombre=$row['modelo'];
    }

	
}

?>