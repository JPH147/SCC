<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/direcciondistrito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$distrito = new Distrito($db);

    	$distrito->dpt_nombre = !empty($_GET['prdepartamento']) ? $_GET['prdepartamento'] : null;
        $distrito->prv_nombre = !empty($_GET['prprovincia']) ? $_GET['prprovincia'] : null;
        $distrito->dst_nombre = !empty($_GET['prdistrito']) ? $_GET['prdistrito'] : null;
        $distrito->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : null;
        $distrito->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : null;

    	$distrito_list = $distrito->read();
        $distrito_contar = $distrito->contar();

    	if (count(array_filter($distrito_list))>0)
    	{
    		print_json("0000",$distrito_contar,$distrito_list);
    	}
    	else
    	{
    		print_json("0001", "No existen distritos registrados", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>