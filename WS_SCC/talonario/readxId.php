<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/talonario.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$talonario = new Talonario($db);

	try
	{
	    $talonario->id = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $talonario->readxId();

	    $talonario_list = array(
			"id"=>$talonario->id,
			"serie"=>$talonario->serie,
			"numero"=>$talonario->numero,
			"salida"=>$talonario->salida,
			"estado"=>$talonario->estado,
	    );

	    if(trim($talonario->id)!= ''){
	        print_json("0000", "OK", $talonario_list);
	    }
	    else{
	        print_json("0001", "No se encuentra la venta registrada con el id " . $talonario->id , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>