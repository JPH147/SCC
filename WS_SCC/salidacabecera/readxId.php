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
	    $venta->id_salida = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $venta->readxId();

	    $venta_list = array(
            "id"=>$venta->id,
			"pecosa"=>$venta->pecosa,
			"sucursal"=>$venta->sucursal,
			"fecha"=>$venta->fecha,
			"destino"=>$venta->destino,
			"guia"=>$venta->guia,
			"vehiculo_placa"=>$venta->vehiculo_placa,
			"chofer_dni"=>$venta->chofer_dni,
			"chofer_nombre"=>$venta->chofer_nombre,
			"observacion"=>$venta->observacion,
			"estado"=>$venta->estado,
			"productos"=>$venta->productos,
			"talonarios"=>$venta->talonarios,
			"vendedores"=>$venta->vendedores
	    );

	    if(trim($venta->id)!= ''){
	        print_json("0000", "OK", $venta_list);
	    }
	    else{
	        print_json("0001", "No se encuentra la venta registrada con el id " . $venta->id_venta , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurri贸 un error.", $exception->getMessage());
	}
?>