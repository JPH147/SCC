<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/producto.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$producto = new Producto($db);

	try
	{
	    $producto->id_producto = isset($_GET['id_producto']) ? trim($_GET['id_producto']) : die();
	    
	    $producto->readxId();

	    $producto_list = array(
	        "id"=>$producto->idproducto,
            "tipo"=>$producto->id_tipo_producto,
            "marca"=>$producto->id_marca,
            "modelo"=>$producto->id_modelo,
            "descripcion"=>$producto->prd_descripcion,
            "unidad_medida"=>$producto->und_nombre,
            "precio"=>$producto->prd_precio
	    );

	    if(trim($producto->prd_descripcion)!= ''){
	        print_json("0000", "OK", $producto_list);
	    }
	    else{
	        print_json("0001", "No se encuentra producto registrado con el id " . $producto->id_producto , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>