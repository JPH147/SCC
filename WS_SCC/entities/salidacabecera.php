<?php



Class SalidaCabecera{

    private $conn;
    private $detalle;

    public $id_salida;
    public $pecosa;
    public $id_sucursal;
    public $sucursal;
    public $fecha;
    public $destino;
    public $id_tipo_movilidad;
    public $estado;

    public $numero_pagina;
    public $total_pagina;
    public $orden;

    public $fecha_inicio;
    public $fecha_fin;

    public function __construct($db){
        $this->conn = $db;
        include_once 'salidadetalle.php';
        $this->detalle = new SalidaDetalle($db);
    }


    function read(){

        $query = "CALL sp_listarsalidacabecera(?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->pecosa);
        $result->bindParam(2, $this->id_sucursal);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->destino);
        $result->bindParam(6, $this->id_tipo_movilidad);
        $result->bindParam(7, $this->numero_pagina);
        $result->bindParam(8, $this->total_pagina);
        $result->bindParam(9, $this->orden);

        $result->execute();
        
        $SCabecera_list=array();
        $SCabecera_list["salidas"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $SGasto=$this->detalle->read_gasto($id);
            $SMovilidad=$this->detalle->read_movilidad($id);
            $SVendedor=$this->detalle->read_vendedor($id);
            $SProducto=$this->detalle->read_producto($id);
            $salida_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "pecosa"=>$pecosa,                
                "sucursal"=>$sucursal,
                "fecha"=>$fecha,
                "destino"=>$destino,
                "tipo_movilidad"=>$tipo_movilidad,
                "movilidad"=>$SMovilidad,
                "gasto"=>$SGasto,
                "productos"=>$SProducto,
                "vendedor"=>$SVendedor,
                "estado"=>$estado
            );
            array_push($SCabecera_list["salidas"],$salida_item);
        }

        return $SCabecera_list;
    }

    // function contar(){

    //     $query = "CALL sp_listartransaccioncabeceracontar(?,?,?,?,?,?,?)";

    //     $result = $this->conn->prepare($query);

    //     $result->bindParam(1, $this->almacen);
    //     $result->bindParam(2, $this->tipo);
    //     $result->bindParam(3, $this->referencia);
    //     $result->bindParam(4, $this->referente);
    //     $result->bindParam(5, $this->fecha_inicio);
    //     $result->bindParam(6, $this->fecha_fin);
    //     $result->bindParam(7, $this->documento);

    //     $result->execute();

    //     $row = $result->fetch(PDO::FETCH_ASSOC);

    //     $this->total_resultado=$row['total'];

    //     return $this->total_resultado;
    // }

    // /* Seleccionar producto */
    // function readxId(){
    //     $query ="call sp_listartransaccioncabeceraxId(?)";
        
    //     $result = $this->conn->prepare($query);
        
    //     $result->bindParam(1, $this->id_transaccion);
        
    //     $result->execute();
    
    //     $row = $result->fetch(PDO::FETCH_ASSOC);

    //     $this->detalle->readxcabecera($row['idtransaccion_cabecera']);

    //     $this->id_transaccion=$row['idtransaccion_cabecera'];
    //     $this->id_almacen=$row['id_almacen'];
    //     $this->id_tipo=$row['id_tipo_transaccion'];
    //     $this->id_referencia=$row['tsccab_referencia'];
    //     $this->id_proveedor=$row['id_proveedor'];
    //     $this->id_cliente=$row['id_cliente'];
    //     $this->id_salida_venta=$row['id_salida_venta'];
    //     $this->id_sucursal=$row['id_sucursal'];
    //     $this->id_vendedor=$row['id_vendedor'];
    //     $this->fecha=$row['tsccab_fecha'];
    //     $this->documento=$row['tsccab_documento_referencia'];
    //     $this->transaccion_detalle=$this->detalle->readxcabecera($row['idtransaccion_cabecera']);
    // }

    // /* Crear producto */
    // function create()
    // {
    //     $query = "call sp_creartransaccioncabecera(
    //         :pralmacen,
    //         :prtipo,
    //         :prreferencia,
    //         :prproveedor,
    //         :prcliente,
    //         :prsalida,
    //         :prsucursal,
    //         :prvendedor,
    //         :prfecha,
    //         :prdocumento,
    //         @id
    //     )";

    //     $result = $this->conn->prepare($query);

    //     $result->bindParam(":pralmacen", $this->id_almacen);
    //     $result->bindParam(":prtipo", $this->id_tipo);
    //     $result->bindParam(":prreferencia", $this->id_referencia);
    //     $result->bindParam(":prproveedor", $this->id_proveedor);
    //     $result->bindParam(":prcliente", $this->id_cliente);
    //     $result->bindParam(":prsalida", $this->id_salida_venta);
    //     $result->bindParam(":prsucursal", $this->id_sucursal);
    //     $result->bindParam(":prvendedor", $this->id_vendedor);
    //     $result->bindParam(":prfecha", $this->fecha);
    //     $result->bindParam(":prdocumento", $this->documento);
    //   //  $result->bindParam("@id", $this->id_transaccion);

    //     $this->id_almacen=htmlspecialchars(strip_tags($this->id_almacen));
    //     $this->id_tipo=htmlspecialchars(strip_tags($this->id_tipo));
    //     $this->id_referencia=htmlspecialchars(strip_tags($this->id_referencia));

    //     if(!empty($this->id_proveedor)){
    //        $this->id_proveedor=htmlspecialchars(strip_tags($this->id_proveedor)); 
    //     };

    //     if(!empty($this->id_cliente)){
    //        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
    //     };

    //     if(!empty($this->id_salida_venta)){
    //         $this->id_salida_venta=htmlspecialchars(strip_tags($this->id_salida_venta));
    //     };

    //     if(!empty($this->id_sucursal)){
    //         $this->id_sucursal=htmlspecialchars(strip_tags($this->id_sucursal));
    //     };

    //     if(!empty($this->id_vendedor)){
    //         $this->id_vendedor=htmlspecialchars(strip_tags($this->id_vendedor));
    //     };

    //     $this->fecha=htmlspecialchars(strip_tags($this->fecha));
    //     $this->documento=htmlspecialchars(strip_tags($this->documento));

    //     if($result->execute())
    //     {
    //         while($row = $result->fetch(PDO::FETCH_ASSOC))
    //         {
    //             extract($row);
    //             $this->id=$idtransaccion;
    //         }
    //         return true;
    //     }
        
    //     return false;
    // }

    // /* Eliminar producto */
    // function delete()
    // {
    //     $query = "call sp_eliminartransaccioncabecera(?)";
    //     $result = $this->conn->prepare($query);

    //     $result->bindParam(1, $this->id_transaccion);

    //     if($result->execute())
    //         {
    //             return true;
    //         }
    //         else
    //         {
    //             return false;
    //         }
    // }

    // /* Actualizar producto */
    // function update()
    // {
    //     $query = "call sp_actualizartransaccioncabecera(
    //         :prid,
    //         :pralmacen,
    //         :prtipo,
    //         :prreferencia,
    //         :prproveedor,
    //         :prcliente,
    //         :prsalida,
    //         :prsucursal,
    //         :prvendedor,
    //         :prfecha,
    //         :prdocumento
    //     )";
    //     $result = $this->conn->prepare($query);

    //     $result->bindParam(":prid", $this->id_transaccion);
    //     $result->bindParam(":pralmacen", $this->id_almacen);
    //     $result->bindParam(":prtipo", $this->id_tipo);
    //     $result->bindParam(":prreferencia", $this->id_referencia);
    //     $result->bindParam(":prproveedor", $this->id_proveedor);
    //     $result->bindParam(":prcliente", $this->id_cliente);
    //     $result->bindParam(":prsalida", $this->id_salida_venta);
    //     $result->bindParam(":prsucursal", $this->id_sucursal);
    //     $result->bindParam(":prvendedor", $this->id_vendedor);
    //     $result->bindParam(":prfecha", $this->fecha);
    //     $result->bindParam(":prdocumento", $this->documento);

    //     $this->id_transaccion=htmlspecialchars(strip_tags($this->id_transaccion));
    //     $this->id_almacen=htmlspecialchars(strip_tags($this->id_almacen));
    //     $this->id_tipo=htmlspecialchars(strip_tags($this->id_tipo));
    //     $this->id_referencia=htmlspecialchars(strip_tags($this->id_referencia));

    //     if(!empty($this->id_proveedor)){
    //        $this->id_proveedor=htmlspecialchars(strip_tags($this->id_proveedor)); 
    //     };

    //     if(!empty($this->id_cliente)){
    //        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
    //     };

    //     if(!empty($this->id_salida_venta)){
    //         $this->id_salida_venta=htmlspecialchars(strip_tags($this->id_salida_venta));
    //     };

    //     if(!empty($this->id_sucursal)){
    //         $this->id_sucursal=htmlspecialchars(strip_tags($this->id_sucursal));
    //     };

    //     if(!empty($this->id_vendedor)){
    //         $this->id_vendedor=htmlspecialchars(strip_tags($this->id_vendedor));
    //     };

    //     $this->fecha=htmlspecialchars(strip_tags($this->fecha));
    //     $this->documento=htmlspecialchars(strip_tags($this->documento));

    //     if($result->execute())
    //         {
    //             return true;
    //         }
    //         else
    //         {
    //             return false;
    //         }
    // }
}
?>