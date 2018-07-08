<?php
Class Producto{

    private $conn;
    private $table_name = "producto";

    public $idperfil;
    public $prf_nombre;

    public $idproducto;
    public $id_tipo_producto;
    public $id_marca;
    public $prd_modelo;
    public $prd_descripcion;
    public $id_unidad_medida;
    public $und_nombre;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT p.idproducto,p.id_tipo_producto, p.id_marca, p.prd_modelo, p.prd_descripcion, u.und_nombre FROM producto p
                  INNER JOIN unidad_medida u on p.id_unidad_medida = u.idunidad_medida";
        $result = $this->conn->prepare($query);
        $result->execute();
        return $result;
    }

    // function read(){
    //     $query = "SELECT idperfil,prf_nombre FROM table_name";
    //     $result = $this->conn->prepare($query);
    //     $result->execute();
    //     return $result;
    // }

    function create()
    {
        $query = "INSERT INTO table_name SET prf_nombre=:prf_nombre";
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
        $query ="SELECT prf_nombre FROM table_name WHERE idperfil = ?";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idperfil);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $this->prf_nombre=$row['prf_nombre'];
    }
}
?>