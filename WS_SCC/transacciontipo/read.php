<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/transacciontipo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $transaccion = new TransaccionTipo($db);

        $transaccion->tipo = !empty($_GET['prid']) ? $_GET['prid'] :null;

        $transaccion_list = $transaccion->read();

        if (count(array_filter($transaccion_list))>0)
        { 
            print_json("0000", "1", $transaccion_list);
        }
        else
        { print_json("0001", "2", $transaccion_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>