<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/productomodelo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$modelo = new Modelo($db);

    	$modelo->id_marca = !empty($_GET['prmarca']) ? trim($_GET['prmarca']) : null;
    	$modelo->mdl_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : null;

    	$modelo_list = $modelo->read();

    	if (count(array_filter($modelo_list))>0)
    	{
    		print_json("0000", count(array_filter($modelo_list)),$modelo_list);
    	}
    	else
    	{
    		print_json("0001", "No existen modelos registrados", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>