<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/productoserie.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $productoserie = new ProductoSerie($db);

        $productoserie->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) :'';

        $producto_serie_validar = $productoserie->validar();

        if (trim($productoserie->total_resultado)!= '')
        { 
            print_json("0000", "Total de series", $producto_serie_validar);
        }
        else
        { print_json("0001", 1, $producto_serie_validar); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>