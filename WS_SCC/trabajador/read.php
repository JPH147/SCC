<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/trabajador.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $trabajador = new Trabajador($db);

        $trabajador->documento = !empty($_GET['prdocumento']) ? trim($_GET['prdocumento']) : '';
        $trabajador->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $trabajador->parametro = !empty($_GET['prparametro']) ? trim($_GET['prparametro']) : 0;
        $trabajador->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $trabajador->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $trabajador_list = $trabajador->read();
        $trabajador_contar = $trabajador->contar();

        if (count(array_filter($trabajador_list))>0)
        { 
            print_json("0000", $trabajador_contar, $trabajador_list);
        }
        else
        { print_json("0001", 0, $trabajador_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>