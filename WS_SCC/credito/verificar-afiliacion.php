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
	    $credito->cliente = isset($_GET['prcliente']) ? trim($_GET['prcliente']) : die();
	    
	    $credito->verificar_afiliacion();

	    $credito_list = array(
            "codigo_afiliacion"=>$credito->codigo,
            "total_pagado"=>$credito->total_pagado,
            "total_cuotas"=>$credito->total_cuotas
        );

	    if(trim($credito->cliente)!= ''){
	        print_json("0000", "OK", $credito_list);
	    }
	    else{
	        print_json("0001", "No se encuentran créditos para el cliente con id " . $credito->cliente , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>