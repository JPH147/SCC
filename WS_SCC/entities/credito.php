<?php

Class Creditos{

    private $conn;
    private $table_name = "venta";

    public $cliente;
    public $tipo_credito;
    public $fecha_inicio;
    public $fecha_fin;
    public $estado;
    public $numero_pagina;
    public $total_pagina;
    public $orden;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarcredito(?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_credito);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->estado);
        $result->bindParam(6, $this->numero_pagina);
        $result->bindParam(7, $this->total_pagina);
        $result->bindParam(8, $this->orden);

        $result->execute();
        
        $credito_list=array();
        $credito_list["creditos"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $items = array (
                "numero"=>$contador,
                "id"=>$id,
                "codigo"=>$codigo,
                "institucion"=>$institucion,
                "sede"=>$sede,
                "subsede"=>$subsede,
                "id_cliente"=>$id_cliente,
                "cliente_nombre"=>$cliente_nombre,
                "fecha"=>$fecha,
                "tipo_pago"=>$tipo_pago,
                "numero_cuotas"=>$numero_cuotas,
                "monto_total"=>$monto_total,
                "tipo_credito"=>$tipo_credito,
                "observaciones"=>$observaciones,
                "estado"=>$estado,
            );
            array_push($credito_list["creditos"],$items);
        }

        return $credito_list;
    }

    function contar(){

        $query = "CALL sp_listarcreditocontar(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_credito);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

}