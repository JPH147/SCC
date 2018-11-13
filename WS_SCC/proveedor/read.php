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
        $proveedor = new Proveedor($db);

        $proveedor->tipo_documento = !empty($_GET['prtipodocumento']) ? trim($_GET['prtipodocumento']) : null;
        $proveedor->prv_documento = !empty($_GET['prdocumento']) ? trim($_GET['prdocumento']) : '';
        $proveedor->prv_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $proveedor->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $proveedor->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $proveedor_list = $proveedor->read();
        $contar = $proveedor->contar();

        if ( $contar>0)
        { 
            print_json("0000", $contar, $proveedor_list);
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