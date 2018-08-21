<?php
Class Venta{

    private $conn;
    private $table_name = "venta";

    public $idventa;
    public $id_talonario;
    public $id_cliente;
    public $vnt_fecha;
    public $id_vendedor;
    public $vnt_contrato_pdf;
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

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
        $query = "CALL sp_crearventa(
        :pid_talonario,
        :pid_cliente,
        :pvnt_fecha,
        :pid_vendedor,
        :pvnt_fecha_inicio,
        :pvnt_inicial,
        :pvnt_numero_cuota,
        :pid_tipopago,
        :pvnt_total,
        :pvnt_tipoventa,
        :pvnt_lugarventa,
        :pvnt_observaciones)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pid_talonario", $this->id_talonario);
        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":pvnt_fecha", $this->vnt_fecha);
        $result->bindParam(":pid_vendedor", $this->id_vendedor);
        $result->bindParam(":pvnt_fecha_inicio", $this->vnt_fecha_inicio);
        $result->bindParam(":pvnt_inicial", $this->vnt_inicial);
        $result->bindParam(":pvnt_numero_cuota", $this->vnt_numero_cuota);
        $result->bindParam(":pid_tipopago", $this->id_tipopago);
        $result->bindParam(":pvnt_total", $this->vnt_total);
        $result->bindParam(":pvnt_tipoventa", $this->vnt_tipoventa);
        $result->bindParam(":pvnt_lugarventa", $this->vnt_lugarventa);
        $result->bindParam(":pvnt_observaciones", $this->vnt_observaciones);

        $this->id_talonario=htmlspecialchars(strip_tags($this->id_talonario));
        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->vnt_fecha=htmlspecialchars(strip_tags($this->vnt_fecha));
        $this->id_vendedor=htmlspecialchars(strip_tags($this->id_vendedor));
        $this->vnt_fecha_inicio=htmlspecialchars(strip_tags($this->vnt_fecha_inicio));
        $this->vnt_inicial=htmlspecialchars(strip_tags($this->vnt_inicial));
        $this->vnt_numero_cuota=htmlspecialchars(strip_tags($this->vnt_numero_cuota));
        $this->id_tipopago=htmlspecialchars(strip_tags($this->id_tipopago));
        $this->vnt_total=htmlspecialchars(strip_tags($this->vnt_total));
        $this->vnt_tipoventa=htmlspecialchars(strip_tags($this->vnt_tipoventa));
        $this->vnt_lugarventa=htmlspecialchars(strip_tags($this->vnt_lugarventa));
        $this->vnt_observaciones=htmlspecialchars(strip_tags($this->vnt_observaciones));

        if($result->execute())
        {
            return true;
        }
        return false;
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
                "observaciones"=>$observaciones
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

}
?>