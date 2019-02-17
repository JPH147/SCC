<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/clientedireccion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $clientedireccion = new ClienteDireccion($db);

        $clientedireccion->id_cliente = !empty($_GET['id_cliente']) ? trim($_GET['id_cliente']) : null;
        $clientedireccion->drc_relevancia = !empty($_GET['drc_relevancia']) ? trim($_GET['drc_relevancia']) : null;
        $clientedireccion->prpagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $clientedireccion->prtotalpagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 5;

        $direccion_list = $clientedireccion->read();
        $total_direccion = $clientedireccion->contar();

        if (count(array_filter($direccion_list))>0)
        { 
            print_json("0000", $total_direccion, $direccion_list);
         }
        else
        { print_json("0001", 0, null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>