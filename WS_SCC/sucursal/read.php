<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/sucursal.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$sucursal = new Sucursal($db);

    	$sucursal->id = !empty($_GET['prid']) ? trim($_GET['prid']) : null;
    	$sucursal->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : null;

    	$sucursal_list = $sucursal->read();

    	if (count(array_filter($sucursal_list))>0)
    	{
    		print_json("0000", count(array_filter($sucursal_list)),$sucursal_list);
    	}
    	else
    	{
    		print_json("0001", "No existen tipos de producto registrados", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>