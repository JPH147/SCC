<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/producto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $producto = new Producto($db);

        $producto->sucursal = !empty($_GET['prsucursal']) ? trim($_GET['prsucursal']) : null;
        $producto->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';

        $producto_list = $producto->read_sucursal();

        if (count(array_filter($producto_list))>0)
        { 
            print_json("0000", 0, $producto_list);
        }
        else
        { print_json("0001", 0, $producto_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>