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

        $cobranza->id_cobranza = !empty($_GET['prcabecera']) ? trim($_GET['prcabecera']) :  die() ;

        $cobranza_cabecera = $cobranza->read_cobranza_archivosxId();
        $cobranza_detalle = $cobranza->read_cobranza_detallexcabecera();

        if (count(array_filter($cobranza_cabecera))>0)
        { 
            print_json("0000", $cobranza_detalle, $cobranza_cabecera);
        }
        else
        { print_json("0001", $cobranza_detalle, $cobranza_cabecera); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>