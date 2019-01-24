<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/clienteobservacion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $clienteobservacion = new ClienteObservacion($db);

        $clienteobservacion->id_cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : null;

        $observacion_list = $clienteobservacion->read();

        if (count(array_filter($observacion_list))>0)
        { 
            print_json("0000", "OK", $observacion_list);
        }
        
        else
        { print_json("0001", "No existen direcciones registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>