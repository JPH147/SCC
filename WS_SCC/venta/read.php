<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $venta = new Venta($db);

        $venta->cliente = !empty($_GET['prcliente']) ? $_GET['prcliente'] :'';
        $venta->tipo_venta = !empty($_GET['prtipo_venta']) ? $_GET['prtipo_venta'] : null;
        $venta->fecha_inicio = !empty($_GET['prfecha_inicio']) ? $_GET['prfecha_inicio'] : null;
        $venta->fecha_fin = !empty($_GET['prfecha_fin']) ? $_GET['prfecha_fin'] : null;
        $venta->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : 1;
        $venta->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : 20;
        $venta->orden = !empty($_GET['prorden']) ? $_GET['prorden'] : 'serie asc';

        $venta_list = $venta->read();
        $venta_contar = $venta->contar();

        if (count(array_filter($venta_list))>0)
        { 
            print_json("0000", $venta_contar, $venta_list);
        }
        else
        { print_json("0001", $venta_contar, $venta_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>