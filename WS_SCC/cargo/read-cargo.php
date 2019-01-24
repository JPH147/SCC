<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cargo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cargo = new Cargo($db);

        $cargo->id_sede = !empty($_GET['prsede']) ? trim($_GET['prsede']) : null;

        $cliente_list = $cargo->read_cargo();
        
        if (count(array_filter($cliente_list))>0)
        { 
            print_json("0000", 1, $cliente_list);
         }
        else
        { print_json("0001", "No existen clientes registrados", 1); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>