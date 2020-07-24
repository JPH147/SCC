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

        $stock->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) : die();

        $stock_list = $stock->VerificarStockxSerie();

        if ( $stock_list >= 0 ) { 
            print_json("0000", 0, $stock_list);
        }
        else
        { print_json("0001", 0, $stock_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>