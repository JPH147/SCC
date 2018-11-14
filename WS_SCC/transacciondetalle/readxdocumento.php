<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/transacciondetalle.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $transaccion = new TransaccionDetalle($db);

        $transaccion->documento = !empty($_GET['prguia']) ? $_GET['prguia'] : null;
        
        $transaccion_list = $transaccion->readxdocumento();

        if (count(array_filter($transaccion_list))>0)
        { 
            print_json("0000", 1, $transaccion_list);
        }
        else
        { print_json("0001", 1, "No hay datos para mostrar"); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>