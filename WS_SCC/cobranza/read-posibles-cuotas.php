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

        $cobranza->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : 1;
        $cobranza->monto = !empty($_GET['prmonto']) ? trim($_GET['prmonto']) : 20;

        $cobranza_list = $cobranza->seleccionar_cuotas_pagar();

        if (count(array_filter($cobranza_list))>0)
        { 
            print_json("0000", 0, $cobranza_list);
        }
        else
        { print_json("0001", 1, $cobranza_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>