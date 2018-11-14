<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/transacciondetalle.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$transaccion = new TransaccionDetalle($db);

	try
	{
	    $transaccion->id_transaccion = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $transaccion->readxId();

	    $transaccion_list = array(
        	"id"=>$transaccion->id_transaccion,
        	"id_cabecera"=>$transaccion->id_cabecera,
        	"id_producto_serie"=>$transaccion->id_producto_serie,
        	"cantidad"=>$transaccion->cantidad,
        	"precio"=>$transaccion->precio
	    );

	    if(trim($transaccion->id_cabecera)!= ''){
	        print_json("0000", "OK", $transaccion_list);
	    }
	    else{
	        print_json("0001", "No se encuentra transaccion registrada con el id " . $transaccion->id_transaccion , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>