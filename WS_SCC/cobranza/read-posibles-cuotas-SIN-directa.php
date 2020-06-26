<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cobranza = new Cobranzas($db);

        $cobranza->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : die() ;
        $cobranza->monto = !empty($_GET['prmonto']) ? trim($_GET['prmonto']) : 1000;
        $cobranza->id_transaccion = !empty($_GET['prtransaccion']) ? trim($_GET['prtransaccion']) : 0;
        $cobranza->solo_directas = !empty($_GET['prsolodirectas']) ? trim($_GET['prsolodirectas']) : 0;
        $cobranza->fecha_referencia = !empty($_GET['prfechareferencia']) ? trim($_GET['prfechareferencia']) : null;
        $cobranza->id_cobranza = !empty($_GET['prcobranza']) ? trim($_GET['prcobranza']) : die() ;

        $cobranza_list = $cobranza->seleccionar_cuotas_pagar_SIN_directa();

        if (count(array_filter($cobranza_list))>0)
        { 
            print_json("0000", 0, $cobranza_list);
        }
        else
        { print_json("0001", 1, $cobranza_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>