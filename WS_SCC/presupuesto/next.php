<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/presupuesto.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$presupuesto = new Presupuesto($db);

	try
	{
  	    $presupuesto->get_next();

	    $presupuesto_list = array(
	        "numero"=>$presupuesto->numero,
	    );

	    if(trim($presupuesto->numero)!= ''){
	        print_json("0000", "OK", $presupuesto_list);
	    }
	    else{
	        print_json("0001", "No se obtuvo el próximo número de presupuesto ", null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>