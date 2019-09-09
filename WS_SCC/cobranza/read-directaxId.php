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

        $cobranzas_list = $cobranza->read_cobranza_directaxId();

        if (count(array_filter($cobranzas_list))>0)
        { 
            print_json("0000", 1, $cobranzas_list);
        }
        else
        { print_json("0001", 0, $cobranzas_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>