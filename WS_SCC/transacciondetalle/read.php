<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/transacciondetalle.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $transaccion = new TransaccionDetalle($db);

        $transaccion->id_cabecera = !empty($_GET['prcabecera']) ? $_GET['prcabecera'] : null;
        $transaccion->producto = !empty($_GET['prproducto']) ? $_GET['prproducto'] :'';
        $transaccion->serie = !empty($_GET['prserie']) ? $_GET['prserie'] :'';
        $transaccion->tipo = !empty($_GET['prtipo']) ? $_GET['prtipo'] :null;
        $transaccion->referencia = !empty($_GET['prreferencia']) ? $_GET['prreferencia'] :null;
        $transaccion->referente = !empty($_GET['prreferente']) ? $_GET['prreferente'] :'';
        
        $transaccion_list = $transaccion->read();
        $transaccion_contar = $transaccion->contar();

        if (count(array_filter($transaccion_list))>0)
        { 
            print_json("0000", $transaccion_contar, $transaccion_list);
        }
        else
        { print_json("0001", $transaccion_contar, $transaccion_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>