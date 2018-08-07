<?php
Class Proveedor{

	private $conn;

	public $idproveedor;
	public $tipo_documento;
	public $prv_documento;
	public $prv_nombre;
	public $prv_representante_legal;
	public $prv_observacion;
  public $total_pagina;
  public $total_resultado;

    public function __construct($db){
        $this->conn = $db;
    }

  function read(){

  	$query = "CALL sp_listarproveedor(?,?,?,?,?)";

  	$result = $this->conn->prepare($query);
  	
    $result->bindParam(1, $this->tipo_documento);
  	$result->bindParam(2, $this->prv_documento);
  	$result->bindParam(3, $this->prv_nombre);
    $result->bindParam(4, $this->numero_pagina);
    $result->bindParam(5, $this->total_pagina);

  	$result->execute();
    	
    $proveedor=array();
    $proveedor["proveedor"]=array();
    $contador = $this->total_pagina*($this->numero_pagina-1);

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
    	extract($row);
    	$contador=$contador+1;
    	$proveedor_item = array (
    	  "numero"=>$contador,
    	  "id"=>$idproveedor,
    	  "tipo_documento"=>$tipo_documento,
    	  "documento"=>$prv_documento,
    	  "nombre"=>$prv_nombre,
    	  "representante_legal"=>$prv_representante_legal,
    	  "observacion"=>$prv_observacion,
    	);
    	array_push($proveedor["proveedor"],$proveedor_item);
    }
  	return $proveedor;
  }
}
