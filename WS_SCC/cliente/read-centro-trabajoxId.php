<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cliente = new Cliente($db);

        $cliente->id_centro_trabajo = trim($_GET['prid']) ;

        $cliente_list = $cliente->read_centro_trabajoxId();
        
        if (count(array_filter($cliente_list))>0)
        { 
            print_json("0000", $cliente_contar, $cliente_list);
         }
        else
        { print_json("0001", $cliente_contar, $cliente_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>