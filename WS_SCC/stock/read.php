<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/stock.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $stock = new Stock($db);

        $stock->almacen = !empty($_GET['pralmacen']) ? $_GET['pralmacen'] :'';
        $stock->tipo = !empty($_GET['prtipo']) ? $_GET['prtipo'] :'';
        $stock->marca = !empty($_GET['prmarca']) ? $_GET['prmarca'] : '';
        $stock->modelo = !empty($_GET['prmodelo']) ? $_GET['prmodelo'] : '';
        $stock->descripcion = !empty($_GET['prdescripcion']) ? $_GET['prdescripcion'] : '';
        $stock->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : 1;
        $stock->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : 20;
        $stock->orden = !empty($_GET['orden']) ? $_GET['orden'] : 'modelo asc';

        $stock_list = $stock->read();
       // $stock_contar = $stock->contar();

        if (count(array_filter($stock_list))>0)
        { 
            //print_json("0000", $stock_contar, $stock_list);
            print_json("0000", "1", $stock_list);
        }
        else
        { print_json("0001", "stock_contar", $stock_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>