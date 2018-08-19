<?php
Class ClienteTelefono{

    private $conn;
    private $table_name = "cliente_telefono";

    public $idcliente_telefono;
    public $id_cliente;
    public $tlf_numero;
    public $tlf_observacion;
    public $id_tipo;
    public $tlf_relevancia;

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
        $query = "CALL sp_crearclientetelefono(:id_cliente, :tlf_numero, :tlf_observacion, :id_tipo , :tlf_relevancia)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_cliente", $this->id_cliente);
        $result->bindParam(":tlf_numero", $this->tlf_numero);
        $result->bindParam(":tlf_observacion", $this->tlf_observacion);
        $result->bindParam(":id_tipo", $this->id_tipo);
        $result->bindParam(":tlf_relevancia", $this->tlf_relevancia);

        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->tlf_numero=htmlspecialchars(strip_tags($this->tlf_numero));
        $this->tlf_observacion=htmlspecialchars(strip_tags($this->tlf_observacion));
        $this->id_tipo=htmlspecialchars(strip_tags($this->id_tipo));
        $this->tlf_relevancia=htmlspecialchars(strip_tags($this->tlf_relevancia));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function read()
    {
        $query = "CALL sp_listarclientetelefono(:pid_cliente, :ptlf_relevancia)";

        $result = $this->conn->prepare($query);
        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":ptlf_relevancia", $this->tlf_relevancia);

        $result->execute();
        $telefono_list=array();
        $telefono_list["telefonos"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $telefono_item = array (
                "numero"=>$contador,
                "idcliente"=>$row['idcliente'],
                "cliente"=>$row['cliente'],
                "tlf_numero"=>$row['tlf_numero'],
                "tlf_observacion"=>$row['tlf_observacion'],
                "id_tipo"=>$row['id_tipo'],
                "tlf_relevancia"=>$row['tlf_relevancia']
            );

            array_push($telefono_list["telefonos"],$telefono_item);
        }
        return $telefono_list;
    }
}
?>