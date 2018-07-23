<?php 

class Distrito{
	private $conn;

	public $id_distrito;
	public $dst_nombre;
	public $prv_nombre;
	public $dpt_nombre;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listardistrito(?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->dpt_nombre);
		$result->bindParam(2, $this->prv_nombre);
		$result->bindParam(3, $this->dst_nombre);

		$result->execute();

		$distrito_list=array();
		$distrito_list["distritos"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$distrito_fila = array(
				"numero"=>$contador,
				"id"=>$id_distrito,
				"departamento"=>$dpt_nombre,
				"provincia"=>$prv_nombre,
				"distrito"=>$dst_nombre
			);
			array_push($distrito_list["distritos"],$distrito_fila);
		}

		return $distrito_list;
	}
	
}

?>