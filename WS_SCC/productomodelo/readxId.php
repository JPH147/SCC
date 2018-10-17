<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
    include_once '../entities/productomodelo.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
    $modelo = new Modelo($db);

	try
	{
	    $modelo->id_modelo = isset($_GET['id']) ? $_GET['id'] : die();
	    
	    $modelo->readxId();

	    $modelo_list = array(
	        "id"=>$modelo->id_modelo,
            "id_marca"=>$modelo->id_marca,
            "modelo"=>$modelo->mdl_nombre,

	    );

	    if($modelo->id_modelo != null){
	        print_json("0000", "OK", $modelo_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el modelo registrado con el id " . $modelo->id_modelo , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>