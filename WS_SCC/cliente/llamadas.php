<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cliente = new Cliente($db);
        
        $cliente->idcliente = !empty($_GET['prid']) > 0 ? trim($_GET['prid']) : die() ;

        $cliente_list = $cliente->obtener_llamadas();
        
        if (count(array_filter($cliente_list))>0)
        { 
            print_json("0000", count($cliente_list), $cliente_list);
         }
        else
        { print_json("0001", 0, $cliente_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>