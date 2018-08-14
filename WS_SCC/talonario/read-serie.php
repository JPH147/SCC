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

        $talonario = $talonario->read_serie();
       // $producto_contar = $talonario->contar();

        if (count(array_filter($talonario))>0)
        { 
            print_json("0000", "0", $talonario);
        }
        else
        { print_json("0001", "0", $talonario); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>