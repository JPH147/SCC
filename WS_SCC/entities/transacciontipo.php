<?php 

Class TransaccionTipo{

    private $conn;

    public $id;
    public $tipo;
    public $nombre;

    public function __construct($db){
        $this->conn = $db;
    }

    /* Listar productos */
    function read(){

        $query = "CALL sp_listartransacciontipo(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tipo);

        $result->execute();
        
        $TTipo_list=array();
        $TTipo_list["tipos"]=array();

        $contador=0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $tipo_items = array (
                "numero"=>$contador,
                "id"=>$idtipo_transaccion,
                "tipo"=>$ttsc_tipo,                
                "nombre"=>$ttsc_nombre,
            );
            array_push($TTipo_list["tipos"],$tipo_items);
        }

        return $TTipo_list;
    }
 }

?>