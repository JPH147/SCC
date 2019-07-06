<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/courier.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $courier = new Courier($db);

        $courier->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) :'';
        $courier->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $courier->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $courier_list = $courier->read();
        $courier_contar = $courier->contar();

        if (count(array_filter($courier_list))>0)
        { 
            print_json("0000", $courier_contar, $courier_list);
        }
        else
        { print_json("0001", $courier_contar, $courier_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>