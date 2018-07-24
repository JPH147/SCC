<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/direcciondistrito.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$distrito = new distrito($db);

	try
	{
	    $distrito->id_distrito = isset($_GET['prid']) ? $_GET['prid'] : die();
	    
	    $distrito->readxId();

	    $distrito_list = array(
	        "id"=>$distrito->id_distrito,
	        "departamento"=>$distrito->dpt_nombre,
	        "provincia"=>$distrito->prv_nombre,
	        "nombre"=>$distrito->dst_nombre
	    );

	    if(trim($distrito->dst_nombre)!= ''){
	        print_json("0000", "OK", $distrito_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el distrito registrado con el id " . $distrito->id_distrito , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>