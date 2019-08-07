<?php 

class Courier{

	private $conn;

	public $id_courier;
	public $nombre;
	public $url;
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
				"url"=>$url,
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

	function readxId(){
		$query = "CALL sp_listarcourierxId(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_courier);

        $result->execute();
        
        $courier_list=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);
		
		if( $row['id'] ) {
			$courier_list = array (
				"id"=>$row['id'],
				"nombre"=>$row['nombre'],
				"url"=>$row['url'],
				"estado"=>$row['estado']
			);
		}

        return $courier_list;
	}

	function create(){
        $query = "CALL sp_crearcourier(
            :prnombre,
            :prurl
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prnombre", $this->nombre);
        $result->bindParam(":prurl", $this->url);

        $this->nombre=htmlspecialchars(strip_tags($this->nombre));
        $this->url=htmlspecialchars(strip_tags($this->url));

        if($result->execute())
        {
            return true;
        }
        return false; 
	}

	function update(){
		$query = "CALL sp_actualizarcourier(
            :prid,
            :prnombre,
            :prurl
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_courier);
        $result->bindParam(":prnombre", $this->nombre);
        $result->bindParam(":prurl", $this->url);

        $this->id_courier=htmlspecialchars(strip_tags($this->id_courier));
        $this->nombre=htmlspecialchars(strip_tags($this->nombre));
        $this->url=htmlspecialchars(strip_tags($this->url));

        if($result->execute())
        {
            return true;
        }
        return false; 
	}

	function delete(){
		$query = "CALL sp_eliminarcourier(
            :prid
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_courier);

        $this->id_courier=htmlspecialchars(strip_tags($this->id_courier));

        if($result->execute())
        {
            return true;
        }
        return false; 
	}

}

?>