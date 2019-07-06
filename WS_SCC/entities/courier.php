<?php 

class Courier{

	private $conn;

	public $nombre;
	public $numero_pagina;
	public $total_pagina;
	
	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarcourier(?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->nombre);
		$result->bindParam(2, $this->numero_pagina);
		$result->bindParam(3, $this->total_pagina);

		$result->execute();

		$courier_list=array();
		$courier_list["courier"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$courier_item = array(
				"numero"=>$contador,
				"id"=>$id,
				"nombre"=>$nombre,
			);
			array_push($courier_list["courier"],$courier_item);
		}

		return $courier_list;
	}
    
    function contar(){

        $query = "CALL sp_listarcouriercontar(?)";

        $result = $this->conn->prepare($query);

		$result->bindParam(1, $this->nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }


}

?>