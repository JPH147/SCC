<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/direccionprovincia.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$provincia = new Provincia($db);

	try
	{
	    $provincia->id_provincia = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $provincia->readxId();

	    $provincia_list = array(
	        "id"=>$provincia->id_provincia,
	        "departamento"=>$provincia->dpt_nombre,
            "nombre"=>$provincia->prv_nombre
	    );

	    if(trim($provincia->dpt_nombre)!= ''){
	        print_json("0000", "OK", $provincia_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el provincia registrado con el id " . $provincia->id_provincia , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>