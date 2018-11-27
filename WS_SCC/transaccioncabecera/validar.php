<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/transaccioncabecera.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$transaccion = new TransaccionCabecera($db);

	try
	{
	    $transaccion->tipo = isset($_GET['prtipo']) ? trim($_GET['prtipo']) : die();
	    $transaccion->referente = isset($_GET['prreferente']) ? trim($_GET['prreferente']) : die();
	    $transaccion->documento = isset($_GET['prdocumento']) ? trim($_GET['prdocumento']) : die();

	    $transaccion->validar();

	    $transaccion_list = array(
            "total"=>$transaccion->total,
	    );

	    // if(trim($transaccion->total)!= ''){
	        print_json("0000", "OK", $transaccion_list);
	    // }
	    // else{
	        // print_json("0001", "No se encuentra transaccion registrada con el id " . $transaccion->id_transaccion , null);

	    // }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>