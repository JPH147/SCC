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

        $producto->tprd_nombre = !empty($_GET['prtipo']) ? $_GET['prtipo'] : null;
        $producto->mrc_nombre = !empty($_GET['prmarca']) ? $_GET['prmarca'] : null;
        $producto->mdl_nombre = !empty($_GET['prmodelo']) ? $_GET['prmodelo'] : null;
        $producto->prd_descripcion = !empty($_GET['prdescripcion']) ? $_GET['prdescripcion'] : null;

        $producto_list = $producto->read();

        if (count(array_filter($producto_list))>0)
        { print_json("0000", count(array_filter($producto_list)), $producto_list); }
        else
        { print_json("0001", "No existen usuarios registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>