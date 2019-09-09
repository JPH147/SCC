<?php 

class Subsede{
	private $conn;
	private $table_name = "subsede";

    public $id_subsede;
    public $id_sede;
	public $ssd_nombre;
	public $ssd_abreviatura;
	public $ssd_representante_legal;
	public $dst_nombre;
	public $ssd_direccion;
	public $ssd_telefono;
    public $ssd_codigo_cooperativa;
    public $ssd_estado;
	public $institucion;
	public $sede;
	public $nombre;
	public $abreviatura;
	public $representante;
	public $distrito;
	public $direccion;
	public $telefono;
	public $codigo_cooperativa;
	public $numero_pagina;
	public $total_pagina;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
        $query = "CALL sp_listarsubsede(?,?)";
        $result = $this->conn->prepare($query);

		$result->bindParam(1, $this->id_sede);
		$result->bindParam(2, $this->ssd_nombre);

		$result->execute();

		$subsede_list=array();
		$subsede_list["subsede"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$subsede_fila = array(
				"numero"=>$contador,
				"id"=>$id_subsede,
				"nombre"=>$ssd_nombre,
				"abreviatura"=>$ssd_abreviatura,
				"representante"=>$ssd_representante_legal,
				"distrito"=>$dst_nombre,
				"direccion"=>$ssd_direccion,
				"telefono"=>$ssd_telefono,
				"codigo"=>$ssd_codigo_cooperativa
			);
			array_push($subsede_list["subsede"],$subsede_fila);
		}
		return $subsede_list;
	}

	function read_normal(){
		$query = "CALL sp_listarsubsedes(?,?,?,?,?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->institucion);
        $result->bindParam(2, $this->sede);
        $result->bindParam(3, $this->nombre);
        $result->bindParam(4, $this->numero_pagina);
        $result->bindParam(5, $this->total_pagina);

		$result->execute();

		$subsede_list=array();
		$subsede_list["subsede"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$item = array(
				"numero"=>$contador,
				"id" => $id ,
				"institucion" => $institucion ,
				"sede" => $sede ,
				"nombre" => $nombre ,
				"abreviatura" => $abreviatura 
			);
			array_push($subsede_list["subsede"],$item);
		}
		return $subsede_list;
	}

	function read_normal_contar(){
		$query = "CALL sp_listarsubsedescontar(?,?,?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->institucion);
        $result->bindParam(2, $this->sede);
        $result->bindParam(3, $this->nombre);

		$result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
	}

    function delete(){
		$query = "CALL sp_eliminarsubsede(
		  :prsubsede
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prsubsede", $this->id_subsede);
  
		$this->id_subsede=htmlspecialchars(strip_tags($this->id_subsede));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

    function create(){
		$query = "CALL sp_crearsubsede(
			:prsede,
			:prnombre,
			:prabreviatura,
			:prrepresentante,
			:prdistrito,
			:prdireccion,
			:prtelefono,
			:prcodigocooperativa
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prsede", $this->sede);
		$result->bindParam(":prnombre", $this->nombre);
		$result->bindParam(":prabreviatura", $this->abreviatura);
		$result->bindParam(":prrepresentante", $this->representante);
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
		$result->bindParam(":prtelefono", $this->telefono);
		$result->bindParam(":prcodigocooperativa", $this->codigo_cooperativa);
  
		$this->sede=htmlspecialchars(strip_tags($this->sede));
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
		$query = "CALL sp_actualizarsubsede(
			:prid,
			:prsede,
			:prnombre,
			:prabreviatura,
			:prrepresentante,
			:prdistrito,
			:prdireccion,
			:prtelefono,
			:prcodigocooperativa
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prid", $this->id_subsede);
		$result->bindParam(":prsede", $this->sede);
		$result->bindParam(":prnombre", $this->nombre);
		$result->bindParam(":prabreviatura", $this->abreviatura);
		$result->bindParam(":prrepresentante", $this->representante);
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
		$result->bindParam(":prtelefono", $this->telefono);
		$result->bindParam(":prcodigocooperativa", $this->codigo_cooperativa);
  
		$this->id_subsede=htmlspecialchars(strip_tags($this->id_subsede));
		$this->sede=htmlspecialchars(strip_tags($this->sede));
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