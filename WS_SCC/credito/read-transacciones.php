<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $credito = new Creditos($db);

        $credito->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) :'';

        $credito_list = $credito->read_transacciones();
        $credito_cronograma = $credito->read_transacciones_cronograma();

        if (count(array_filter($credito_list))>0)
        { 
            print_json("0000", $credito_cronograma, $credito_list);
        }
        else
        { print_json("0001", 0, $credito_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>