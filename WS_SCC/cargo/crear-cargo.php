<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cargo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cargo = new Cargo($db);

        $cargo->sede = $_POST['prsede'] ;
        $cargo->cargo = $_POST['prcargo'] ;

        if ( $cargo->create_cargo() )
        { 
            print_json("0000", 0, true);
        }
        else
        { print_json("0001", 0, 1); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>