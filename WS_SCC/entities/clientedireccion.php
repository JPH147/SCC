<?php
Class ClienteDireccion{

    private $conn;
    private $table_name = "cliente_direccion";

    public $idcliente_direccion;
    public $id_cliente;
    public $drc_nombre;
    public $id_distrito;
    public $drc_relevancia;
    public $drc_observacion;
    public $drc_estado;

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
        $query = "CALL sp_crearclientedireccion(:id_cliente, :drc_nombre, :pid_distrito, :drc_relevancia , :drc_observacion)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_cliente", $this->id_cliente);
        $result->bindParam(":drc_nombre", $this->drc_nombre);
        $result->bindParam(":pid_distrito", $this->id_distrito);
        $result->bindParam(":drc_relevancia", $this->drc_relevancia);
        $result->bindParam(":drc_observacion", $this->drc_observacion);

        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->drc_nombre=htmlspecialchars(strip_tags($this->drc_nombre));
        $this->id_distrito=htmlspecialchars(strip_tags($this->id_distrito));
        $this->drc_relevancia=htmlspecialchars(strip_tags($this->drc_relevancia));
        $this->drc_observacion=htmlspecialchars(strip_tags($this->drc_observacion));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

}
?>