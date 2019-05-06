<?php

Class SalidaCabecera{

    private $conn;
    private $detalle;

    public $id_salida;
    public $id;
    public $numero;
    public $codigo;
    public $pecosa;
    public $id_sucursal;
    public $sucursal;
    public $id_almacen;
    public $almacen;

    public $destino;
    public $id_tipo_movilidad;
    public $id_estado;
    public $estado;
    public $tipo;
    public $monto;

    public $numero_pagina;
    public $total_pagina;
    public $orden;

    public $guia;
    public $tipo_movilidad;
    public $observacion;

    public $cabecera;
    public $vehiculo;
    public $vehiculo_placa;
    public $chofer_dni;
    public $chofer_nombre;
    public $id_producto;
    public $serie;
    public $precio;
    public $cantidad;
    public $id_vendedor;
    public $vendedor;
    public $comisiones;
    public $documento;

    public $id_serie;
    public $precio_minimo;
    public $precio_venta;
    public $id_venta;
    public $contrato;

    public $talonarios;
    public $productos;
    public $vendedores;
    public $viaticos;

    public $comision_efectiva;
    public $comision_retenida;
    public $talonario;
    
    public $fecha;
    public $fecha_inicio;
    public $fecha_fin;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarsalidacabecera(?,?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->pecosa);
        $result->bindParam(2, $this->id_sucursal);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->destino);
        $result->bindParam(6, $this->vendedor);
        $result->bindParam(7, $this->estado);
        $result->bindParam(8, $this->numero_pagina);
        $result->bindParam(9, $this->total_pagina);
        $result->bindParam(10, $this->orden);

        $result->execute();
        
        $SCabecera_list=array();
        $SCabecera_list["salidas"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $salida_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "pecosa"=>$pecosa,                
                "sucursal"=>$sucursal,
                "fecha"=>$fecha,
                "destino"=>$destino,
                "vehiculo_placa"=>$vehiculo_placa,
                "chofer_dni"=>$chofer_dni,
                "chofer_nombre"=>$chofer_nombre,
                "id_estado"=>$id_estado,
                "estado"=>$estado
            );
            array_push($SCabecera_list["salidas"],$salida_item);
        }

        return $SCabecera_list;
    }

    function contar(){

        $query = "CALL sp_listarsalidacabeceracontar(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->pecosa);
        $result->bindParam(2, $this->id_sucursal);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->destino);
        $result->bindParam(6, $this->vendedor);
        $result->bindParam(7, $this->estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function generar_numero(){
        $query ="call sp_seleccionarproximasalida()";
        
        $result = $this->conn->prepare($query);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
      
        $this->numero=$row['numero'];
    }

    function create(){

        $query = "call sp_crearsalidavendedor(
            :prcodigo,
            :prsucursal,
            :pralmacen,
            :prfecha,
            :prdestino,
            :prguia,
            :prvehiculo,
            :prchoferdni,
            :prchofernombre,
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcodigo", $this->pecosa);
        $result->bindParam(":prsucursal", $this->id_sucursal);
        $result->bindParam(":pralmacen", $this->id_almacen);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prdestino", $this->destino);
        $result->bindParam(":prguia", $this->guia);
        $result->bindParam(":probservacion", $this->observacion);
        $result->bindParam(":prvehiculo", $this->vehiculo);
        $result->bindParam(":prchoferdni", $this->chofer_dni);
        $result->bindParam(":prchofernombre", $this->chofer_nombre);

        $this->pecosa=htmlspecialchars(strip_tags($this->pecosa));
        $this->id_sucursal=htmlspecialchars(strip_tags($this->id_sucursal));
        $this->id_almacen=htmlspecialchars(strip_tags($this->id_almacen));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->destino=htmlspecialchars(strip_tags($this->destino));
        $this->vehiculo=htmlspecialchars(strip_tags($this->vehiculo));
        $this->chofer_dni=htmlspecialchars(strip_tags($this->chofer_dni));
        $this->chofer_nombre=htmlspecialchars(strip_tags($this->chofer_nombre));

        if(!empty($this->guia)){
           $this->guia=htmlspecialchars(strip_tags($this->guia)); 
        };

        if(!empty($this->observacion)){
           $this->observacion=htmlspecialchars(strip_tags($this->observacion)); 
        };

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id=$prid;
            }
            return true;
        }
        
        return false;
    }

    function create_producto(){

        $query = "call sp_crearsalidavendedorproducto(
            :pridcabecera,
            :prserie,
            :prprecio,
            :prfecha
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pridcabecera", $this->cabecera);
        $result->bindParam(":prserie", $this->serie);
        $result->bindParam(":prprecio", $this->precio);
        $result->bindParam(":prfecha", $this->fecha);

        $this->cabecera=htmlspecialchars(strip_tags($this->cabecera));
        $this->serie=htmlspecialchars(strip_tags($this->serie));
        $this->precio=htmlspecialchars(strip_tags($this->precio));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function create_vendedor(){

        $query = "call sp_crearsalidavendedorvendedor(
            :pridcabecera,
            :prvendedor,
            :prcomisionefectiva,
            :prcomisionretenida
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pridcabecera", $this->cabecera);
        $result->bindParam(":prvendedor", $this->vendedor);
        $result->bindParam(":prcomisionefectiva", $this->comision_efectiva);
        $result->bindParam(":prcomisionretenida", $this->comision_retenida);

        $this->cabecera=htmlspecialchars(strip_tags($this->cabecera));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->comision_efectiva=htmlspecialchars(strip_tags($this->comision_efectiva));
        $this->comision_retenida=htmlspecialchars(strip_tags($this->comision_retenida));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function create_talonario(){

        $query = "call sp_crearsalidavendedortalonario(
            :prtalonario,
            :pridcabecera,
            :prfecha
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prtalonario", $this->talonario);
        $result->bindParam(":pridcabecera", $this->cabecera);
        $result->bindParam(":prfecha", $this->fecha);

        $this->talonario=htmlspecialchars(strip_tags($this->talonario));
        $this->cabecera=htmlspecialchars(strip_tags($this->cabecera));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function readxId(){
        $query ="call sp_listarsalidacabeceraxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_salida);

        $Vendedores=$this->read_vendedores($this->id_salida);
        $Talonarios=$this->read_talonarios_compacto($this->id_salida);
        $Productos=$this->read_productos_compacto($this->id_salida);
        $Viaticos = $this->read_gasto($this->id_salida);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
      
        $this->id=$row['id'];
        $this->pecosa=$row['pecosa'];
        $this->id_sucursal=$row['id_sucursal'];
        $this->sucursal=$row['sucursal'];
        $this->id_almacen=$row['id_almacen'];
        $this->almacen=$row['almacen'];
        $this->fecha=$row['fecha'];
        $this->destino=$row['destino'];
        $this->guia=$row['guia'];
        $this->vehiculo_placa=$row['vehiculo_placa'];
        $this->chofer_dni=$row['chofer_dni'];
        $this->chofer_nombre=$row['chofer_nombre'];
        $this->observacion=$row['observacion'];
        $this->id_estado=$row['id_estado'];
        $this->estado=$row['estado'];
        $this->talonarios=$Talonarios;
        $this->vendedores=$Vendedores;
        $this->productos=$Productos;
        $this->viaticos=$Viaticos;
    }

    function read_ventas(){

        $query = "CALL sp_listarsalidacabeceraventas(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);

        $result->execute();
        
        $venta_list=array();
        $venta_list["ventas"]=array();
        $numero=0;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $numero=$numero+1;
            $venta_item = array (
                "numero"=>$numero,
                "id"=>$id,
                "contrato"=>$contrato,
                "total"=>$total,
                "comision"=>$comision,
            );
            array_push($venta_list["ventas"],$venta_item);
        }

        return $venta_list;
    }

    function read_viaticos(){

        $query = "CALL sp_listarsalidaviaticoxcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);

        $result->execute();
        
        $venta_list=array();
        $venta_list["viaticos"]=array();
        $numero=0;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $numero=$numero+1;
            $venta_item = array (
                "numero"=>$numero,
                "id"=>$id,
                "id_vendedor"=>$id_vendedor,
                "vendedor"=>$vendedor,
                "monto_grupal"=>$monto_grupal,
                "monto_individual"=>$monto_individual,
            );
            array_push($venta_list["viaticos"],$venta_item);
        }

        return $venta_list;
    }

    // Se muestran todas las series con su estado
    function read_productos(){

        $query = "CALL sp_listarsalidadetalleproductoxcabecera(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);
        $result->bindParam(2, $this->estado);

        $result->execute();
        
        $venta_list=array();
        $venta_list["productos"]=array();
        $numero=0;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $numero=$numero+1;
            $venta_item = array (
                "numero"=>$numero,
                "id"=>$id,
                "id_serie"=>$id_serie,
                "serie"=>$serie,
                "producto"=>$producto,
                "precio_minimo"=>$precio_minimo,
                "precio_venta"=>$precio_venta,
                "id_venta"=>$id_venta,
                "contrato"=>$contrato,
                "id_estado"=>$id_estado,
                "estado"=>$estado
            );
            array_push($venta_list["productos"],$venta_item);
        }

        return $venta_list;
    }

    // Se muestran todos los productos agrupados por producto
    function read_productos_compacto(){

        $query = "CALL sp_listarproductosxsalida(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);

        $result->execute();
        
        $venta_list=array();
        $venta_list["productos"]=array();
        $numero=0;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $numero=$numero+1;
            $venta_item = array (
                "numero"=>$numero,
                "id_producto"=>$id_producto,
                "descripcion"=>$descripcion,
                "cantidad"=>$cantidad,
                "fecha"=>$fecha
            );
            array_push($venta_list["productos"],$venta_item);
        }

        return $venta_list;
    }

    // Se muestran cada uno de los contratos con su estado (vendido, pendiente o anulado)
    function read_talonarios(){

        $query = "CALL sp_listarsalidadetalletalonarioxcabecera(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);
        $result->bindParam(2, $this->estado);

        $result->execute();
        
        $venta_list=array();
        $venta_list["talonarios"]=array();
        $numero=0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $numero=$numero+1;
            $venta_item = array (
                "numero"=>$numero,
                "id"=>$id,
                "id_talonario"=>$id_talonario,
                "contrato"=>$contrato,
                "id_venta"=>$id_venta,
                "documentos_adjuntos"=>$documentos_adjuntos,
                "documentos_totales"=>$documentos_totales,
                "estado_documentos"=>$estado_documentos,
                "id_estado"=>$id_estado,
                "estado"=>$estado,
            );
            array_push($venta_list["talonarios"],$venta_item);
        }

        return $venta_list;
    }

    // Se muestran agrupados por la serie
    function read_talonarios_compacto(){

        $query = "CALL sp_listartalonariosxcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);

        $result->execute();
        
        $venta_list=array();
        $venta_list["talonarios"]=array();
        $numero=0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $numero=$numero+1;
            $venta_item = array (
                "numero"=>$numero,
                "serie"=>$serie,
                "numero_inicio"=>$numero_inicio,
                "numero_fin"=>$numero_fin,
                "fecha"=>$fecha,
            );
            array_push($venta_list["talonarios"],$venta_item);
        }

        return $venta_list;
    }

    function read_vendedores(){

        $query = "CALL sp_listarsalidadetallevendedorxcabecera(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);

        $result->execute();
        
        $venta_list=array();
        $venta_list["vendedores"]=array();
        $numero=0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            $numero=$numero+1;
            extract($row);
            $venta_item = array (
                "numero"=>$numero,
                "id"=>$id,
                "id_vendedor"=>$id_vendedor,
                "vendedor"=>$vendedor,
                "comision_efectiva"=>$comision_efectiva,
                "comision_retenida"=>$comision_retenida,
                "viatico_personal"=>$viatico_personal,
                "viatico_grupal"=>$viatico_grupal,
            );
            array_push($venta_list["vendedores"],$venta_item);
        }

        return $venta_list;
    }

    function read_gasto(){

        $query = "CALL sp_listarsalidadetallegastoxcabecera(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);
        $result->bindParam(2, $this->numero_pagina);
        $result->bindParam(3, $this->total_pagina);

        $result->execute();
        
        $venta_list=array();
        $venta_list["gastos"]=array();
        $contador = $this->total_pagina*($this->numero_pagina-1);
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            $contador = $contador+1;
            extract($row);
            $venta_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "fecha"=>$fecha,
                "id_vendedor"=>$id_vendedor,
                "vendedor"=>$vendedor,
                "monto"=>$monto,
                "tipo"=>$tipo,
                "observacion"=>$observacion,
            );
            array_push($venta_list["gastos"],$venta_item);
        }

        return $venta_list;
    }

    function read_gasto_contar(){

        $query = "CALL sp_listarsalidadetallegastoxcabeceracontar(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function read_comisiones(){
        $query = "CALL sp_listarsalidacomisiones(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_salida);

        $result->execute();
        
        $venta_list=array();
        $venta_list["comisiones"]=array();
        $contador = 0;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            $contador = $contador+1;
            extract($row);
            $venta_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "id_vendedor"=>$id_vendedor,
                "vendedor"=>$vendedor,
                "comision_efectiva_porcentaje"=>$comision_efectiva_porcentaje,
                "comision_efectiva"=>$comision_efectiva,
                "comision_efectiva_pago"=>$comision_efectiva_pago,
                "comision_retenida_porcentaje"=>$comision_retenida_porcentaje,
                "comision_retenida"=>$comision_retenida,
                "comision_retenida_pago"=>$comision_retenida_pago,
            );
            array_push($venta_list["comisiones"],$venta_item);
        }

        return $venta_list;
    }

    function create_gasto(){

        $query = "call sp_crearsalidavendedorgasto(
            :cabecera,
            :fecha,
            :vendedor,
            :monto,
            :tipo,
            :observacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":cabecera", $this->id_salida);
        $result->bindParam(":fecha", $this->fecha);
        $result->bindParam(":vendedor", $this->vendedor);
        $result->bindParam(":monto", $this->monto);
        $result->bindParam(":tipo", $this->tipo);
        $result->bindParam(":observacion", $this->observacion);

        $this->id_salida=htmlspecialchars(strip_tags($this->id_salida));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->monto=htmlspecialchars(strip_tags($this->monto));
        $this->tipo=htmlspecialchars(strip_tags($this->tipo));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function delete_gasto(){

        $query = "call sp_eliminarsalidadetallegasto(
            :id_detalle
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_detalle", $this->id);

        $this->id=htmlspecialchars(strip_tags($this->id));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function delete(){

        $query = "call sp_eliminarsalida(
            :id_salida
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_salida", $this->id_salida);

        $this->id_salida=htmlspecialchars(strip_tags($this->id_salida));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function update(){

        $query = "call sp_actualizarsalidacabecera(
            :prid,
            :prfecha,
            :prdestino,
            :prguia,
            :prvehiculo,
            :prchoferdni,
            :prchofernombre,
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->cabecera);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prdestino", $this->destino);
        $result->bindParam(":prguia", $this->guia);
        $result->bindParam(":probservacion", $this->observacion);
        $result->bindParam(":prvehiculo", $this->vehiculo);
        $result->bindParam(":prchoferdni", $this->chofer_dni);
        $result->bindParam(":prchofernombre", $this->chofer_nombre);

        $this->cabecera=htmlspecialchars(strip_tags($this->cabecera));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->destino=htmlspecialchars(strip_tags($this->destino));
        $this->vehiculo=htmlspecialchars(strip_tags($this->vehiculo));
        $this->chofer_dni=htmlspecialchars(strip_tags($this->chofer_dni));
        $this->chofer_nombre=htmlspecialchars(strip_tags($this->chofer_nombre));

        if(!empty($this->guia)){
           $this->guia=htmlspecialchars(strip_tags($this->guia)); 
        };

        if(!empty($this->observacion)){
           $this->observacion=htmlspecialchars(strip_tags($this->observacion)); 
        };

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id=$prid;
            }
            return true;
        }
        
        return false;
    }

    function update_productos_venta(){

        $query = "call sp_actualizarsalidadetalleproducto_venta(
            :id_detalle_producto,
            :id_venta,
            :id_precio
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_detalle_producto", $this->id);
        $result->bindParam(":id_venta", $this->id_venta);
        $result->bindParam(":id_precio", $this->precio_venta);

        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->id_venta=htmlspecialchars(strip_tags($this->id_venta));
        $this->precio_venta=htmlspecialchars(strip_tags($this->precio_venta));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function update_productos_anular(){

        $query = "call sp_actualizarsalidadetalleproducto_anular(
            :id_detalle_producto,
            :prestado
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_detalle_producto", $this->id);
        $result->bindParam(":prestado", $this->estado);

        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->estado=htmlspecialchars(strip_tags($this->estado));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function update_talonarios_venta(){

        $query = "call sp_actualizarsalidadetalleproducto_venta(
            :id_detalle_talonario,
            :id_venta
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_detalle_talonario", $this->id);
        $result->bindParam(":id_venta", $this->id_venta);

        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->id_venta=htmlspecialchars(strip_tags($this->id_venta));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function update_talonarios_anular(){

        $query = "call sp_actualizarsalidadetalletalonario_anular(
            :id_detalle_talonario,
            :prestado
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_detalle_talonario", $this->id);
        $result->bindParam(":prestado", $this->estado);

        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->estado=htmlspecialchars(strip_tags($this->estado));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function update_vendedores(){

        $query = "call sp_actualizarsalidadetallevendedor(
            :id_salida_vendedor,
            :comision_efectiva, 
            :comision_retenida
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_salida_vendedor", $this->id);
        $result->bindParam(":comision_efectiva", $this->comision_efectiva);
        $result->bindParam(":comision_retenida", $this->comision_retenida);

        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->comision_efectiva=htmlspecialchars(strip_tags($this->comision_efectiva));
        $this->comision_retenida=htmlspecialchars(strip_tags($this->comision_retenida));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function create_llegada(){

        $query = "call sp_crearllegadavendedores(
            :id_cabecera,
            :fecha,
            :observacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_cabecera", $this->id_salida);
        $result->bindParam(":fecha", $this->fecha);
        $result->bindParam(":observacion", $this->observacion);

        $this->id_salida=htmlspecialchars(strip_tags($this->id_salida));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function create_llegada_productos(){

        $query = "call sp_crearretornovendedorproducto(
            :pridserie,
            :prsalida,
            :pralmacen,
            :precio,
            :prfecha,
            :prdocumento
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pridserie", $this->id_serie);
        $result->bindParam(":prsalida", $this->id_salida);
        $result->bindParam(":pralmacen", $this->almacen);
        $result->bindParam(":precio", $this->precio);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prdocumento", $this->documento);

        $this->id_serie=htmlspecialchars(strip_tags($this->id_serie));
        $this->id_salida=htmlspecialchars(strip_tags($this->id_salida));
        $this->almacen=htmlspecialchars(strip_tags($this->almacen));
        $this->precio=htmlspecialchars(strip_tags($this->precio));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->documento=htmlspecialchars(strip_tags($this->documento));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function create_llegada_talonarios(){

        $query = "call sp_crearretornovendedortalonario(
            :prtalonario,
            :prestado
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prtalonario", $this->talonario);
        $result->bindParam(":prestado", $this->estado);

        $this->talonario=htmlspecialchars(strip_tags($this->talonario));
        $this->estado=htmlspecialchars(strip_tags($this->estado));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

}
?>
