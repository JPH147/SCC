<?php
Class Cronograma{

    public $numero;
    public $fechapago;
    public $monto;


    public function __construct(){
        //$this->conn = $db;
    }
    
    function create($fechainicio, $monto, $numerocuotas)
    {
        $meses = array('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
               'Agosto','Septiembre','Octubre','Noviembre','Diciembre');
       $dia = 19;//date("d",$fechainicio);
       $fechapago = 7;//date("m", $fechainicio);
       $anio = 2018;//date("Y", $fechainicio);

       $cronograma=array();
       $cronograma["cuotas"]=array();
       
        $i=0;
       while( $i<$numerocuotas)
        {
            /*if (($fechapago + 1) > 12) {
                $fechapago = ($fechapago + 1) - 12;
                $anio++;
            } else {
                $fechapago = $fechapago + 1;
            }*/
            
            date_add($fechainicio, date_interval_create_from_date_string('1 month'));
            $cuota_item = array (
                "numero" => $i+1,
                "fechapago"=>date_format($fechainicio,"d-m-Y"),
                "monto"=>$monto
            );
 
            array_push($cronograma["cuotas"],$cuota_item);
            $i++;
        }
        return $cronograma;
    }
}
?>