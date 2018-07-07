<?php
Class Perfil{

    private $conn;
    private $table_name = "perfil";

    public $idperfil;
    public $prf_nombre;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT idperfil,prf_nombre FROM perfil";
        $result = $this->conn->prepare($query);
        $result->execute();
        return $result;
    }

    /* JEAN PAUL */
    function(){
        echo "Jean Paul"
    }

    function create()
    {
        $query = "INSERT INTO perfil SET prf_nombre=:prf_nombre";
        $result = $this->conn->prepare($query);

        $this->prf_nombre=htmlspecialchars(strip_tags($this->prf_nombre));

        $result->bindParam(":prf_nombre", $this->prf_nombre);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function readxId()
    {
        $query ="SELECT prf_nombre FROM perfil WHERE idperfil = ?";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idperfil);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $this->prf_nombre=$row['prf_nombre'];
    }
}
?>