<?php
Class ReglaEvaluacion{

	private $conn;

	public $id;
	public $tipo;
	public $desde;
	public $hasta;

  public function __construct($db){
     $this->conn = $db;
  }

  function read(){

  	$query = "CALL sp_listarreglaevaluacion()";

  	$result = $this->conn->prepare($query);

  	$result->execute();

    $regla=array();
    $regla["reglas"]=array();
    $contador = 0;

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
    	extract($row);
    	$contador=$contador+1;
    	$regla_item = array (
    	  "numero"=>$contador,
    	  "id"=>$id,
    	  "tipo"=>$tipo,
    	  "desde"=>$desde,
    	  "hasta"=>$hasta,
        "interes_diario"=>$interes_diario,
        "proximo_mes"=>$proximo_mes,
    	);
    	array_push($regla["reglas"],$regla_item);
    }
  	return $regla;
  }

//function create()
//{
//		$query = "CALL sp_crearproveedor (:prv_tipo_documento,:prv_documento,:prv_nombre,:prv_representante_legal,:prv_observacion)";
//
//		$result = $this->conn->prepare($query);
//
//		// $this->idproveedor=htmlspecialchars(strip_tags($this->idproveedor));
//		$this->tipo_documento=htmlspecialchars(strip_tags($this->tipo_documento));
//		$this->prv_documento=htmlspecialchars(strip_tags($this->prv_documento));
//		$this->prv_nombre=htmlspecialchars(strip_tags($this->prv_nombre));
//		$this->prv_representante_legal=htmlspecialchars($this->prv_representante_legal);
//		$this->prv_observacion=htmlspecialchars(strip_tags($this->prv_observacion));
//		//$this->prv_estado=htmlspecialchars(strip_tags($this->prv_estado));
//
//
//		// $result->bindParam(":idproveedor", $this->idproveedor);
//		$result->bindParam(":prv_tipo_documento", $this->tipo_documento);
//		$result->bindParam(":prv_documento", $this->prv_documento);
//		$result->bindParam(":prv_nombre", $this->prv_nombre);
//		$result->bindParam(":prv_representante_legal", $this->prv_representante_legal);
//		$result->bindParam(":prv_observacion", $this->prv_observacion);
//		//$result->bindParam(":prv_estado", $this->clt_emprv_estado);
//
//
//
//		if($result->execute())
//		{
//				return true;
//		}
//
//		return false;
//}
//
//
//function contar(){
//
//        $query = "CALL sp_listarproveedorcontar(?,?,?)";
//
//        $result = $this->conn->prepare($query);
//
//        $result->bindParam(1, $this->tipo_documento);
//  			$result->bindParam(2, $this->prv_documento);
//				$result->bindParam(3, $this->prv_nombre);
//
//        $result->execute();
//
//        $row = $result->fetch(PDO::FETCH_ASSOC);
//
//        $this->total_resultado=$row['total'];
//
//        return $this->total_resultado;
//	}
//
//function update()
//    {
//        $query = "CALL sp_actualizarproveedor (:idproveedor,:prv_tipo_documento,:prv_documento,:prv_nombre,:prv_representante_legal,:prv_observacion)";
//
//        $result = $this->conn->prepare($query);
//
//				$this->idproveedor=htmlspecialchars(strip_tags($this->idproveedor));
//				$this->prv_tipo_documento=htmlspecialchars(strip_tags($this->prv_tipo_documento));
//				$this->prv_documento=htmlspecialchars(strip_tags($this->prv_documento));
//				$this->prv_nombre=htmlspecialchars(strip_tags($this->prv_nombre));
//				$this->prv_representante_legal=htmlspecialchars($this->prv_representante_legal);
//				$this->prv_observacion=htmlspecialchars(strip_tags($this->prv_observacion));
//
//
//				$result->bindParam(":idproveedor", $this->idproveedor);
//				$result->bindParam(":prv_tipo_documento", $this->prv_tipo_documento);
//				$result->bindParam(":prv_documento", $this->prv_documento);
//				$result->bindParam(":prv_nombre", $this->prv_nombre);
//				$result->bindParam(":prv_representante_legal", $this->prv_representante_legal);
//				$result->bindParam(":prv_observacion", $this->prv_observacion);
//
//
//        if($result->execute())
//        {
//            return true;
//        }
//
//        return false;
//		}
//
//
//		function delete()
//    {
//        $query = "call sp_eliminarproveedor(?)";
//        $result = $this->conn->prepare($query);
//
//        $result->bindParam(1, $this->idproveedor);
//
//        if($result->execute())
//            {
//                return true;
//            }
//            else
//            {
//                return false;
//            }
//		}
//
//		function readxId(){
//
//			$query = "CALL sp_listarproveedorxid(?)";
//
//			$result = $this->conn->prepare($query);
//
//			$result->bindParam(1, $this->idproveedor);
//
//			$result->execute();
//
//			$row = $result->fetch(PDO::FETCH_ASSOC);
//
//			$this->idproveedor=$row['id'];
//			$this->tipo_documento=$row['tipo_documento'];
//			$this->prv_documento=$row['documento'];
//			$this->prv_nombre=$row['nombre'];
//			$this->prv_representante_legal=$row['representante'];
//			$this->prv_observacion=$row['observacion'];
//	}
}