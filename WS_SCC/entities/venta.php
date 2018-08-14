<?php
Class Venta{

    private $conn;
    private $table_name = "venta";

    public $idventa;
    public $vnt_serie;
    public $vnt_numerodocumento;
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
    public $vnt_numero_couta;
    public $vnt_cuotas;
    public $id_tipopago;
    public $vnt_total;
    public $vnt_tipoventa;
    public $id_tipoventa_referencia;
    public $vnt_observaciones;
    public $vnt_estado;

    // public $sede;
    // public $subsede;
    // public $cliente_nombre;
    // public $cliente_apellido;
    // public $fecha;
    // public $vendedor;
    // public $fecha_inicio;
    // public $monto_inicial;
    // public $numero_coutas;
    // public $coutas;
    // public $tipo_pago;
    // public $monto_total;
    // public $tipo_venta;
    // public $referencia;
    // public $observaciones;

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
        $query = "CALL sp_crearventa(:pvnt_serie, :pvnt_numerodocumento,:pid_cliente,
        :pvnt_fecha,:pid_vendedor,:pvnt_contrato_pdf,:pvnt_dni_pdf,:pvnt_cip_pdf,:pvnt_planilla_pdf,
        :pvnt_letra_pdf,:pvnt_voucher_pdf,:pvnt_autorizacion_pdf,:pvnt_fecha_inicio,:pvnt_inicial,
        :pvnt_numero_couta,:pvnt_cuotas,:pid_tipopago,:pvnt_total,:pvnt_tipoventa,
        :pid_tipoventa_referencia,:pvnt_observaciones, :pvnt_estado)";

        
        $result = $this->conn->prepare($query);

        

        $result->bindParam(":pvnt_serie", $this->vnt_serie);
        $result->bindParam(":pvnt_numerodocumento", $this->vnt_numerodocumento);
        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":pvnt_fecha", $this->vnt_fecha);
        $result->bindParam(":pid_vendedor", $this->id_vendedor);
        $result->bindParam(":pvnt_contrato_pdf", $this->vnt_contrato_pdf);
        $result->bindParam(":pvnt_dni_pdf", $this->vnt_dni_pdf);
        $result->bindParam(":pvnt_cip_pdf", $this->vnt_cip_pdf);
        $result->bindParam(":pvnt_planilla_pdf", $this->vnt_planilla_pdf);
        $result->bindParam(":pvnt_letra_pdf", $this->vnt_letra_pdf);
        $result->bindParam(":pvnt_voucher_pdf", $this->vnt_voucher_pdf);
        $result->bindParam(":pvnt_autorizacion_pdf", $this->vnt_autorizacion_pdf);
        $result->bindParam(":pvnt_fecha_inicio", $this->vnt_fecha_inicio);
        $result->bindParam(":pvnt_inicial", $this->vnt_inicial);
        $result->bindParam(":pvnt_numero_couta", $this->vnt_numero_couta);
        $result->bindParam(":pvnt_cuotas", $this->vnt_cuotas);
        $result->bindParam(":pid_tipopago", $this->id_tipopago);
        $result->bindParam(":pvnt_total", $this->vnt_total);
        $result->bindParam(":pvnt_tipoventa", $this->vnt_tipoventa);
        $result->bindParam(":pid_tipoventa_referencia", $this->id_tipoventa_referencia);
        $result->bindParam(":pvnt_observaciones", $this->vnt_observaciones);
        $result->bindParam(":pvnt_estado", $this->vnt_estado);

        $this->vnt_serie=htmlspecialchars(strip_tags($this->vnt_serie));
        $this->vnt_numerodocumento=htmlspecialchars(strip_tags($this->vnt_numerodocumento));
        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->vnt_fecha=$this->vnt_fecha;
        $this->id_vendedor=htmlspecialchars(strip_tags($this->id_vendedor));
        $this->vnt_contrato_pdf=htmlspecialchars(strip_tags($this->vnt_contrato_pdf));
        $this->vnt_dni_pdf=htmlspecialchars(strip_tags($this->vnt_dni_pdf));
        $this->vnt_cip_pdf=htmlspecialchars(strip_tags($this->vnt_cip_pdf));
        $this->vnt_planilla_pdf=htmlspecialchars(strip_tags($this->vnt_planilla_pdf));
        $this->vnt_letra_pdf=htmlspecialchars(strip_tags($this->vnt_letra_pdf));
        $this->vnt_voucher_pdf=htmlspecialchars(strip_tags($this->vnt_voucher_pdf));
        $this->vnt_autorizacion_pdf=htmlspecialchars(strip_tags($this->vnt_autorizacion_pdf));
        $this->vnt_fecha_inicio=$this->vnt_fecha_inicio;
        $this->vnt_inicial=htmlspecialchars(strip_tags($this->vnt_inicial));
        $this->vnt_numero_couta=htmlspecialchars(strip_tags($this->vnt_numero_couta));
        $this->vnt_cuotas=htmlspecialchars(strip_tags($this->vnt_cuotas));
        $this->id_tipopago=htmlspecialchars(strip_tags($this->id_tipopago));
        $this->vnt_total=htmlspecialchars(strip_tags($this->vnt_total));
        $this->vnt_tipoventa=htmlspecialchars(strip_tags($this->vnt_tipoventa));
        $this->id_tipoventa_referencia=htmlspecialchars(strip_tags($this->id_tipoventa_referencia));
        $this->vnt_observaciones=htmlspecialchars(strip_tags($this->vnt_observaciones));
        $this->vnt_estado=htmlspecialchars(strip_tags($this->vnt_estado));

        if($result->execute())
        {
            return true;
        }
        print_r($result);
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
                "cliente_apellido"=>$cliente_apellido,
                "fecha"=>$fecha,
                "vendedor"=>$vendedor,
                "fecha_inicio"=>$fecha_inicio,
                "monto_inicial"=>$monto_inicial,
                "numero_coutas"=>$numero_coutas,
                "cuotas"=>$cuotas,
                "tipo_pago"=>$tipo_pago,
                "monto_total"=>$monto_total,
                "tipo_venta"=>$tipo_venta,
                "referencia"=>$referencia,
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