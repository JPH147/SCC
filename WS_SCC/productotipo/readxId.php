<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
    include_once '../entities/productotipo.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
    $productotipo = new Tipo_Producto($db);

	try
	{
	    $productotipo->id_tipo_producto = isset($_GET['id']) ? $_GET['id'] : die();
	    
	    $productotipo->readxId();

	    $producto_list = array(
	        "id"=>$productotipo->id_tipo_producto,
            "nombre"=>$productotipo->tprd_nombre,
            "idunidad"=>$productotipo->idunidadmedida,

	    );

	    if(trim($productotipo->id_tipo_producto)!= null){
	        print_json("0000", "OK", $producto_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el tipo de producto registrado con el id " . $productotipo->id_tipo_producto , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>