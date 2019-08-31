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

        $talonario->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) : "";

        $talonario_array = $talonario->verificar_serie();

        if ( $talonario->total_resultado )
        { 
            print_json("0000", 0, $talonario->total_resultado);
        }
        else
        { print_json("0001", "0", 0); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>