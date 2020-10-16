<?php 

	class Bancos{
		private $conn;

		public $id_banco ;
		public $banco ;
		public $numero_pagina ;
		public $total_pagina ;
		public $total_resultado ;

		public function __construct($db){
			$this->conn = $db;
		}

		function read(){
			$query = "CALL sp_listarbanco(?,?,?)";

			$result = $this->conn->prepare($query);

			$result->bindParam(1, $this->banco);
			$result->bindParam(2, $this->numero_pagina);
			$result->bindParam(3, $this->total_pagina);

			$result->execute();

			$bancos_list=array();
			$bancos_list["bancos"]=array();

			$contador = 0;

			while($row = $result->fetch(PDO::FETCH_ASSOC))
			{
				extract($row);
				$contador = $contador+1;
				$bancos_row = array(
					"numero"=>$contador,
					"id"=>$id,
					"nombre"=>$nombre,
				);
				array_push($bancos_list["bancos"],$bancos_row);
			}

			return $bancos_list;
		}
		
		function contar(){
			$query = "CALL sp_listarbancocontar(?)";

			$result = $this->conn->prepare($query);

			$result->bindParam(1, $this->banco);

			$result->execute();

			$row = $result->fetch(PDO::FETCH_ASSOC);

			$this->total_resultado=$row['total'];

			return $this->total_resultado;
		}

		function create(){
			$query = "CALL sp_crearbanco(
				:prbanco
			)";

			$result = $this->conn->prepare($query);

			$result->bindParam(":prbanco", $this->banco);

			$this->banco=htmlspecialchars(strip_tags($this->banco));

			if ( $result->execute() ){
				return true ;
			} else {
				return false ;
			}
		}
		
		function update(){
			$query = "CALL sp_actualizarbanco(
				:prid ,
				:prbanco
			)";

			$result = $this->conn->prepare($query);

			$result->bindParam(":prid", $this->id_banco);
			$result->bindParam(":prbanco", $this->banco);

			$this->id_banco=htmlspecialchars(strip_tags($this->id_banco));
			$this->banco=htmlspecialchars(strip_tags($this->banco));

			if ( $result->execute() ){
				return true ;
			} else {
				return false ;
			}
		}
				
		function delete(){
			$query = "CALL sp_eliminarbanco(
				:prid
			)";

			$result = $this->conn->prepare($query);

			$result->bindParam(":prid", $this->id_banco);

			$this->id_banco=htmlspecialchars(strip_tags($this->id_banco));

			if ( $result->execute() ){
				return true ;
			} else {
				return false ;
			}
		}
	}

?>