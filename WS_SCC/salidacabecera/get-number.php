<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/salidacabecera.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$venta = new SalidaCabecera($db);

	try
	{
	    $venta->generar_numero();

	    if(trim($venta->numero)!= ''){
	        print_json("0000", "OK", $venta->numero);
	    }
	    else{
	        print_json("0001", "No se ha podigo generar el número " , 1);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>