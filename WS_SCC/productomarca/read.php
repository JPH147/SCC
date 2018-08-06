<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/productomarca.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$marca = new Marca($db);

    	$marca->id_tipo_producto = !empty($_GET['prtipo']) ? $_GET['prtipo'] : null;
    	$marca->mrc_nombre = !empty($_GET['prnombre']) ? $_GET['prnombre'] : null;

    	$marca_list = $marca->read();

    	if (count(array_filter($marca_list))>0)
    	{
    		print_json("0000", count(array_filter($marca_list)),$marca_list);
    	}
    	else
    	{
    		print_json("0001", "No existen marcas registradas", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>