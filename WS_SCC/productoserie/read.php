<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/productoserie.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $productoserie = new ProductoSerie($db);

        $productoserie->almacen = !empty($_GET['pralmacen']) ? $_GET['pralmacen'] :'';
        $productoserie->id_producto = !empty($_GET['prproducto']) ? $_GET['prproducto'] :null;

        $producto_serie_list = $productoserie->read();

        if (count(array_filter($producto_serie_list))>0)
        { 
            print_json("0000", 1, $producto_serie_list);
        }
        else
        { print_json("0001", 1, $producto_serie_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>