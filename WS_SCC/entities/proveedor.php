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


function create()
{
		$query = "CALL sp_crearproveedor (:idproveedor,:prv_tipo_documento,:prv_documento,:prv_nombre,:prv_representante_legal,:prv_observacion,:prv_estado)"; 

		$result = $this->conn->prepare($query);

		$this->idproveedor=htmlspecialchars(strip_tags($this->idproveedor));
		$this->prv_tipo_documento=htmlspecialchars(strip_tags($this->prv_tipo_documento));
		$this->prv_documento=htmlspecialchars(strip_tags($this->prv_documento));
		$this->prv_nombre=htmlspecialchars(strip_tags($this->prv_nombre));
		$this->prv_representante_legal=htmlspecialchars($this->prv_representante_legal);
		$this->prv_observacion=htmlspecialchars(strip_tags($this->prv_observacion));
		$this->prv_estado=htmlspecialchars(strip_tags($this->prv_estado));
		

		$result->bindParam(":idproveedor", $this->idproveedor);
		$result->bindParam(":prv_tipo_documento", $this->prv_tipo_documento);
		$result->bindParam(":prv_documento", $this->prv_documento);
		$result->bindParam(":prv_nombre", $this->prv_nombre);
		$result->bindParam(":prv_representante_legal", $this->prv_representante_legal);
		$result->bindParam(":prv_observacion", $this->prv_observacion);
		$result->bindParam(":prv_estado", $this->clt_emprv_estado);
	
		

		if($result->execute())
		{
				return true;
		}
		
		return false;
}


function update()
    {
        $query = "CALL sp_actualizarproveedor (:idproveedor,:prv_tipo_documento,:prv_documento,:prv_nombre,:prv_representante_legal,:prv_observacion,:prv_estado)";  

        $result = $this->conn->prepare($query);

				$this->idproveedor=htmlspecialchars(strip_tags($this->idproveedor));
				$this->prv_tipo_documento=htmlspecialchars(strip_tags($this->prv_tipo_documento));
				$this->prv_documento=htmlspecialchars(strip_tags($this->prv_documento));
				$this->prv_nombre=htmlspecialchars(strip_tags($this->prv_nombre));
				$this->prv_representante_legal=htmlspecialchars($this->prv_representante_legal);
				$this->prv_observacion=htmlspecialchars(strip_tags($this->prv_observacion));
				$this->prv_estado=htmlspecialchars(strip_tags($this->prv_estado));
				
		
				$result->bindParam(":idproveedor", $this->idproveedor);
				$result->bindParam(":prv_tipo_documento", $this->prv_tipo_documento);
				$result->bindParam(":prv_documento", $this->prv_documento);
				$result->bindParam(":prv_nombre", $this->prv_nombre);
				$result->bindParam(":prv_representante_legal", $this->prv_representante_legal);
				$result->bindParam(":prv_observacion", $this->prv_observacion);
				$result->bindParam(":prv_estado", $this->clt_emprv_estado);
			

        if($result->execute())
        {
            return true;
        }
        
        return false;
		}
		

		function delete()
    {
        $query = "call sp_eliminarproveedor(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idproveedor);

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }