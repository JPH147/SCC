<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/seguimiento.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $seguimiento = new Seguimiento($db);

        $seguimiento->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : "";
        $seguimiento->numero_seguimiento = !empty($_GET['prnumeroseguimiento']) ? trim($_GET['prnumeroseguimiento']) : "";
        $seguimiento->courier = !empty($_GET['prcourier']) ? trim($_GET['prcourier']) : "";
        $seguimiento->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 0;
        $seguimiento->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
        $seguimiento->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;
        $seguimiento->numero_pagina = !empty($_GET['prnumeropagina']) ? trim($_GET['prnumeropagina']) : 1;
        $seguimiento->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $seguimiento_list = $seguimiento->read();
        $seguimiento_contar = $seguimiento->contar();

        if (count(array_filter($seguimiento_list))>0)
        { 
            print_json("0000", $seguimiento_contar, $seguimiento_list);
        }
        else
        { print_json("0001", $seguimiento_contar, $seguimiento_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>