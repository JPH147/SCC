<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
    include_once '../entities/productomarca.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
    $marca = new Marca($db);

	try
	{
	    $marca->id_marca = isset($_GET['id']) ? trim($_GET['id']) : die();
	    
	    $marca->readxId();

	    $marca_list = array(
	        "id"=>$marca->id_marca,
            "idtipo"=>$marca->id_tipo_producto,
            "marca"=>$marca->mrc_nombre,

	    );

	    if(trim($marca->id_marca)!= null){
	        print_json("0000", "OK", $marca_list);
	    }
	    else{
	        print_json("0001", "No se encuentra la marca registrado con el id " . $marca->id_marca , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>