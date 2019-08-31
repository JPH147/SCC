<?php 

class Talonario{
	private $conn;
	//private $table_name = "tipo_producto";

	public $serie;
	public $numero;
	public $estado;
	public $numero_pagina;
	public $total_pagina;
	public $total_resultado;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listartalonarios(?,?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->serie);
		$result->bindParam(2, $this->numero);
		$result->bindParam(3, $this->numero_pagina);
		$result->bindParam(4, $this->total_pagina);

		$result->execute();

		$contador = $this->total_pagina*($this->numero_pagina-1);
		
		$talonario_list=array();
		$talonario_list["talonarios"]=array();
		
		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
			$talonario_fila = array(
				"numero"=>$contador,
				"serie"=>$serie,
				"numero_inicio"=>$numero_inicio,
				"numero_fin"=>$numero_fin,
				"total"=>$total,
				"anulados"=>$anulados,
				"disponibles"=>$disponibles,
				"utilizados"=>$utilizados,
				"consignacion"=>$consignacion,
			);
			array_push($talonario_list["talonarios"],$talonario_fila);
		}

		return $talonario_list;
	}

	function contar(){

        $query = "CALL sp_listartalonarioscontar(?,?)";

		$result = $this->conn->prepare($query);
		
		$result->bindParam(1, $this->serie);
		$result->bindParam(2, $this->numero);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
	}

	function create(){
        $query = "CALL sp_creartalonarios(
            :prserie,
            :prnumeroinicio,
            :prnumerofin
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prserie", $this->serie);
        $result->bindParam(":prnumeroinicio", $this->numero_inicio);
        $result->bindParam(":prnumerofin", $this->numero_fin);

        $this->serie=htmlspecialchars(strip_tags($this->serie));
        $this->numero_inicio=htmlspecialchars(strip_tags($this->numero_inicio));
        $this->numero_fin=htmlspecialchars(strip_tags($this->numero_fin));

        if($result->execute())
        {
            return true;
        }
        
        return false;
	}

	function update(){
        $query = "CALL sp_actualizartalonarios(
            :prserie,
            :prestado
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prserie", $this->serie);
        $result->bindParam(":prestado", $this->estado);

        $this->serie=htmlspecialchars(strip_tags($this->serie));
        $this->estado=htmlspecialchars(strip_tags($this->estado));

        if($result->execute())
        {
            return true;
        }
        
        return false;
	}

	function read_serie(){
		$query = "CALL sp_listartalonarioserie()";

		$result = $this->conn->prepare($query);

		$result->execute();

		$talonario_list=array();
		$talonario_list["series"]=array();

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			// $contador = $contador+1;
			$talonario_fila = array(
				"serie"=>$serie,
			);
			array_push($talonario_list["series"],$talonario_fila);
		}

		return $talonario_list;
	}

	function read_numero(){
		$query = "CALL sp_listartalonarionumero(?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->serie);

		$result->execute();

		$talonario_list=array();
		$talonario_list["numeros"]=array();

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$talonario_fila = array(
				"id"=>$id,
				"serie"=>$serie,
				"numero"=>$numero
			);
			array_push($talonario_list["numeros"],$talonario_fila);
		}

		return $talonario_list;
	}

    function readxId() {
        $query ="call sp_listartalonarioxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
      
        $this->id=$row['id'];
        $this->serie=$row['serie'];
        $this->numero=$row['numero'];
        $this->salida=$row['salida'];
        $this->estado=$row['estado'];
    }

    function update_estado(){
        $query ="call sp_actualizartalonarioestado(?,?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id);
        $result->bindParam(2, $this->estado);

        if($result->execute())
        {
            return true;
        }
        return false;

    }

	function verificar_serie(){
        $query = "CALL sp_verificartalonarioserie(?)";

		$result = $this->conn->prepare($query);
		
		$result->bindParam(1, $this->serie);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
	}

}

?>