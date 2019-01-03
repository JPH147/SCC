<?php

Class Presupuesto{

    private $conn;

    public $cliente;
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

    public function __construct($db){
        $this->conn = $db;
    }

    function get_next()
    {
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
            :prcuotas,
            :prcapital,
            :prtasa,
            :prtotal
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcliente", $this->cliente);
        $result->bindParam(":prtipo", $this->tipo);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prcuotas", $this->cuotas);
        $result->bindParam(":prcapital", $this->capital);
        $result->bindParam(":prtasa", $this->tasa);
        $result->bindParam(":prtotal", $this->total);

        $this->cliente=htmlspecialchars(strip_tags($this->cliente));
        $this->tipo=htmlspecialchars(strip_tags($this->tipo));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->cuotas=htmlspecialchars(strip_tags($this->cuotas));
        $this->capital=htmlspecialchars(strip_tags($this->capital));
        $this->tasa=htmlspecialchars(strip_tags($this->tasa));
        $this->total=htmlspecialchars(strip_tags($this->total));

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

}
?>