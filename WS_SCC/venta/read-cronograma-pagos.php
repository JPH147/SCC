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

        $venta->id_cronograma = !empty($_GET['prcronograma']) ? trim($_GET['prcronograma']) :'';
        $venta->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $venta->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $venta_list = $venta->read_cronograma_pagos();
        $venta_list_contar = $venta->read_cronograma_pagos_contar();

        if (count(array_filter($venta_list))>0)
        { 
            print_json("0000", $venta_list_contar, $venta_list);
        }
        else
        {
            print_json("0001", $venta_list_contar, $venta_list);
        }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>