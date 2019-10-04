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

        $cobranza->sede = !empty($_GET['prsede']) ? trim($_GET['prsede']) :  die() ;
        $cobranza->fecha = !empty($_GET['prfecha']) ? trim($_GET['prfecha']) : die() ;

        $cobranza_list = $cobranza->verificar_pago_sede();

        if ( $cobranza_list >= 0)
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