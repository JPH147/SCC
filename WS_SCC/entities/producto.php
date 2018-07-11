<?php
Class Producto{

    private $conn;
    private $table_name = "producto";

    public $idperfil;
    public $prf_nombre;

    public $idproducto;
    public $tprd_nombre;
    public $mrc_nombre;
    public $prd_modelo;
    public $prd_descripcion;
    public $und_nombre;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarproducto(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tprd_nombre);
        $result->bindParam(2, $this->mrc_nombre);
        $result->bindParam(3, $this->prd_modelo);
        $result->bindParam(4, $this->prd_descripcion);

        $result->execute();
    
        $producto_list=array();
        $producto_list["productos"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $producto_item = array (
                "numero"=>$contador,
                "id"=>$idproducto,
                "tipo"=>$tprd_nombre,
                "marca"=>$mrc_nombre,
                "modelo"=>$prd_modelo,
                "descripcion"=>$prd_descripcion,
                "unidad_medida"=>$und_nombre
            );

            array_push($producto_list["productos"],$producto_item);
        }
        return $producto_list;
    }

    // function read(){
    //     $query = "CALL sp_listarproducto";
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