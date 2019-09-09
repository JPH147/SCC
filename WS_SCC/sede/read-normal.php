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

    	$sede->institucion = !empty($_GET['prinstitucion']) ? trim($_GET['prinstitucion']) : "";
    	$sede->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : "";
        $sede->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $sede->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

    	$sede_list = $sede->read_normal();
    	$sede_contar = $sede->read_normal_contar();

    	if (count(array_filter($sede_list))>0)
    	{
    		print_json("0000", $sede_contar, $sede_list);
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