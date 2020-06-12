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

        $cobranza->id_cobranza = !empty($_GET['prid']) ? trim($_GET['prid']) : die();

        $cobranza = $cobranza->read_cobranzas_manualesxID();

        if (count(array_filter($cobranza))>0)
        { 
            print_json("0000", 1, $cobranza);
        }
        else
        { print_json("0001", 0, $cobranza); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>