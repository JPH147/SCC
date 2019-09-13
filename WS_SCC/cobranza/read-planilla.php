<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cobranza = new Cobranzas($db);

        $cobranza->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $cobranza->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $cobranza_list = $cobranza->read_planilla_cabecera();
        $cobranza_contar = $cobranza->read_planilla_cabecera_contar();

        if (count(array_filter($cobranza_list))>0)
        { 
            print_json("0000", $cobranza_contar, $cobranza_list);
        }
        else
        { print_json("0001", $cobranza_contar, $cobranza_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>