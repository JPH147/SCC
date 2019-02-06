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

    	$distrito->dpt_nombre = !empty($_GET['prdepartamento']) ? trim($_GET['prdepartamento']) : '';
        $distrito->prv_nombre = !empty($_GET['prprovincia']) ? trim($_GET['prprovincia']) : '';
        $distrito->dst_nombre = !empty($_GET['prdistrito']) ? trim($_GET['prdistrito']) : '';
        $distrito->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $distrito->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

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