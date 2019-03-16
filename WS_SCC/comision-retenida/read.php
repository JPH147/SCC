<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/comision-retenida.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$comision = new ComisionRetenida($db);

    	$comision = $comision->read();

    	if (count(array_filter($comision))>0)
    	{
    		print_json("0000", count(array_filter($comision)),$comision);
    	}
    	else
    	{
    		print_json("0001", "No existen comisiones registradas", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>