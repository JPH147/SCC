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
	    $transaccion->id_transaccion = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $transaccion->readxId();

	    $transaccion_list = array(
	        "id"=>$transaccion->id,
            "almacen"=>$transaccion->almacen,
            "id_tipo"=>$transaccion->id_tipo,
            "tipo"=>$transaccion->tipo,
            "referencia"=>$transaccion->referencia,
            "id_proveedor"=>$transaccion->id_proveedor,
            "proveedor"=>$transaccion->proveedor,
            "cliente"=>$transaccion->cliente,
            "salida_venta"=>$transaccion->salida_venta,
            "sucursal"=>$transaccion->sucursal,
            "vendedor"=>$transaccion->vendedor,
            "fecha"=>$transaccion->fecha,
            "documento"=>$transaccion->documento,
            "observaciones"=>$transaccion->observaciones,
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