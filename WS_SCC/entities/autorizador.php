<?php
Class Autorizador{

    private $conn;
    private $table_name = "autorizador";

    public $idautorizador;
    public $id_sucursal;
    public $sucursal_nombre;
    public $autorizador_dni;
    public $autorizador_nombre;

    public $numero_pagina;
    public $total_pagina;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarautorizador(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_sucursal);
        $result->bindParam(2, $this->autorizador_nombre);
        $result->bindParam(3, $this->numero_pagina);
        $result->bindParam(4, $this->total_pagina);

        $result->execute();
    
        $autorizador_list=array();
        $autorizador_list["autorizadores"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $autorizador_item = array (
                "id"=>$row['id'],
                "id_sucursal"=>$row['id_sucursal'],
                "nombre_sucursal"=>$row['nombre_sucursal'],
                "dni"=>$row['dni'],
                "nombre"=>$row['nombre'],
            );

            array_push($autorizador_list["autorizadores"],$autorizador_item);
        }
        return $autorizador_list;
    }

    function contar(){

        $query = "CALL sp_listarautorizadorcontar(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_sucursal);
        $result->bindParam(2, $this->autorizador_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }
}
?>