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
    public $vnt_estado;

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
        $query = "CALL sp_crearventa(:pvnt_serie, :pvnt_numerodocumento,:pid_cliente,
        :pvnt_fecha,:pid_vendedor,:pvnt_contrato_pdf,:pvnt_dni_pdf,:pvnt_cip_pdf,:pvnt_planilla_pdf,
        :pvnt_letra_pdf,:pvnt_voucher_pdf,:pvnt_autorizacion_pdf,:pvnt_fecha_inicio,:pvnt_inicial,
        :pvnt_inicial, :pvnt_numero_couta,:pvnt_cuotas,:pid_tipopago,:pvnt_total,:pvnt_tipoventa,
        :pid_tipoventa_referencia,:pvnt_estado)";

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
        $result->bindParam(":pvnt_estado", $this->vnt_estado);

        $this->vnt_serie=htmlspecialchars(strip_tags($this->vnt_serie));
        $this->vnt_numerodocumento=htmlspecialchars(strip_tags($this->vnt_numerodocumento));
        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->vnt_fecha=htmlspecialchars(strip_tags($this->vnt_fecha));
        $this->id_vendedor=htmlspecialchars(strip_tags($this->id_vendedor));
        $this->vnt_contrato_pdf=htmlspecialchars(strip_tags($this->vnt_contrato_pdf));
        $this->vnt_dni_pdf=htmlspecialchars(strip_tags($this->vnt_dni_pdf));
        $this->vnt_cip_pdf=htmlspecialchars(strip_tags($this->vnt_cip_pdf));
        $this->vnt_planilla_pdf=htmlspecialchars(strip_tags($this->vnt_planilla_pdf));
        $this->vnt_letra_pdf=htmlspecialchars(strip_tags($this->vnt_letra_pdf));
        $this->vnt_voucher_pdf=htmlspecialchars(strip_tags($this->vnt_voucher_pdf));
        $this->vnt_autorizacion_pdf=htmlspecialchars(strip_tags($this->vnt_autorizacion_pdf));
        $this->vnt_fecha_inicio=htmlspecialchars(strip_tags($this->vnt_fecha_inicio));
        $this->vnt_inicial=htmlspecialchars(strip_tags($this->vnt_inicial));
        $this->vnt_numero_couta=htmlspecialchars(strip_tags($this->vnt_numero_couta));
        $this->vnt_cuotas=htmlspecialchars(strip_tags($this->vnt_cuotas));
        $this->id_tipopago=htmlspecialchars(strip_tags($this->id_tipopago));
        $this->vnt_total=htmlspecialchars(strip_tags($this->vnt_total));
        $this->vnt_tipoventa=htmlspecialchars(strip_tags($this->vnt_tipoventa));
        $this->id_tipoventa_referencia=htmlspecialchars(strip_tags($this->id_tipoventa_referencia));
        $this->vnt_estado=htmlspecialchars(strip_tags($this->vnt_estado));;

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

}
?>