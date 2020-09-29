<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cooperativa-configuracion.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cooperativa = new Cooperativa($db);

        $cooperativa_list = $cooperativa->obtener_ultimo_orden();

        if ( $cooperativa_list >= 0 )
        { 
            print_json("0000", 0, $cooperativa_list);
        }
        else
        { print_json("0001", 0, $cooperativa_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>