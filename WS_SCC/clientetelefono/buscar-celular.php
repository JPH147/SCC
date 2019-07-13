<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/clientetelefono.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $clientetelefono = new ClienteTelefono($db);

        $clientetelefono->id_cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : null;

        $telefono_list = $clientetelefono->buscar_celular();

        if ( $telefono_list > 0 )
        { 
            print_json("0000", $clientetelefono->id_cliente , $telefono_list);
         }
        else
        { print_json("0001", 0, null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>