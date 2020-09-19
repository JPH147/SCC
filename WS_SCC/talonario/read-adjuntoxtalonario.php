<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");


    include_once '../config/database.php';
    include_once '../entities/talonario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $talonario = new Talonario($db);

        $talonario->id_talonario = !empty($_GET['prtalonario']) ? trim($_GET['prtalonario']) : die;

        $talonario_array = $talonario->read_talonario_adjuntoxId();

        if (count(array_filter($talonario_array))>0)
        { 
            print_json("0000", 0, $talonario_array);
        }
        else
        { print_json("0001", "0", $talonario_array); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>