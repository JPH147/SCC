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
	    $transaccion->almacen = isset($_GET['pralmacen']) ? trim($_GET['pralmacen']) : die();
	    $transaccion->documento = isset($_GET['prdocumento']) ? trim($_GET['prdocumento']) : die();

	    $transaccion->readxdocumento();

	    $transaccion_list = array(
            "id"=>$transaccion->id,
			"id_tipo_transaccion"=>$transaccion->id_tipo_transaccion,
			"tipo_transaccion"=>$transaccion->tipo_transaccion,
			"numero_transaccion"=>$transaccion->numero_transaccion,
			"id_almacen"=>$transaccion->id_almacen,
			"almacen"=>$transaccion->almacen,
			"id_almacen_referencia"=>$transaccion->id_almacen_referencia,
			"almacen_referencia"=>$transaccion->almacen_referencia,
			"fecha"=>$transaccion->fecha,
			"documento"=>$transaccion->documento,
			"detalle"=>$transaccion->transaccion_detalle,
	    );

	    if(trim($transaccion->fecha)!= ''){
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