<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $venta = new Venta($db);

        $venta->id_venta = !empty($_GET['prventa']) ? trim($_GET['prventa']) : die() ;

        $venta_list = $venta->read_venta_vendedores();

        if (count(array_filter($venta_list))>0)
        { 
            print_json("0000", 0, $venta_list);
        }
        else
        {
            print_json("0001", 0, $venta_list);
        }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>