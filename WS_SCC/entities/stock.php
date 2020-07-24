<?php
Class Stock{

    private $conn;

    public $almacen;
    public $tipo;
    public $marca;
    public $modelo;
    public $serie;
    public $descripcion;
    public $unidad_medida;
    public $cantidad;
    public $numero_pagina;
    public $total_pagina;
    public $total_resultado;
    public $orden;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarstock(?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->almacen);
        $result->bindParam(2, $this->tipo);
        $result->bindParam(3, $this->marca);
        $result->bindParam(4, $this->modelo);
        $result->bindParam(5, $this->descripcion);
        $result->bindParam(6, $this->numero_pagina);
        $result->bindParam(7, $this->total_pagina);
        $result->bindParam(8, $this->orden);
        $result->execute();
        
        $stock_list=array();
        $stock_list["stock"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $stock_item = array (
                "numero"=>$contador,
                "almacen"=>$almacen,
                "tipo"=>$tipo,
                "marca"=>$marca,
                "modelo"=>$modelo,
                "id_producto"=>$id_producto,
                "descripcion"=>$descripcion,
                "unidad_medida"=>$unidad_medida,
                "cantidad"=>$cantidad,
                "precio"=>$precio
            );
            array_push($stock_list["stock"],$stock_item);
        }

        return $stock_list;
    }

    function contar(){

        $query = "CALL sp_listarstockcontar(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->almacen);
        $result->bindParam(2, $this->tipo);
        $result->bindParam(3, $this->marca);
        $result->bindParam(4, $this->modelo);
        $result->bindParam(5, $this->descripcion);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }
        
    function VerificarStockxSerie(){
        $query = "CALL sp_verificarstockproductoserie(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->serie);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }
}
?>