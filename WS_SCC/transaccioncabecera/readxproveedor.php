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

        $transaccion->id_proveedor = !empty($_GET['pridproveedor']) ? trim($_GET['pridproveedor']) :null;
        $transaccion->producto = !empty($_GET['prproducto']) ? trim($_GET['prproducto']) :'';
        $transaccion->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) : '';
        $transaccion->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
        $transaccion->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']): null;
        $transaccion->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $transaccion->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $transaccion_list = $transaccion->readxproveedor();
        $transaccion_contar = $transaccion->readxproveedorcontar();

        if (count(array_filter($transaccion_list))>0)
        { 
            print_json("0000", $transaccion_contar, $transaccion_list);
        }
        else
        { print_json("0001", 1, $transaccion_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>