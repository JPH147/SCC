<?php
class Modulo{
    private $conn;
    private $table_name = "modulo";

    public $idmodulo;
    public $mdl_nombre;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listarmodulo";
        $result = $this->conn->prepare($query);
        $result->execute();
        return $result;
    }
    function create()
    {
        $query = "CALL sp_crearmodulo (:mdl_nombre)";
        $result = $this->conn->prepare($query);

        $this->mdl_nombre=htmlspecialchars(strip_tags($this->mdl_nombre));

        $result->bindParam(":mdl_nombre", $this->mdl_nombre);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function readxId()
    {
        $query ="CALL sp_listarmoduloxId (?)";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idmodulo);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $this->mdl_nombre=$row['mdl_nombre'];
    }
}
?>