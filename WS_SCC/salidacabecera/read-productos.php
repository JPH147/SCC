<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/salidacabecera.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $salida = new SalidaCabecera($db);

        $salida->id_salida = !empty($_GET['prid']) ? trim($_GET['prid']) : "";
        $salida->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 0;

        $salida_list = $salida->read_productos();

        if (count(array_filter($salida_list))>0)
        { 
            print_json("0000", 0, $salida_list);
        }
        else
        { print_json("0001", 0, $salida_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>