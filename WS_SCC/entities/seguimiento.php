<?php

class Seguimiento{
    
    private $conn;

    public $tipo ;
    public $id ;
    public $id_seguimiento ;
    public $id_venta ;
    public $id_credito ;
    public $id_courier ;
    public $courier ;
    public $estado ;
    public $fecha_inicio ;
    public $fecha_fin ;
    public $fecha ;
    public $numero_seguimiento ;
    public $pdf_foto ;
    public $usuario ;
    public $observacion ;
    public $numero_pagina ;
    public $total_pagina ;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarseguimiento(?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->numero_seguimiento);
        $result->bindParam(3, $this->courier);
        $result->bindParam(4, $this->estado);
        $result->bindParam(5, $this->fecha_inicio);
        $result->bindParam(6, $this->fecha_fin);
        $result->bindParam(7, $this->numero_pagina);
        $result->bindParam(8, $this->total_pagina);

        $result->execute();
        
        $seguimiento_list=array();
        $seguimiento_list["seguimientos"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $items = array (
                "numero"=>$contador,
                "id" => $id,
                "id_tipo" => $id_tipo,
                "tipo" => $tipo,
                "id_transaccion" => $id_transaccion,
                "salida" => $salida,
                "cliente" => $cliente,
                "documento" => $documento,
                "id_courier" => $id_courier,
                "courier" => $courier,
                "courier_url" => $courier_url,
                "fecha" => $fecha,
                "numero_seguimiento" => $numero_seguimiento,
                "foto" => $foto,
                "fecha_recepcion" => $fecha_recepcion,
                "usuario_recepcion" => $usuario_recepcion,
                "observacion" => $observacion,
                "id_estado" => $id_estado,
                "estado" => $estado
            );
            array_push($seguimiento_list["seguimientos"],$items);
        }

        return $seguimiento_list;
    }

    function contar(){

        $query = "CALL sp_listarseguimientocontar(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->numero_seguimiento);
        $result->bindParam(3, $this->courier);
        $result->bindParam(4, $this->estado);
        $result->bindParam(5, $this->fecha_inicio);
        $result->bindParam(6, $this->fecha_fin);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function readxId(){

        $query = "CALL sp_listarseguimientoxId(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id);

        $result->execute();
        
        $courrier_list=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $courrier_list = array (
            "id"=>$row['id'],
            "tipo"=>$row['tipo'],
            "id_courier"=>$row['id_courier'],
            "courier"=>$row['courier'],
            "fecha"=>$row['fecha'],
            "numero_seguimiento"=>$row['numero_seguimiento'],
            "foto"=>$row['foto'],
            "fecha_recepcion"=>$row['fecha_recepcion'],
            "usuario_recepcion"=>$row['usuario_recepcion'],
            "observacion"=>$row['observacion'],
            "id_estado"=>$row['id_estado'],
        );

        return $courrier_list;
    }

    function readxdocumento_export($tipo, $id){

        $query = "CALL sp_listarseguimientoxdocumento(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $tipo);
        $result->bindParam(2, $id);

        $result->execute();
        
        $courrier_list=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $courrier_list = array (
            "id"=>$row['id'],
            "id_courier"=>$row['id_courier'],
            "courier"=>$row['courier'],
            "fecha"=>$row['fecha'],
            "numero_seguimiento"=>$row['numero_seguimiento'],
            "foto"=>$row['foto'],
            "fecha_recepcion"=>$row['fecha_recepcion'],
            "usuario_recepcion"=>$row['usuario_recepcion'],
            "observacion"=>$row['observacion']
        );

        return $courrier_list;
    }

    function readxdocumento(){

        $query = "CALL sp_listarseguimientoxdocumento(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tipo);
        $result->bindParam(2, $this->id);

        $result->execute();
        
        $courrier_list=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $courrier_list = array (
            "id"=>$row['id'],
            "id_courier"=>$row['id_courier'],
            "courier"=>$row['courier'],
            "fecha"=>$row['fecha'],
            "numero_seguimiento"=>$row['numero_seguimiento'],
            "foto"=>$row['foto'],
            "fecha_recepcion"=>$row['fecha_recepcion'],
            "usuario_recepcion"=>$row['usuario_recepcion'],
            "observacion"=>$row['observacion']
        );

        return $courrier_list;
    }

    function crear(){
        $query = "CALL sp_crearseguimientodocumentos(
            :prventa,
            :prcredito,
            :prcourier,
            :prfecha,
            :prseguimiento,
            :prfoto,
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prventa", $this->id_venta);
        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prcourier", $this->id_courier);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prseguimiento", $this->numero_seguimiento);
        $result->bindParam(":prfoto", $this->pdf_foto);
        $result->bindParam(":probservacion", $this->observacion);

        $this->id_venta=htmlspecialchars(strip_tags($this->id_venta));
        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->id_courier=htmlspecialchars(strip_tags($this->id_courier));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->numero_seguimiento=htmlspecialchars(strip_tags($this->numero_seguimiento));
        $this->pdf_foto=htmlspecialchars(strip_tags($this->pdf_foto));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
        {
            $row = $result->fetch(PDO::FETCH_ASSOC) ;
    
            return $row['id'] ;
        }
        return false; 
    }

    function actualizar(){
        $query = "CALL sp_actualizarseguimiento(
            :prid,
            :prcourier,
            :prfecha,
            :prseguimiento,
            :prfoto,
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_seguimiento);
        $result->bindParam(":prcourier", $this->id_courier);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prseguimiento", $this->numero_seguimiento);
        $result->bindParam(":prfoto", $this->pdf_foto);
        $result->bindParam(":probservacion", $this->observacion);

        $this->id_seguimiento=htmlspecialchars(strip_tags($this->id_seguimiento));
        $this->id_courier=htmlspecialchars(strip_tags($this->id_courier));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->numero_seguimiento=htmlspecialchars(strip_tags($this->numero_seguimiento));
        $this->pdf_foto=htmlspecialchars(strip_tags($this->pdf_foto));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
        {
            return true;
        }
        return false;  
    }

    function registrar_entrega(){
        $query = "CALL sp_actualizarseguimientoentrega(
            :prid,
            :prfecha,
            :prusuario
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_seguimiento);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prusuario", $this->usuario);

        $this->id_seguimiento=htmlspecialchars(strip_tags($this->id_seguimiento));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->usuario=htmlspecialchars(strip_tags($this->usuario));

        if($result->execute())
        {
            return true;
        }
        return false; 
    }

    function eliminar(){
        $query = "CALL sp_eliminarseguimiento(
            :prid
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_seguimiento);

        $this->id_seguimiento=htmlspecialchars(strip_tags($this->id_seguimiento));

        if($result->execute())
        {
            return true;
        }
        return false; 
    }

}

?>