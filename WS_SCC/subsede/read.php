<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/subsede.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$subsede = new Subsede($db);

    	$subsede->id_sede = !empty($_GET['id_sede']) ? $_GET['id_sede'] : null;
    	$subsede->ssd_nombre = !empty($_GET['ssd_nombre']) ? $_GET['ssd_nombre'] : null;

    	$subsede_list = $subsede->read();

    	if (count(array_filter($subsede_list))>0)
    	{
    		print_json("0000", "OK",$subsede_list);
    	}
    	else
    	{
    		print_json("0001", "No existen subsedes registradas", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>