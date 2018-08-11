<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");  //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/vendedor.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $vendedor = new Vendedor($db);

        $vendedor->vnd_dni = !empty($_GET['vnd_dni']) ? $_GET['vnd_dni'] : null;
        $vendedor->vnd_nombre = !empty($_GET['vnd_nombre']) ? $_GET['vnd_nombre'] : null;
        $vendedor->scs_nombre = !empty($_GET['scs_nombre']) ? $_GET['scs_nombre'] : null;

        $vendedor_list = $vendedor->read();

        if (count(array_filter($vendedor_list))>0)
        { 
            print_json("0000", "OK", $vendedor_list);
         }
        else
        { print_json("0001", "No existen clientes registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>