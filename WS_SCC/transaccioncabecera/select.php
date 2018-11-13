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
        $transaccion->id_almacen = isset($_GET['id_almacen']) ? trim($_GET['id_almacen']) : die();
        $transaccion->tipo_transaccion = isset($_GET['tipo_transaccion']) ? trim($_GET['tipo_transaccion']) : die();
	    $transaccion->select();
	    $transaccion_list = array(
	        "serie"=>$transaccion->serie,
            "numero"=>$transaccion->proxnumero
            
	    );

	    if(trim($transaccion->serie)!= null){
	        print_json("0000", "OK", $transaccion_list);
	    }
	    else{
	        print_json("0001", "Ocurrio un error" , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>