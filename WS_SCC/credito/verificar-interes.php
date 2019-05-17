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
	    $credito->total_pagado = isset($_GET['prmonto']) ? trim($_GET['prmonto']) : die();
	    
	    $credito->verificar_interes();

	    if(trim($credito->total_pagado)!= ''){
	        print_json("0000", "OK", $credito->interes);
	    }
	    else{
	        print_json("0001", "No se encuentran reglas para el monto " . $credito->total_pagado , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>