<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/credito.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$credito = new Creditos($db);

	try
	{
	    $credito->seleccionar_parametros_afiliacion();
		$credito->seleccionar_numero_afiliacion();

	    $credito_list = array(
			"id"=>$credito->id,
			"numero"=>$credito->numero, // Es el número de afiliación correspondiente
            "monto"=>$credito->monto,
            "tiempo"=>$credito->tiempo,
            "fecha"=>$credito->fecha
        );

	    if(trim($credito->id)!= ''){
	        print_json("0000", "OK", $credito_list);
	    }
	    else{
	        print_json("0001", "No se encuentran parámetros" , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>