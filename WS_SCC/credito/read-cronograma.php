<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $credito = new Creditos($db);

        $credito->id_credito = !empty($_GET['prcredito']) ? trim($_GET['prcredito']) : null;
        $credito->orden = !empty($_GET['prorden']) ? trim($_GET['prorden']) : 'fecha_vencimiento asc';

        $credito_list = $credito->read_cronograma();

        if (count(array_filter($credito_list))>0)
        { 
            print_json("0000", 0, $credito_list);
        }
        else
        { print_json("0001", "No se encuentra el cronograma para el crédito registrado con el id " . $credito->id_credito , null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>