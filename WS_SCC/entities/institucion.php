<?php 

class Institucion{
	private $conn;

	public $id_institucion;
	public $inst_nombre;
	public $isnt_abreviatura;
	public $isnt_representante_legal;
	public $dst_nombre;
	public $inst_direccion;
	public $inst_telefono;
	public $inst_codigo_cooperativa;
	public $inst_estado;

	public $nombre;
	public $total_resultado;
	public $abreviatura;
	public $representante;
	public $distrito;
	public $direccion;
	public $telefono;
	public $codigo_cooperativa;

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

	function read_normal(){
		$query = "CALL sp_listarinstituciones(?,?,?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->nombre);
        $result->bindParam(2, $this->numero_pagina);
        $result->bindParam(3, $this->total_pagina);

		$result->execute();

		$institucion_list=array();
		$institucion_list["institucion"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$item = array(
				"numero"=>$contador,
				"id" => $id ,
				"nombre" => $nombre ,
				"abreviatura" => $abreviatura ,
				"representante_legal" => $representante_legal ,
				"direccion" => $direccion ,
				"telefono" => $telefono ,
				"codigo_cooperativa" => $codigo_cooperativa ,
			);
			array_push($institucion_list["institucion"],$item);
		}
		return $institucion_list;
	}

	function read_normal_contar(){
		$query = "CALL sp_listarinstitucionescontar(?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->nombre);

		$result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
	}

    function delete(){
		$query = "CALL sp_eliminarinstitucion(
		  :prinstitucion
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prinstitucion", $this->id_institucion);
  
		$this->id_institucion=htmlspecialchars(strip_tags($this->id_institucion));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

    function create(){
		$query = "CALL sp_crearinstitucion(
			:prnombre,
			:prabreviatura,
			:prrepresentante,
			:prdistrito,
			:prdireccion,
			:prtelefono,
			:prcodigocooperativa
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prnombre", $this->nombre);
		$result->bindParam(":prabreviatura", $this->abreviatura);
		$result->bindParam(":prrepresentante", $this->representante);
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
		$result->bindParam(":prtelefono", $this->telefono);
		$result->bindParam(":prcodigocooperativa", $this->codigo_cooperativa);
  
		$this->nombre=htmlspecialchars(strip_tags($this->nombre));
		$this->abreviatura=htmlspecialchars(strip_tags($this->abreviatura));
		$this->representante=htmlspecialchars(strip_tags($this->representante));
		$this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
		$this->telefono=htmlspecialchars(strip_tags($this->telefono));
		$this->codigo_cooperativa=htmlspecialchars(strip_tags($this->codigo_cooperativa));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

    function update(){
		$query = "CALL sp_actualizinstitucion(
			:prid,
			:prnombre,
			:prabreviatura,
			:prrepresentante,
			:prdistrito,
			:prdireccion,
			:prtelefono,
			:prcodigocooperativa
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prid", $this->id_institucion);
		$result->bindParam(":prnombre", $this->nombre);
		$result->bindParam(":prabreviatura", $this->abreviatura);
		$result->bindParam(":prrepresentante", $this->representante);
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
		$result->bindParam(":prtelefono", $this->telefono);
		$result->bindParam(":prcodigocooperativa", $this->codigo_cooperativa);
  
		$this->id_institucion=htmlspecialchars(strip_tags($this->id_institucion));
		$this->nombre=htmlspecialchars(strip_tags($this->nombre));
		$this->abreviatura=htmlspecialchars(strip_tags($this->abreviatura));
		$this->representante=htmlspecialchars(strip_tags($this->representante));
		$this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
		$this->telefono=htmlspecialchars(strip_tags($this->telefono));
		$this->codigo_cooperativa=htmlspecialchars(strip_tags($this->codigo_cooperativa));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

}

?>