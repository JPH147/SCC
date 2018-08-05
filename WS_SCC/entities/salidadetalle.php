<?php



Class SalidaDetalle{

    private $conn;
    private $detalle;

    public $id_salida_detalle;
    public $pecosa;
    public $id_sucursal;
    public $sucursal;
    public $fecha;
    public $destino;
    public $id_tipo_movilidad;
    public $estado;
    public $chofer_dni;
    public $chofer_nombre;

    public $numero_pagina;
    public $total_pagina;
    public $orden;

    public $fecha_inicio;
    public $fecha_fin;

    public function __construct($db){
        $this->conn = $db;
    }


    function read_vendedor($id_cabecera){

        $query = "CALL sp_listarsalidadetallevendedorxcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $id_cabecera);

        $result->execute();
        
        $SDetalle_list=array();
        $SDetalle_list["salidas"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
       //     $SDetalle=$this->detalle->readxcabecera($id);
            $detalle_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "cabecera"=>$cabecera,                
                "vendedor"=>$vendedor,
                "comision_efectiva"=>$comision_efectiva,
                "comision_retenida"=>$comision_retenida
            );
            array_push($SDetalle_list["salidas"],$detalle_item);
        }

        return $SDetalle_list;
    }

    function read_gasto($id_cabecera){

        $query = "CALL sp_listarsalidadetallegastoxcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $id_cabecera);

        $result->execute();
        
        $SDetalle_list=array();
        $SDetalle_list["salidas"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $detalle_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "cabecera"=>$cabecera,                
                "fecha"=>$fecha,
                "vendedor"=>$vendedor,
                "monto"=>$monto,
                "asignacion"=>$asignacion,
                "observacion"=>$observacion
            );
            array_push($SDetalle_list["salidas"],$detalle_item);
        }

        return $SDetalle_list;
    }

    function read_producto($id_cabecera){

        $query = "CALL sp_listarsalidadetalleproductoxcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $id_cabecera);

        $result->execute();
        
        $SDetalle_list=array();
        $SDetalle_list["salidas"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $detalle_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "cabecera"=>$cabecera,                
                "producto"=>$producto,
                "serie"=>$serie,
                "precio"=>$precio,
                "cantidad"=>$cantidad
            );
            array_push($SDetalle_list["salidas"],$detalle_item);
        }

        return $SDetalle_list;
    }

    function read_movilidad($id_cabecera){

        $query = "CALL sp_listarsalidadetallemovilidadxcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $id_cabecera);

        $result->execute();
        
        $SDetalle_list=array();
        $SDetalle_list["salidas"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $detalle_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "cabecera"=>$cabecera,                
                "vehiculo"=>$vehiculo,
                "chofer_dni"=>$chofer_dni,
                "chofer_nombre"=>$chofer_nombre
            );
            array_push($SDetalle_list["salidas"],$detalle_item);
        }

        return $SDetalle_list;
    }

}
?>