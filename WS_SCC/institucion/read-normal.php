<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/institucion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$institucion = new Institucion($db);

        $institucion->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) :'';
        $institucion->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $institucion->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

    	$institucion_list = $institucion->read_normal();
    	$institucion_contar = $institucion->read_normal_contar();

    	if (count(array_filter($institucion_list))>0)
    	{
    		print_json("0000", $institucion_contar, $institucion_list);
    	}
    	else
    	{
    		print_json("0001", "No existen instituciones registradas", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>