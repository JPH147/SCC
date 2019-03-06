<?php
Class Venta{

    private $conn;
    private $table_name = "venta";

    public $id_venta;
    public $id_talonario;
    public $id_autorizador;
    public $id_cliente;
    public $id_clientedireccion;
    public $id_clientetelefono;
    public $clientecargo;
    public $vnt_fecha;
    public $id_vendedor;
    public $nombre_vendedor;
    public $nombre_autorizador;
    public $vnt_contrato_pdf;
    public $tipo_documento;
    public $vnt_dni_pdf;
    public $vnt_cip_pdf;
    public $vnt_planilla_pdf;
    public $vnt_letra_pdf;
    public $vnt_voucher_pdf;
    public $vnt_autorizacion_pdf;
    public $vnt_fecha_inicio;
    public $vnt_inicial;
    public $vnt_numero_cuota;
    public $id_tipopago;
    public $vnt_total;
    public $vnt_tipoventa;
    public $id_tipoventa_referencia;
    public $vnt_observaciones;
    public $vnt_estado;
    public $vnt_lugarventa;
    public $venta;
    public $monto;
    public $vencimiento;
    public $producto_serie;
    public $precio;
    public $productos;
    public $cronograma;
    public $talonario_serie;
    public $talonario_numero;
    public $talonario_contrato;
    public $tipo_pago;
    public $nombre_sucursal;
    public $total_cuotas;
    public $cuotas_pagadas;
    public $estado;
    public $venta_nueva;
    public $venta_anterior;
    public $id_transaccion;
    public $transacciones;
    public $id_venta_canje;
    public $canje_talonario_serie;
    public $canje_talonario_contrato;

    public $numero_pagina;
    public $total_pagina;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarventa(?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_venta);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->estado);
        $result->bindParam(6, $this->numero_pagina);
        $result->bindParam(7, $this->total_pagina);
        $result->bindParam(8, $this->orden);

        $result->execute();
        
        $venta_list=array();
        $venta_list["ventas"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $venta_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "serie"=>$serie,
                "contrato"=>$contrato,
                "sede"=>$sede,
                "subsede"=>$subsede,
                "autorizador_nombre"=>$autorizador_nombre,
                "id_cliente"=>$id_cliente,
                "cliente_nombre"=>$cliente_nombre,
                "fecha"=>$fecha,
                "vendedor"=>$vendedor,
                "fecha_inicio"=>$fecha_inicio,
                "monto_inicial"=>$monto_inicial,
                "numero_coutas"=>$numero_coutas,
                "tipo_pago"=>$tipo_pago,
                "monto_total"=>$monto_total,
                "tipo_venta"=>$tipo_venta,
                "observaciones"=>$observaciones,
                "estado"=>$estado,
            );
            array_push($venta_list["ventas"],$venta_item);
        }

        return $venta_list;
    }

    function contar(){

        $query = "CALL sp_listarventacontar(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_venta);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function create(){

        $query = "CALL sp_crearventa(
        :prfecha,
        :prsucursal,
        :prtalonario,
        :prautorizador,
        :prcliente,
        :prclientedireccion,
        :prclientetelefono,
        :prclientecargo,
        :prlugar,
        :prvendedor,
        :prtipoventa,
        :prtipodocumento,
        :prtipopago,
        :prinicial,
        :prcuotas,
        :prtotal,
        :prfechainicio,
        :prpdfcontrato,
        :prpdfdni,
        :prpdfcip,
        :prpdfplanilla,
        :prpdfletra,
        :prpdfvoucher,
        :prpdfautorizacion,
        :probservaciones)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prsucursal", $this->sucursal);
        $result->bindParam(":prtalonario", $this->talonario);
        $result->bindParam(":prautorizador", $this->id_autorizador);
        $result->bindParam(":prcliente", $this->id_cliente);
        $result->bindParam(":prclientedireccion", $this->id_clientedireccion);
        $result->bindParam(":prclientetelefono", $this->id_clientetelefono);
        $result->bindParam(":prclientecargo", $this->clientecargo);
        $result->bindParam(":prlugar", $this->lugar);
        $result->bindParam(":prvendedor", $this->vendedor);
        $result->bindParam(":prtipoventa", $this->tipoventa);
        $result->bindParam(":prtipodocumento", $this->tipo_documento);
        $result->bindParam(":prtipopago", $this->tipopago);
        $result->bindParam(":prinicial", $this->inicial);
        $result->bindParam(":prcuotas", $this->cuotas);
        $result->bindParam(":prtotal", $this->total);
        $result->bindParam(":prfechainicio", $this->fechainicio);
        $result->bindParam(":prpdfcontrato", $this->pdfcontrato);
        $result->bindParam(":prpdfdni", $this->pdfdni);
        $result->bindParam(":prpdfcip", $this->pdfcip);
        $result->bindParam(":prpdfplanilla", $this->pdfplanilla);
        $result->bindParam(":prpdfletra", $this->pdfletra);
        $result->bindParam(":prpdfvoucher", $this->pdfvoucher);
        $result->bindParam(":prpdfautorizacion", $this->pdfautorizacion);
        $result->bindParam(":probservaciones", $this->observaciones);

        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->sucursal=htmlspecialchars(strip_tags($this->sucursal));
        $this->talonario=htmlspecialchars(strip_tags($this->talonario));
        $this->id_autorizador=htmlspecialchars(strip_tags($this->id_autorizador));
        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->id_clientedireccion=htmlspecialchars(strip_tags($this->id_clientedireccion));
        $this->id_clientetelefono=htmlspecialchars(strip_tags($this->id_clientetelefono));
        $this->clientecargo=htmlspecialchars(strip_tags($this->clientecargo));
        $this->lugar=htmlspecialchars(strip_tags($this->lugar));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->tipoventa=htmlspecialchars(strip_tags($this->tipoventa));
        $this->tipo_documento=htmlspecialchars(strip_tags($this->tipo_documento));
        $this->tipopago=htmlspecialchars(strip_tags($this->tipopago));
        $this->inicial=htmlspecialchars(strip_tags($this->inicial));
        $this->cuotas=htmlspecialchars(strip_tags($this->cuotas));
        $this->total=htmlspecialchars(strip_tags($this->total));
        $this->fechainicio=htmlspecialchars(strip_tags($this->fechainicio));
        $this->pdfcontrato=htmlspecialchars(strip_tags($this->pdfcontrato));
        $this->pdfdni=htmlspecialchars(strip_tags($this->pdfdni));
        $this->pdfcip=htmlspecialchars(strip_tags($this->pdfcip));
        $this->pdfplanilla=htmlspecialchars(strip_tags($this->pdfplanilla));
        $this->pdfletra=htmlspecialchars(strip_tags($this->pdfletra));
        $this->pdfvoucher=htmlspecialchars(strip_tags($this->pdfvoucher));
        $this->pdfautorizacion=htmlspecialchars(strip_tags($this->pdfautorizacion));
        $this->observaciones=htmlspecialchars(strip_tags($this->observaciones));

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id_venta=$id;
            }
            return true;
        }
        return false;
    }

    function readxId()
    {
        $query ="call sp_listarventaxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_venta);

        $Productos=$this->read_productos($this->id_venta);
        $Cronograma=$this->read_cronograma($this->id_venta);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
      
        $this->id=$row['id'];
        $this->tipo_venta=$row['tipo_venta'];
        $this->fecha=$row['fecha'];
        $this->id_sucursal=$row['id_sucursal'];
        $this->nombre_sucursal=$row['nombre_sucursal'];
        $this->id_talonario=$row['id_talonario'];
        $this->talonario_serie=$row['talonario_serie'];
        $this->talonario_contrato=$row['talonario_contrato'];
        $this->id_cliente=$row['id_cliente'];
        $this->cliente_nombre=$row['cliente_nombre'];
        $this->cliente_trabajo=$row['cliente_trabajo'];
        $this->cliente_cargo_nombre=$row['cliente_cargo_nombre'];
        $this->id_cliente_direccion=$row['id_cliente_direccion'];
        $this->cliente_direccion_nombre=$row['cliente_direccion_nombre'];
        $this->id_cliente_telefono=$row['id_cliente_telefono'];
        $this->cliente_telefono_numero=$row['cliente_telefono_numero'];
        $this->id_vendedor=$row['id_vendedor'];
        $this->nombre_vendedor=$row['nombre_vendedor'];
        $this->id_autorizador=$row['id_autorizador'];
        $this->nombre_autorizador=$row['nombre_autorizador'];
        $this->idtipopago=$row['idtipopago'];
        $this->tipo_pago=$row['tipo_pago'];
        $this->documento=$row['documento'];
        $this->monto_inicial=$row['monto_inicial'];
        $this->numero_cuotas=$row['numero_cuotas'];
        $this->monto_total=$row['monto_total'];
        $this->fecha_inicio_pago=$row['fecha_inicio_pago'];
        $this->contrato_pdf=$row['contrato_pdf'];
        $this->dni_pdf=$row['dni_pdf'];
        $this->cip_pdf=$row['cip_pdf'];
        $this->planilla_pdf=$row['planilla_pdf'];
        $this->letra_pdf=$row['letra_pdf'];
        $this->voucher_pdf=$row['voucher_pdf'];
        $this->autorizacion_pdf=$row['autorizacion_pdf'];
        $this->observacion=$row['observacion'];
        $this->lugar_venta=$row['lugar_venta'];
        $this->estado=$row['estado'];
        $this->id_venta_canje=$row['id_venta_canje'];
        $this->canje_talonario_serie=$row['canje_talonario_serie'];
        $this->canje_talonario_contrato=$row['canje_talonario_contrato'];
        $this->cronograma=$Cronograma;
        $this->productos=$Productos;
    }

    function create_cronograma(){
        
        $query = "CALL sp_crearventacronograma(
            :prventa,
            :prmonto,
            :prvencimiento,
            :prestado
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prventa", $this->venta);
        $result->bindParam(":prmonto", $this->monto);
        $result->bindParam(":prvencimiento", $this->vencimiento);
        $result->bindParam(":prestado", $this->estado);

        $this->venta=htmlspecialchars(strip_tags($this->venta));
        $this->monto=htmlspecialchars(strip_tags($this->monto));
        $this->vencimiento=htmlspecialchars(strip_tags($this->vencimiento));
        $this->estado=htmlspecialchars(strip_tags($this->estado));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function read_cronograma(){

        $query = "CALL sp_listarventacronogramaxId(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_venta);

        $result->execute();
        
        $venta_list=array();
        $venta_list["cronograma"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $venta_item = array (
                "numero"=>$contador,
                "id_cronograma"=>$id_cronograma,
                "monto_cuota"=>$monto_cuota,
                "fecha_vencimiento"=>$fecha_vencimiento,
                "monto_pagado"=>$monto_pagado,
                "fecha_cancelacion"=>$fecha_cancelacion,
                "estado"=>$estado,
            );
            array_push($venta_list["cronograma"],$venta_item);
        }

        return $venta_list;
    }

    function create_productos(){

        $query = "CALL sp_crearventaproducto(
        :prventa,
        :prproductoserie,
        :prprecio)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prventa", $this->venta);
        $result->bindParam(":prproductoserie", $this->producto_serie);
        $result->bindParam(":prprecio", $this->precio);

        $this->venta=htmlspecialchars(strip_tags($this->venta));
        $this->producto_serie=htmlspecialchars(strip_tags($this->producto_serie));
        $this->precio=htmlspecialchars(strip_tags($this->precio));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function create_canje(){

        $query = "CALL sp_crearventacanje(
            :prid_venta_nueva,
            :prid_venta_anterior
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid_venta_nueva", $this->venta_nueva);
        $result->bindParam(":prid_venta_anterior", $this->venta_anterior);

        $this->venta_nueva=htmlspecialchars(strip_tags($this->venta_nueva));
        $this->venta_anterior=htmlspecialchars(strip_tags($this->venta_anterior));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    // El objetivo es que los productos que salieron por venta
    // retornen al almacen si se canjea la venta
    function create_canje_transaccion(){
        $query = "CALL sp_crearventacanjetransaccion(
            :pridtransaccion,
            :prfecha
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pridtransaccion", $this->id_transaccion);
        $result->bindParam(":prfecha", $this->fecha);

        $this->id_transaccion=htmlspecialchars(strip_tags($this->id_transaccion));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function read_productos(){

        $query = "CALL sp_listarventaproductoxId(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_venta);

        $result->execute();
        
        $venta_list=array();
        $venta_list["productos"]=array();
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $venta_item = array (
                "id"=>$id,
                "id_producto"=>$id_producto,
                "nombre"=>$descripcion,
                "id_serie"=>$id_serie,
                "serie"=>$serie,
                "precio"=>$precio,
            );
            array_push($venta_list["productos"],$venta_item);
        }

        return $venta_list;
    }

    function read_transacciones(){

        $query = "CALL sp_listartransaccioncabeceraxventa(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_venta);

        $result->execute();
        
        $transaccion_list=array();
        $transaccion_list["transaccion"]=array();
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $transaccion_item = array (
                "id"=>$id,
                "observacion"=>$observacion
            );
            array_push($transaccion_list["transaccion"],$transaccion_item);
        }

        return $transaccion_list;
    }

    function readxcliente(){
        $query = "CALL sp_listarventasxcliente(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_cliente);
        $result->bindParam(2, $this->talonario_serie);
        $result->bindParam(3, $this->talonario_numero);
        $result->bindParam(4, $this->estado);
        $result->bindParam(5, $this->numero_pagina);
        $result->bindParam(6, $this->total_pagina);

        $result->execute();
        
        $venta_list=array();
        $venta_list["ventas"]=array();
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $venta_item = array (
                "id"=>$id,
                "tipo"=>$tipo,
                "fecha"=>$fecha,
                "id_talonario"=>$id_talonario,
                "serie"=>$talonario_serie,
                "numero"=>$talonario_numero,
                "tipo_pago"=>$tipo_pago,
                "total_cuotas"=>$total_cuotas,
                "cuotas_pagadas"=>$cuotas_pagadas,
                "total"=>$total,
                "estado"=>$estado,
            );
            array_push($venta_list["ventas"],$venta_item);
        }

        return $venta_list;
    }

    function readxclientecontar(){
        $query = "CALL sp_listarventasxclientecontar(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_cliente);
        $result->bindParam(2, $this->talonario_serie);
        $result->bindParam(3, $this->talonario_numero);
        $result->bindParam(4, $this->estado);

        $result->execute();
        
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function delete()
    {
        $query = "call sp_eliminarventa(?)";
        
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_venta);

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