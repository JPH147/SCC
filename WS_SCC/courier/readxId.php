<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/courier.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $courier = new Courier($db);

        $courier->id_courier = !empty($_GET['prid']) ? trim($_GET['prid']) : die();

        $courier_list = $courier->readxId();

        if (count(array_filter($courier_list))>0)
        { 
            print_json("0000", 1, $courier_list);
        }
        else
        { print_json("0001", 0, $courier_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>