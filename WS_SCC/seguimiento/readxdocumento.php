<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/seguimiento.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $seguimiento = new Seguimiento($db);

        $seguimiento->tipo = !empty($_GET['prtipo']) ? trim($_GET['prtipo']) : '';
        $seguimiento->id = !empty($_GET['prid']) ? trim($_GET['prid']) : '';

        $seguimiento_list = $seguimiento->readxdocumento();

        if (count(array_filter($seguimiento_list))>0)
        { 
            print_json("0000", 1, $seguimiento_list);
        }
        else
        { print_json("0001", 0, $seguimiento_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>