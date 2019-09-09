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

    	$subsede->institucion = !empty($_GET['prinstitucion']) ? trim($_GET['prinstitucion']) : "";
        $subsede->sede = !empty($_GET['prsede']) ? trim($_GET['prsede']) : "";
        $subsede->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : "";
        $subsede->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $subsede->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

    	$subsede_list = $subsede->read_normal();
    	$subsede_total= $subsede->read_normal_contar();

    	if (count(array_filter($subsede_list))>0)
    	{
    		print_json("0000", $subsede_total, $subsede_list);
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