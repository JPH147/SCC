<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
    include_once '../entities/proveedor.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
    $proveedor = new Proveedor($db);

	try
	{
	    $proveedor->idproveedor = $_GET['id'];
	    $proveedor->readxId();

	    $proveedor_list = array(
	        "id"=>$proveedor->idproveedor,
            "tipo_documento"=>$proveedor->tipo_documento,
            "documento"=>$proveedor->prv_documento,
            "nombre"=>$proveedor->prv_nombre,
            "representante"=>$proveedor->prv_representante_legal,
            "observacion"=>$proveedor->prv_observacion

        );
        
	    if($proveedor->idproveedor!= null){
	        print_json("0000", "OK", $proveedor_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el proveedor registrado con el id " . $proveedor->idproveedor , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>