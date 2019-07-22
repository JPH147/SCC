<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/presupuesto.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $presupuesto = new Presupuesto($db);

        $presupuesto->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : "";
        $presupuesto->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
        $presupuesto->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;
        $presupuesto->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 3;
        $presupuesto->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $presupuesto->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $presupuesto_list = $presupuesto->read_presupuesto();
        $presupuesto_contar = $presupuesto->contar_presupuesto();

        if (count(array_filter($presupuesto_list))>0)
        { 
            print_json("0000", $presupuesto_contar, $presupuesto_list);
        }
        else
        { print_json("0001", $presupuesto_contar, $presupuesto_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>