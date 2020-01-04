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

        $vendedor->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $vendedor->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $vendedor->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

        $vendedor_list = $vendedor->read_cargo();
        $vendedor_total = $vendedor->read_cargo_contar();

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