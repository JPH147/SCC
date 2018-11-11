<?php



Class TransaccionCabecera{

    private $conn;
    private $detalle;

    public $numero_pagina;
    public $total_pagina;
    public $total_resultado;
    public $orden;
    public $id;
    public $id_transaccion;
    public $almacen;
    public $id_almacen;
    public $tipo;
    public $id_tipo;
    public $referencia;
    public $id_referencia;
    public $referente;
    public $id_proveedor;
    public $id_cliente;
    public $id_salida_venta;
    public $id_sucursal;
    public $id_vendedor;
    public $fecha;
    public $producto;
    public $serie;
    public $fecha_inicio;
    public $fecha_fin;
    public $documento;
    public $transaccion_detalle;
    public $tipo_transaccion;
    public $proxnumero;

    public function __construct($db){
        $this->conn = $db;
        include_once '../entities/transacciondetalle.php';
        $this->detalle = new TransaccionDetalle($db);
    }

    /* Listar productos */
    function read(){

        $query = "CALL sp_listartransaccioncabecera(?,?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->almacen);
        $result->bindParam(2, $this->tipo);
        $result->bindParam(3, $this->referencia);
        $result->bindParam(4, $this->referente);
        $result->bindParam(5, $this->fecha_inicio);
        $result->bindParam(6, $this->fecha_fin);
        $result->bindParam(7, $this->documento);
        $result->bindParam(8, $this->numero_pagina);
        $result->bindParam(9, $this->total_pagina);
        $result->bindParam(10, $this->orden);

        $result->execute();
        
        $TCabecera_list=array();
        $TCabecera_list["transacciones"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $TDetalle=$this->detalle->readxcabecera($id);
            $transaccion_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "almacen"=>$almacen,                
                "tipo"=>$tipo,
                "referencia"=>$referencia,
                "referente"=>$referente,
                "fecha"=>$fecha,
                "documento"=>$documento,
                "detalle"=>$TDetalle
            );
            array_push($TCabecera_list["transacciones"],$transaccion_item);
        }

        return $TCabecera_list;
    }

    function contar(){

        $query = "CALL sp_listartransaccioncabeceracontar(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->almacen);
        $result->bindParam(2, $this->tipo);
        $result->bindParam(3, $this->referencia);
        $result->bindParam(4, $this->referente);
        $result->bindParam(5, $this->fecha_inicio);
        $result->bindParam(6, $this->fecha_fin);
        $result->bindParam(7, $this->documento);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    /* Seleccionar producto */
    function readxId(){
        $query ="call sp_listartransaccioncabeceraxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_transaccion);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->detalle->readxcabecera($row['id']);

        $this->id=$row['id'];
        $this->almacen=$row['almacen'];
        $this->id_tipo=$row['id_tipo_transaccion'];
        $this->tipo=$row['tipo_transaccion'];
        $this->referencia=$row['referencia'];
        $this->proveedor=$row['proveedor'];
        $this->cliente=$row['cliente'];
        $this->salida_venta=$row['salida_venta'];
        $this->sucursal=$row['sucursal'];
        $this->vendedor=$row['vendedor'];
        $this->fecha=$row['fecha'];
        $this->documento=$row['documento'];
        $this->transaccion_detalle=$this->detalle->readxcabecera($row['id']);
    }

    /* Crear producto */
    function create(){
        $query = "call sp_creartransaccioncabecera(
            :pralmacen,
            :prtipo,
            :prreferencia,
            :prproveedor,
            :prcliente,
            :prsalida,
            :prsucursal,
            :prvendedor,
            :prfecha,
            :prdocumento
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pralmacen", $this->id_almacen);
        $result->bindParam(":prtipo", $this->id_tipo);
        $result->bindParam(":prreferencia", $this->id_referencia);
        $result->bindParam(":prproveedor", $this->id_proveedor);
        $result->bindParam(":prcliente", $this->id_cliente);
        $result->bindParam(":prsalida", $this->id_salida_venta);
        $result->bindParam(":prsucursal", $this->id_sucursal);
        $result->bindParam(":prvendedor", $this->id_vendedor);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prdocumento", $this->documento);
      //  $result->bindParam("@id", $this->id_transaccion);

        $this->id_almacen=htmlspecialchars(strip_tags($this->id_almacen));
        $this->id_tipo=htmlspecialchars(strip_tags($this->id_tipo));
        $this->id_referencia=htmlspecialchars(strip_tags($this->id_referencia));

        if(!empty($this->id_proveedor)){
           $this->id_proveedor=htmlspecialchars(strip_tags($this->id_proveedor)); 
        };

        if(!empty($this->id_cliente)){
           $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        };

        if(!empty($this->id_salida_venta)){
            $this->id_salida_venta=htmlspecialchars(strip_tags($this->id_salida_venta));
        };

        if(!empty($this->id_sucursal)){
            $this->id_sucursal=htmlspecialchars(strip_tags($this->id_sucursal));
        };

        if(!empty($this->id_vendedor)){
            $this->id_vendedor=htmlspecialchars(strip_tags($this->id_vendedor));
        };

        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->documento=htmlspecialchars(strip_tags($this->documento));

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id=$idtransaccion;
            }
            return true;
        }
        
        return false;
    }

    /* Eliminar producto */
    function delete(){
        $query = "call sp_eliminartransaccioncabecera(?)";
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
        $query = "call sp_actualizartransaccioncabecera(
            :prid,
            :pralmacen,
            :prtipo,
            :prreferencia,
            :prproveedor,
            :prcliente,
            :prsalida,
            :prsucursal,
            :prvendedor,
            :prfecha,
            :prdocumento
        )";
        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_transaccion);
        $result->bindParam(":pralmacen", $this->id_almacen);
        $result->bindParam(":prtipo", $this->id_tipo);
        $result->bindParam(":prreferencia", $this->id_referencia);
        $result->bindParam(":prproveedor", $this->id_proveedor);
        $result->bindParam(":prcliente", $this->id_cliente);
        $result->bindParam(":prsalida", $this->id_salida_venta);
        $result->bindParam(":prsucursal", $this->id_sucursal);
        $result->bindParam(":prvendedor", $this->id_vendedor);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prdocumento", $this->documento);

        $this->id_transaccion=htmlspecialchars(strip_tags($this->id_transaccion));
        $this->id_almacen=htmlspecialchars(strip_tags($this->id_almacen));
        $this->id_tipo=htmlspecialchars(strip_tags($this->id_tipo));
        $this->id_referencia=htmlspecialchars(strip_tags($this->id_referencia));

        if(!empty($this->id_proveedor)){
           $this->id_proveedor=htmlspecialchars(strip_tags($this->id_proveedor)); 
        };

        if(!empty($this->id_cliente)){
           $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        };

        if(!empty($this->id_salida_venta)){
            $this->id_salida_venta=htmlspecialchars(strip_tags($this->id_salida_venta));
        };

        if(!empty($this->id_sucursal)){
            $this->id_sucursal=htmlspecialchars(strip_tags($this->id_sucursal));
        };

        if(!empty($this->id_vendedor)){
            $this->id_vendedor=htmlspecialchars(strip_tags($this->id_vendedor));
        };

        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->documento=htmlspecialchars(strip_tags($this->documento));

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }


    function readxproveedor(){

        $query = "CALL sp_listartransaccionxproveedor(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_proveedor);
        $result->bindParam(2, $this->producto);
        $result->bindParam(3, $this->serie);
        $result->bindParam(4, $this->fecha_inicio);
        $result->bindParam(5, $this->fecha_fin);
        $result->bindParam(6, $this->numero_pagina);
        $result->bindParam(7, $this->total_pagina);

        $result->execute();
        
        $TCabecera_list=array();
        $TCabecera_list["transacciones"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $TDetalle=$this->detalle->readxcabecera($id);
            $transaccion_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "almacen"=>$almacen,                
                "referencia"=>$documento_referencia,
                "fecha"=>$fecha
            );
            array_push($TCabecera_list["transacciones"],$transaccion_item);
        }

        return $TCabecera_list;
    }

    function readxproveedorcontar(){

        $query = "CALL sp_listartransaccionxproveedorcontar(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_proveedor);
        $result->bindParam(2, $this->producto);
        $result->bindParam(3, $this->serie);
        $result->bindParam(4, $this->fecha_inicio);
        $result->bindParam(5, $this->fecha_fin);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function select(){

        $query = "CALL sp_seleccionarproxdocalmacen(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_almacen);
        $result->bindParam(2, $this->tipo_transaccion);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->serie=$row['serie'];
        $this->proxnumero=$row['numero'];
    }

}
?>