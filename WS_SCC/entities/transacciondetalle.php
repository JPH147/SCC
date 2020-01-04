<?php
Class TransaccionDetalle{

    private $conn;

    public $id_cabecera;
    public $id_transaccion;
    public $documento;
    public $id_producto;
    public $producto;
    public $id_producto_serie;
    public $serie;
    public $cantidad;
    public $precio;
    public $observacion;
    public $color;
    public $almacenamiento;

    public function __construct($db){
        $this->conn = $db;
    }

    /* Listar productos */
    function read(){

        $query = "CALL sp_listartransacciondetalle(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_cabecera);
        $result->bindParam(2, $this->producto);
        $result->bindParam(3, $this->serie);
        $result->bindParam(4, $this->tipo);
        $result->bindParam(5, $this->referencia);
        $result->bindParam(6, $this->referente);

        $result->execute();
        
        $detalle_list=array();
        $detalle_list["detalles"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $detalle_items = array (
                "numero"=>$contador,
                "cabecera"=>$id_movimiento_cabecera,
                "referencia"=>$referencia,
                "referente"=>$referente,
                "tipo"=>$tipo,
                "producto"=>$prd_descripcion,
                "serie"=>$ps_serie,
                "cantidad"=>$tscdet_cantidad,
                "precio"=>$precio,
                "observacion"=>$tscdet_observacion
            );
            array_push($detalle_list["detalles"],$detalle_items);
        }

        return $detalle_list;
    }

    function contar(){

        $query = "CALL sp_listartransacciondetallecontar(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_cabecera);
        $result->bindParam(2, $this->producto);
        $result->bindParam(3, $this->serie);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_detalle=$row['total'];

        return $this->total_detalle;
    }

    function readxcabecera($id_cabecera){

        $query ="call sp_listartransacciondetallexcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $id_cabecera);

        $result->execute();

        $detalle_list=array();

        $contador = 0;;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {   
            // echo "hola";
            extract($row);
            $contador=$contador+1;
            $detalle_items = array (
                "numero"=>$contador,
                "id"=>$id,
                "producto"=>$producto,
                "serie"=>$serie,
                "id_serie"=>$id_serie,
                "color"=>$color,
                "almacenamiento"=>$almacenamiento,
                "cantidad"=>$cantidad,
                "precio"=>$precio,
                "observacion"=>$observacion
            );
            array_push($detalle_list,$detalle_items);
        }

        return $detalle_list;
    }

    function readxId()
    {
        $query ="call sp_listartransacciondexId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_transaccion);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->id_transaccion=$row['idtransaccion_detalle'];
        $this->id_cabecera=$row['id_movimiento_cabecera'];
        $this->id_producto_serie=$row['id_producto_serie'];
        $this->serie=$row['tscdet_serie'];
        $this->cantidad=$row['tscdet_cantidad'];
        $this->precio=$row['tscdet_precio'];
        $this->observacion=$row['tscdet_observacion'];
    }

    function readxdocumento(){

        $query = "CALL sp_listartransacciondetallexdocumento(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->documento);

        $result->execute();
        
        $detalle_list=array();
        $detalle_list["detalles"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $detalle_items = array (
                "numero"=>$contador,
                "producto"=>$producto,
                "serie"=>$serie,
                "color"=>$color,
                "almacenamiento"=>$almacenamiento,
                "cantidad"=>$cantidad,
                "precio"=>$precio,
                "observacion"=>$observacion
            );
            array_push($detalle_list["detalles"],$detalle_items);
        }

        return $detalle_list;
    }

    /* Crear producto */
    function create()
    {
        $query = "call sp_creartransacciondetalle(
            :prcabecera,
            :prproductoserie,
            :prcantidad,
            :prprecio,
            :probservacion
            )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcabecera", $this->id_cabecera);
        $result->bindParam(":prproductoserie", $this->id_producto_serie);
        $result->bindParam(":prcantidad", $this->cantidad);
        $result->bindParam(":prprecio", $this->precio);
        $result->bindParam(":probservacion", $this->observacion);

        $this->id_cabecera=htmlspecialchars(strip_tags($this->id_cabecera));
        $this->id_producto=htmlspecialchars(strip_tags($this->id_producto));
        $this->cantidad=htmlspecialchars(strip_tags($this->cantidad));
        $this->precio=htmlspecialchars(strip_tags($this->precio));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    /* Eliminar producto */
    function delete(){
        $query = "call sp_eliminartransacciondetalle(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_transaccion);

        if($result->execute())
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /* Actualizar producto */
    function update(){
        $query = "call sp_actualizartransacciondetalle(
            :prid,
            :prproductoserie,
            :prcantidad,
            :observacion
            )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_transaccion);
        $result->bindParam(":prproductoserie", $this->id_producto_serie);
        $result->bindParam(":prcantidad", $this->cantidad);
        $result->bindParam(":prprecio", $this->observacion);

        $this->id_transaccion=htmlspecialchars(strip_tags($this->id_transaccion));
        $this->id_producto=htmlspecialchars(strip_tags($this->id_producto));
        $this->serie=htmlspecialchars(strip_tags($this->serie));
        $this->cantidad=htmlspecialchars(strip_tags($this->cantidad));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    function eliminar_compra(){
        $query = "call sp_eliminartransacciondetallecompra(?,?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_transaccion);
        $result->bindParam(2, $this->id_producto_serie);

        $this->id_transaccion=htmlspecialchars(strip_tags($this->id_transaccion));
        $this->id_producto_serie=htmlspecialchars(strip_tags($this->id_producto_serie));

        if($result->execute())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
?>