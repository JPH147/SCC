<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/clientedireccion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $clientedireccion = new ClienteDireccion($db);

        $clientedireccion->id_cliente = !empty($_GET['id_cliente']) ? $_GET['id_cliente'] : null;
        $clientedireccion->drc_relevancia = !empty($_GET['drc_relevancia']) ? $_GET['drc_relevancia'] : null;

        $direccion_list = $clientedireccion->read();

        if (count(array_filter($direccion_list))>0)
        { 
            print_json("0000", "OK", $direccion_list);
         }
        else
        { print_json("0001", "No existen direcciones registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>