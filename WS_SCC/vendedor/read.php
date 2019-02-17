<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");  //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/vendedor.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $vendedor = new Vendedor($db);

        $vendedor->vnd_dni = !empty($_GET['vnd_dni']) ? trim($_GET['vnd_dni']) : '';
        $vendedor->vnd_nombre = !empty($_GET['vnd_nombre']) ? trim($_GET['vnd_nombre']) : '';
        $vendedor->scs_nombre = !empty($_GET['scs_nombre']) ? trim($_GET['scs_nombre']) : '';
        $vendedor->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $vendedor->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

        $vendedor_list = $vendedor->read();
        $vendedor_total = $vendedor->contar();

        if (count(array_filter($vendedor_list))>0)
        { 
            print_json("0000", $vendedor_total, $vendedor_list);
         }
        else
        { print_json("0001", "No existen clientes registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>