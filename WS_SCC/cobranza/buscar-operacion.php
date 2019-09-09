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

        $cobranza->operacion = !empty($_GET['properacion']) ? trim($_GET['properacion']) : "";

        $cobranzas_total = $cobranza->search_cobranza_directa();

        if ( $cobranzas_total )
        { 
            print_json("0000", 1, $cobranzas_total);
        }
        else
        { print_json("0001", 0, $cobranzas_total); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>