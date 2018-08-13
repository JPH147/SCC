<?php
Class Vendedor{

    private $conn;
    private $table_name = "vendedor";

    public $idvendedor;
    public $id_sucursal;
    public $scs_nombre;
    public $vnd_dni;
    public $vnd_nombre;
    public $vnd_email;
    public $vnd_comision;
    public $vnd_estado;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listarvendedor(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->vnd_dni);
        $result->bindParam(2, $this->vnd_nombre);
        $result->bindParam(3, $this->scs_nombre);

        $result->execute();
    
        $vendedor_list=array();
        $vendedor_list["vendedores"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $vendedor_item = array (
                "id"=>$row['idvendedor'],
                "sucnombre"=>$row['scs_nombre'],
                "dni"=>$row['vnd_dni'],
                "nombre"=>$row['vnd_nombre'],
                "email"=>$row['vnd_email'],
                "comision"=>$row['vnd_comision']
            );

                array_push($vendedor_list["vendedores"],$vendedor_item);
        }
        return $vendedor_list;
    }
}
?>