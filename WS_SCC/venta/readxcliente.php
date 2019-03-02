<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $venta = new Venta($db);

        $venta->id_cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : null;
        $venta->talonario_serie = !empty($_GET['prtalonarioserie']) ? trim($_GET['prtalonarioseerie']) : '';
        $venta->talonario_numero = !empty($_GET['prtalonarionumero']) ? trim($_GET['prtalonarionumero']) : '';
        $venta->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 0;
        $venta->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $venta->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 5;

        $venta_list = $venta->readxcliente();
        $venta_contar = $venta->readxclientecontar();

        if (count(array_filter($venta_list))>0)
        { 
            print_json("0000", $venta_contar, $venta_list);
        }
        else
        { print_json("0001", $venta_contar, $venta_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>