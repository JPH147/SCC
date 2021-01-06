<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cliente = new Cliente($db);

        $cliente->id_centro_trabajo = trim($_POST['prcentrotrabajo']) ;
        $cliente->id_distrito = trim($_POST['prdistrito']) ;
        $cliente->comisaria = trim($_POST['prcomisaria']) ;
        $cliente->division = trim($_POST['prdivision']) ;
        $cliente->telefono = trim($_POST['prtelefono']) ;
        $cliente->direccion = trim($_POST['prdireccion']) ;

        $resultado = $cliente->update_centro_trabajo();
        
        if ( $resultado )
        { 
            print_json("0000", 1, true);
        }
        else
        { print_json("0001", 0, false); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>