<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/direcciondepartamento.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$departamento = new Departamento($db);

	try
	{
	    $departamento->id_departamento = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $departamento->readxId();

	    $departamento_list = array(
	        "id"=>$departamento->id_departamento,
            "nombre"=>$departamento->dpt_nombre,
	    );

	    if(trim($departamento->dpt_nombre)!= ''){
	        print_json("0000", "OK", $departamento_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el departamento registrado con el id " . $departamento->id_departamento , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>