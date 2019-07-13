<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/plantillas.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$plantillas = new Plantillas($db);

	try
	{
        $informacion = $plantillas->consultar_informacion();

	    if( $informacion ){
	        print_json("0000", "OK", $informacion);
	    }
	    else{
	        print_json("0001", "No se encuentran reglas para el monto " , null);
	    }
	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>