<?php 

	class Bancos{
		private $conn;
		private $table_name = "banco";

		public $clr_nombre;
		
		public function __construct($db){
			$this->conn = $db;
		}

		function read(){
			$query = "CALL sp_listarbanco()";

			$result = $this->conn->prepare($query);

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
		
	}

?>