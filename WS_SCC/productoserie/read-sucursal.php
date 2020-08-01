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

        $productoserie->sucursal = !empty($_GET['prsucursal']) ? trim($_GET['prsucursal']) : die() ;
        $productoserie->id_producto = !empty($_GET['prproducto']) ? trim($_GET['prproducto']) : "";
        $productoserie->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) : '';
        $productoserie->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $productoserie->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $producto_serie_list = $productoserie->read_sucursal();
        $producto_serie_contar = $productoserie->contar_sucursal();

        if (count(array_filter($producto_serie_list))>0)
        { 
            print_json("0000", $producto_serie_contar, $producto_serie_list);
        }
        else
        { print_json("0001", 1, $producto_serie_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>