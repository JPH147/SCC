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

    	$marca->tipo = !empty($_GET['prtipo']) ? trim($_GET['prtipo']) : null;
        $marca->mrc_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : null;
        $marca->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : null;
        $marca->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : null;

        $marca_list = $marca->read2();
        $contar = $marca->contar();

    	if ($contar >0)
    	{
    		print_json("0000", $contar ,$marca_list);
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