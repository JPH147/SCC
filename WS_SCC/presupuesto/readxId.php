<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/presupuesto.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $presupuesto = new Presupuesto($db);

        $presupuesto->id_presupuesto = !empty($_GET['prid']) ? trim($_GET['prid']) : "";

        $array_presupuesto = $presupuesto->readxId();

        if ( !empty($array_presupuesto) )
        { 
            print_json("0000", 1, $array_presupuesto);
        }
        else
        { print_json("0001", 0, "No hay datos que mostrar"); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>