<?php
Class Venta{

    private $conn;
    private $table_name = "venta";

    public $id_venta;
    public $id_talonario;
    public $id_cliente;
    public $vnt_fecha;
    public $id_vendedor;
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


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarventa(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_venta);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->numero_pagina);
        $result->bindParam(6, $this->total_pagina);
        $result->bindParam(7, $this->orden);

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
            );
            array_push($venta_list["ventas"],$venta_item);
        }

        return $venta_list;
    }

    function contar(){

        $query = "CALL sp_listarventacontar(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_venta);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);

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
        :prcliente,
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
        $result->bindParam(":prcliente", $this->cliente);
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
        $this->cliente=htmlspecialchars(strip_tags($this->cliente));
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
        $this->id_talonario=$row['id_talonario'];
        $this->talonario_serie=$row['talonario_serie'];
        $this->id_cliente=$row['id_cliente'];
        $this->id_vendedor=$row['id_vendedor'];
        $this->idtipopago=$row['idtipopago'];
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
        $this->cronograma=$Cronograma;
        $this->productos=$Productos;
    }

    function create_cronograma(){
        
        $query = "CALL sp_crearventacronograma(
        :prventa,
        :prmonto,
        :prvencimiento)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prventa", $this->venta);
        $result->bindParam(":prmonto", $this->monto);
        $result->bindParam(":prvencimiento", $this->vencimiento);

        $this->venta=htmlspecialchars(strip_tags($this->venta));
        $this->monto=htmlspecialchars(strip_tags($this->monto));
        $this->vencimiento=htmlspecialchars(strip_tags($this->vencimiento));

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

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $venta_item = array (
                "id_cronograma"=>$id_cronograma,
                "monto_cuota"=>$monto_cuota,
                "fecha_vencimiento"=>$fecha_vencimiento,
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

}
?>