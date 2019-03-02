<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");  //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/autorizador.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $autorizador = new Autorizador($db);

        $autorizador->id_sucursal = !empty($_GET['prsucursal']) ? trim($_GET['prsucursal']) : null;
        $autorizador->autorizador_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $autorizador->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $autorizador->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 5;

        $autorizador_list = $autorizador->read();
        $autorizador_total = $autorizador->contar();

        if (count(array_filter($autorizador_list))>0)
        { 
            print_json("0000", $autorizador_total, $autorizador_list);
         }
        else
        { print_json("0001", "No existen clientes registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>