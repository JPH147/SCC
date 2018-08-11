<?php
Class TipoPago{

	private $conn;

	public $idtipo_pago;
    public $tpag_nombre;
    
    public function __construct($db){
        $this->conn = $db;
    }

  function read(){

  	$query = "CALL sp_listartipopago";
    $result = $this->conn->prepare($query);
    $result->execute();
    
    $tipopagos_list=array();
    $tipopagos_list["tipopago"]=array();
    $contador = 0;

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
        $contador=$contador+1;
        $tipopago_item = array (
            "id"=>$row['idtipo_pago'],
            "nombre"=>$row['tpag_nombre']
        );

        array_push($tipopagos_list["tipopago"],$tipopago_item);
    }
    return $tipopagos_list;
  }
}
