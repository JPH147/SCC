<?php

Class Presupuesto{

    private $conn;

    public $id_presupuesto;
    public $cliente;
    public $fecha_inicio;
    public $fecha_fin;
    public $estado;
    public $tipo;
    public $fecha;
    public $cuotas;
    public $capital;
    public $tasa;
    public $total;
    public $numero;
    public $presupuesto;
    public $monto;
    public $aporte;
    public $producto;
    public $cantidad;
    public $precio;
    public $vendedor;
    public $pdf_autorizacion;
    public $pdf_ddjj;
    public $pdf_transaccion;
    public $pdf_tarjeta;
    public $pdf_compromiso;

    public function __construct($db){
        $this->conn = $db;
    }

    function read_presupuesto(){
        $query = "CALL sp_listarpresupuestocabecera(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->fecha_inicio);
        $result->bindParam(3, $this->fecha_fin);
        $result->bindParam(4, $this->estado);
        $result->bindParam(5, $this->numero_pagina);
        $result->bindParam(6, $this->total_pagina);

        $result->execute();
        
        $presupuesto_list=array();
        $presupuesto_list["presupuestos"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $items = array (
                "numero"=>$contador,
                "id"=>$id,
                "id_cliente"=>$id_cliente,
                "cliente"=>$cliente,
                "id_tipo"=>$id_tipo,
                "tipo"=>$tipo,
                "fecha"=>$fecha,
                "cuotas"=>$cuotas,
                "capital"=>$capital,
                "tasa"=>$tasa,
                "total"=>$total,
                "id_estado"=>$id_estado,
                "estado"=>$estado,
                "pdf_autorizacion" => $pdf_autorizacion, 
                "pdf_ddjj" => $pdf_ddjj, 
                "pdf_transaccion" => $pdf_transaccion, 
                "pdf_tarjeta" => $pdf_tarjeta, 
                "pdf_compromiso" => $pdf_compromiso, 
            );
            array_push($presupuesto_list["presupuestos"],$items);
        }

        return $presupuesto_list;
    }

    function contar_presupuesto(){
        $query = "CALL sp_listarpresupuestocabeceracontar(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->fecha_inicio);
        $result->bindParam(3, $this->fecha_fin);
        $result->bindParam(4, $this->estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function readxId(){
        $query ="call sp_listarpresupuestocabeceraxId(?)";
        
        $cronograma = $this->read_cronograma($this->id_presupuesto);

        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_presupuesto);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $presupuesto = array(
            "id_cliente" => $row['id_cliente'],
            "cliente" => $row['cliente'],
            "id_vendedor" => $row['id_vendedor'],
            "vendedor" => $row['vendedor'],
            "fecha" => $row['fecha'],
            "cuotas" => $row['cuotas'],
            "capital" => $row['capital'],
            "tasa" => $row['tasa'],
            "total" => $row['total'],
            "autorizacion" => $row['autorizacion'],
            "pdf_ddjj" => $row['pdf_ddjj'],
            "pdf_transaccion" => $row['pdf_transaccion'],
            "pdf_tarjeta" => $row['pdf_tarjeta'],
            "pdf_compromiso" => $row['pdf_compromiso'],
            "estado" => $row['estado'],
            "cronograma" => $cronograma,
        );

        return $presupuesto;

    }

    function read_cronograma( $id_presupuesto ) {
        $query = "CALL sp_listarpresupuestocronograma(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1, $id_presupuesto );

        $result->execute();
        
        $cronograma=array();
        $contador=0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador = $contador+1;
            $item = array (
                "numero" => $contador,
                "id" => $id,
                "monto_cuota" => $monto,
                "fecha_vencimiento" => date($fecha),
            );
            array_push($cronograma,$item);
        }

        return $cronograma; 
    }

    function get_next(){
        $query ="call sp_seleccionarproximonumeropresupuesto()";
        
        $result = $this->conn->prepare($query);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->numero=$row['numero'];
    }

    function create(){

        $query = "call sp_crearpresupuesto(
            :prcliente,
            :prtipo,
            :prfecha,
            :prvendedor,
            :prcuotas,
            :prcapital,
            :prtasa,
            :prtotal,
            :pdfautorizacion,
            :pdfddjj,
            :pdftransaccion,
            :pdftarjeta,
            :pdfcompromiso
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcliente", $this->cliente);
        $result->bindParam(":prtipo", $this->tipo);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prvendedor", $this->vendedor);
        $result->bindParam(":prcuotas", $this->cuotas);
        $result->bindParam(":prcapital", $this->capital);
        $result->bindParam(":prtasa", $this->tasa);
        $result->bindParam(":prtotal", $this->total);
        $result->bindParam(":pdfautorizacion", $this->pdf_autorizacion);
        $result->bindParam(":pdfddjj", $this->pdf_ddjj);
        $result->bindParam(":pdftransaccion", $this->pdf_transaccion);
        $result->bindParam(":pdftarjeta", $this->pdf_tarjeta);
        $result->bindParam(":pdfcompromiso", $this->pdf_compromiso);

        $this->cliente=htmlspecialchars(strip_tags($this->cliente));
        $this->tipo=htmlspecialchars(strip_tags($this->tipo));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->cuotas=htmlspecialchars(strip_tags($this->cuotas));
        $this->capital=htmlspecialchars(strip_tags($this->capital));
        $this->tasa=htmlspecialchars(strip_tags($this->tasa));
        $this->total=htmlspecialchars(strip_tags($this->total));
        $this->pdf_autorizacion=htmlspecialchars(strip_tags($this->pdf_autorizacion));
        $this->pdf_ddjj=htmlspecialchars(strip_tags($this->pdf_ddjj));
        $this->pdf_transaccion=htmlspecialchars(strip_tags($this->pdf_transaccion));
        $this->pdf_tarjeta=htmlspecialchars(strip_tags($this->pdf_tarjeta));
        $this->pdf_compromiso=htmlspecialchars(strip_tags($this->pdf_compromiso));

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id=$id;
            }
            return true;
        }
        
        return false;
    }

    function create_cronograma(){

        $query = "call sp_crearpresupuestocronograma(
            :prpresupuesto,
            :prmonto,
            :praporte,
            :prfecha
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prpresupuesto", $this->presupuesto);
        $result->bindParam(":prmonto", $this->monto);
        $result->bindParam(":praporte", $this->aporte);
        $result->bindParam(":prfecha", $this->fecha);

        $this->presupuesto=htmlspecialchars(strip_tags($this->presupuesto));
        $this->monto=htmlspecialchars(strip_tags($this->monto));
        $this->aporte=htmlspecialchars(strip_tags($this->aporte));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function create_producto(){

        $query = "call sp_crearpresupuestocronograma(
            :prpresupuesto,
            :prproducto,
            :prcantidad,
            :prprecio
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prpresupuesto", $this->presupuesto);
        $result->bindParam(":prproducto", $this->producto);
        $result->bindParam(":prcantidad", $this->cantidad);
        $result->bindParam(":prprecio", $this->precio);

        $this->presupuesto=htmlspecialchars(strip_tags($this->presupuesto));
        $this->producto=htmlspecialchars(strip_tags($this->producto));
        $this->cantidad=htmlspecialchars(strip_tags($this->cantidad));
        $this->precio=htmlspecialchars(strip_tags($this->precio));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function update(){
        
        $query = "call sp_actualizarpresupuesto(
            :prid,
            :prestado
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_presupuesto);
        $result->bindParam(":prestado", $this->estado);

        $this->id_presupuesto=htmlspecialchars(strip_tags($this->id_presupuesto));
        $this->estado=htmlspecialchars(strip_tags($this->estado));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

}
?>