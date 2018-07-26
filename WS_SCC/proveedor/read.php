<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/proveedor.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $proveedor = new proveedor($db);

        $proveedor->tipo_documento = !empty($_GET['prtipodocumento']) ? $_GET['prtipodocumento'] : null;
        $proveedor->prv_documento = !empty($_GET['prdocumento']) ? $_GET['prdocumento'] : null;
        $proveedor->prv_nombre = !empty($_GET['prnombre']) ? $_GET['prnombre'] : null;
        $proveedor->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : null;
        $proveedor->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : null;

        $proveedor_list = $proveedor->read();
        $proveedor_contar = $proveedor->contar();

        if (count(array_filter($proveedor_list))>0)
        { 
            print_json("0000", $proveedor_contar, $proveedor_list);
        }
        else
        { 
            print_json("0001", 0, $proveedor_list);
        }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>