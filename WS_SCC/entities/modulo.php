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
        $query = "SELECT idmodulo,mdl_nombre FROM modulo";
        $result = $this->conn->prepare($query);
        $result->execute();
        return $result;
    }
    function create()
    {
        $query = "INSERT INTO modulo SET mdl_nombre=:mdl_nombre";
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
        $query ="SELECT mdl_nombre FROM modulo WHERE idmodulo = ?";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idmodulo);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $this->mdl_nombre=$row['mdl_nombre'];
    }
}
?>