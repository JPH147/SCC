<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/plantillas.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $plantilla = new Plantillas($db);

        $plantilla_list = $plantilla->read_tipo();

        if (count(array_filter($plantilla_list))>0)
        { 
            print_json("0000", count(array_filter($plantilla_list)) , $plantilla_list);
        }
        else
        { print_json("0001", 0, $plantilla_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>