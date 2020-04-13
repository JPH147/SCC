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

        $cliente->archivo = !empty($_GET['prarchivo']) ? trim($_GET['prarchivo']) : '';
        $cliente->clt_codigo = !empty($_GET['prcodigo']) ? trim($_GET['prcodigo']) : '';
        $cliente->clt_cip = !empty($_GET['prcip']) ? trim($_GET['prcip']) : '';
        $cliente->clt_dni = !empty($_GET['prdni']) ? trim($_GET['prdni']) : '';
        $cliente->clt_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $cliente->clt_cargo = !empty($_GET['prcargo']) ? trim($_GET['prcargo']) : '';
        $cliente->ssd_nombre = !empty($_GET['prsubsede']) ? trim($_GET['prsubsede']) : '';
        $cliente->clt_estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 1;

        $cliente_archivo = $cliente->read_comercial_unlimited();
        
        if ( $cliente_archivo )
        { 
            print_json("0000", 1, $cliente_archivo);
        }
        else
        { print_json("0001", 0, false ); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>