<?php
Class Producto{

	private $conn;

	private $idproveedor;
	private $tipo_documento;
	private $prv_documento;
	private $prv_nombre;
	private $prv_representante_legal;
	private $prv_observacion;
  private $total_pagina;
  private $total_resultado;

  function read(){
  	$query = "CALL sp_listarproveedor(?,?,?,?,?)";
  	$result = $this->conn->prepare($query);
  	$result->bindParam(1, $this->tipo_documento);
  	$result->bindParam(2, $this->prv_documento);
  	$result->bindParam(3, $this->prv_nombre);
    $result->bindParam(5, $this->numero_pagina);
    $result->bindParam(6, $this->total_pagina);
  	$result->execute();
    	
    $producto_list=array();
    $producto_list["productos"]=array();
    $contador = $this->total_pagina*($this->numero_pagina);
    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
    	extract($row);
    	$contador=$contador+1;
    	$producto_item = array (
    	  "numero"=>$contador,
    	  "id"=>$idproveedor,
    	  "tip_documento"=>$tipo_documento,
    	  "documento"=>$prv_documento,
    	  "nombre"=>$prv_nombre,
    	  "representante_legal"=>$prv_representante_legal,
    	  "observacion"=>$prv_observacion,
    	);
    	array_push($producto_list["productos"],$producto_item);
    }
  	return $producto_list;
  }
}
