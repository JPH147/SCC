<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/clientecuenta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $clientecuenta = new ClienteCuenta($db);

        $clientecuenta->id_cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : null;
        $clientecuenta->prpagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $clientecuenta->prtotalpagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 5;

        $lista_cuenta = $clientecuenta->read();
        $total_cuenta = $clientecuenta->contar();

        if (count(array_filter($lista_cuenta))>0)
        { 
            print_json("0000", $total_cuenta, $lista_cuenta);
         }
        else
        { print_json("0001", "No existen direcciones registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>