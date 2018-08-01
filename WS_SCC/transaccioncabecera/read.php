<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/transaccioncabecera.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $transaccion = new TransaccionCabecera($db);

        $transaccion->almacen = !empty($_GET['pralmacen']) ? $_GET['pralmacen'] :'';
        $transaccion->tipo = !empty($_GET['prtipo']) ? $_GET['prtipo'] :'';
        $transaccion->referencia = !empty($_GET['prreferencia']) ? $_GET['prreferencia'] : null;
        $transaccion->referente = !empty($_GET['prreferente']) ? $_GET['prreferente'] : '';
        $transaccion->fecha_inicio = !empty($_GET['prfechainicio']) ? $_GET['prfechainicio'] : null;
        $transaccion->fecha_fin = !empty($_GET['prfechafin']) ? $_GET['prfechafin'] : null;
        $transaccion->documento = !empty($_GET['prdocumento']) ? $_GET['prdocumento'] : '';
        $transaccion->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : 1;
        $transaccion->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : 20;
        $transaccion->orden = !empty($_GET['orden']) ? $_GET['orden'] : 'almacen asc';

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