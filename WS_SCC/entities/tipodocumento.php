<?php
Class TipoDocumento{

	private $conn;

	public $idtipo_documento;
    public $tdcm_nombre;
    
    public function __construct($db){
        $this->conn = $db;
    }

  function read(){

  	$query = "CALL sp_listartipodocumento";
    $result = $this->conn->prepare($query);
    $result->execute();
    
    $tipodocumentos_list=array();
    $tipodocumentos_list["tipodocumento"]=array();
    $contador = 0;

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
        $contador=$contador+1;
        $tipodocumento_item = array (
            "id"=>$row['idtipo_documento'],
            "nombre"=>$row['tdcm_nombre']
        );

        array_push($tipodocumentos_list["tipodocumento"],$tipodocumento_item);
    }
    return $tipodocumentos_list;
  }
}
