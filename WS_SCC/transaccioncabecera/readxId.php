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
	    $transaccion->id_transaccion = isset($_GET['prid']) ? $_GET['prid'] : die();
	    
	    $transaccion->readxId();

	    $transaccion_list = array(
	        "id"=>$transaccion->id_transaccion,
            "almacen"=>$transaccion->id_almacen,
            "tipo"=>$transaccion->id_tipo,
            "referencia"=>$transaccion->id_referencia,
            "proveedor"=>$transaccion->id_proveedor,
            "cliente"=>$transaccion->id_cliente,
            "salida_venta"=>$transaccion->id_salida_venta,
            "sucursal"=>$transaccion->id_sucursal,
            "vendedor"=>$transaccion->id_vendedor,
            "fecha"=>$transaccion->fecha,
            "documento"=>$transaccion->documento,
            "detalle"=>$transaccion->transaccion_detalle
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