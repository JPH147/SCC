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
        
        $cliente->archivo = !empty($_POST['prarchivo']) > 0 ? trim($_POST['prarchivo']) : die() ;

        if ( $cliente->eliminar_llamada() )
        { print_json("0000", 0, true); }
        else
        { print_json("0001", 0, false); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>