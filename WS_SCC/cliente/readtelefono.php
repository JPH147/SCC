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

        $cliente->clt_numero = !empty($_GET['prnumero']) ? trim($_GET['prnumero']) : '';

        $telefonos_cliente = $cliente->read_telefono();
        
        if (count(array_filter($telefonos_cliente))>0)
        { 
            print_json("0000", 1, $telefonos_cliente);
         }
        else
        { print_json("0001", "No existen clientes registrados", 1); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>