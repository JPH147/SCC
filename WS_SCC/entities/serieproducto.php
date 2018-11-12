<?php 

class SerieProducto{
	private $conn;
	//private $table_name = "tipo_producto";

	public $serie;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarhistorialserie(?,?,?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->serie);
        $result->bindParam(2, $this->numero_pagina);
        $result->bindParam(3, $this->total_pagina);

		$result->execute();

		$serieproducto_list=array();
		$serieproducto_list["series"]=array();

		$contador = $this->total_pagina*($this->numero_pagina-1);


		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$serieproducto_fila = array(
				"numero" => $contador,
                "fecha" => $fecha,
                "documento" => $documento,
                "transaccion" => $transaccion,
                "producto" => $producto,
				"tenedor" => $tenedor,
				"serie" => trim($serie)
			);
			array_push($serieproducto_list["series"],$serieproducto_fila);
		}

		return $serieproducto_list;
	}

	function contar(){

        $query = "CALL sp_listarhistorialseriecontar(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->serie);
        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

}

?>