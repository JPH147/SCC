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

        $productoserie->producto = !empty($_GET['prproducto']) ? $_GET['prproducto'] :'';
        $productoserie->serie = !empty($_GET['prserie']) ? $_GET['prserie'] :'';

        $producto_serie_list = $productoserie->read();
        $producto_serie_contar = $productoserie->contar();

        if (count(array_filter($producto_serie_list))>0)
        { 
            print_json("0000", $producto_serie_contar, $producto_serie_list);
        }
        else
        { print_json("0001", $producto_serie_contar, $producto_serie_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>