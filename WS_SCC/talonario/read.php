<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");


    include_once '../config/database.php';
    include_once '../entities/talonario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $talonario = new Talonario($db);

        $talonario->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) : "";
        $talonario->numero = !empty($_GET['prnumero']) ? trim($_GET['prnumero']) : "";
        $talonario->numero_pagina = !empty($_GET['prnumeropagina']) ? trim($_GET['prnumeropagina']) : 1;
        $talonario->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $talonario_array = $talonario->read();
        $talonario_total = $talonario->contar();

        if (count(array_filter($talonario_array))>0)
        { 
            print_json("0000", $talonario_total, $talonario_array);
        }
        else
        { print_json("0001", "0", $talonario_array); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>