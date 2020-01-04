<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/sede.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$sede = new Sede($db);

    	$sede->id_sede = !empty($_GET['prsede']) ? trim($_GET['prsede']) : die() ;

    	$sede_list = $sede->read_parametros();

    	if (count(array_filter($sede_list))>0)
    	{
    		print_json("0000", "OK",$sede_list);
    	}
    	else
    	{
    		print_json("0001", "No existen sedes registradas", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>