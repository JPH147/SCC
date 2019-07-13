<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $credito = new Creditos($db);

        $credito->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) :'';
        $credito->tipo_credito = !empty($_GET['prtipo_credito']) ? trim($_GET['prtipo_credito']) : 0;
        $credito->documentos = !empty($_GET['prdocumentos']) ? trim($_GET['prdocumentos']) : 0;
        $credito->fecha_inicio = !empty($_GET['prfecha_inicio']) ? trim($_GET['prfecha_inicio']) : null;
        $credito->fecha_fin = !empty($_GET['prfecha_fin']) ? trim($_GET['prfecha_fin']) : null;
        $credito->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 0;
        $credito->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $credito->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;
        $credito->orden = !empty($_GET['prorden']) ? trim($_GET['prorden']) : 'id desc';

        $credito_list = $credito->read();
        $credito_contar = $credito->contar();

        if (count(array_filter($credito_list))>0)
        { 
            print_json("0000", $credito_contar, $credito_list);
        }
        else
        { print_json("0001", $credito_contar, $credito_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>