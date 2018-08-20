<?php
Class Cronograma{

    public $numero;
    public $fechapago;
    public $monto;


    public function __construct(){
        //$this->conn = $db;
    }
    
    function create($fechainicio, $monto, $numerocuotas,$montoinicial)
    {

       $cronograma=array();
       $cronograma["cuotas"]=array();

       $monto = $monto - $montoinicial;
       
        $i=0;
       while( $i<$numerocuotas)
        {
            date_add($fechainicio, date_interval_create_from_date_string('1 month'));
            $cuota_item = array (
                "numero" => $i+1,
                "month"=>date_format($fechainicio,"m-Y"),
                "price"=> $monto/$numerocuotas
            );
 
            array_push($cronograma["cuotas"],$cuota_item);
            $i++;
        }
        return $cronograma;
        }
    
}
?>