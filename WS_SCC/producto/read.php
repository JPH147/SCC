<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/producto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $producto = new Producto($db);

        $producto->tprd_nombre = !empty($_GET['prtipo']) ? trim($_GET['prtipo']) :'';
        $producto->mrc_nombre = !empty($_GET['prmarca']) ? trim($_GET['prmarca']) :'';
        $producto->mdl_nombre = !empty($_GET['prmodelo']) ? trim($_GET['prmodelo']) : '';
        $producto->prd_descripcion = !empty($_GET['prdescripcion']) ? trim($_GET['prdescripcion']) : '';
        $producto->precio_minimo = !empty($_GET['prpreciominimo']) ? trim($_GET['prpreciominimo']) : null;
        $producto->precio_maximo = !empty($_GET['prpreciomaximo']) ? trim($_GET['prpreciomaximo']) : null;
        $producto->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $producto->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;
        $producto->orden = !empty($_GET['orden']) ? trim($_GET['orden']) : 'descripcion asc';
        $producto->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : null;

        $producto_list = $producto->read();
        $producto_contar = $producto->contar();

        if (count(array_filter($producto_list))>0)
        { 
            print_json("0000", $producto_contar, $producto_list);
        }
        else
        { print_json("0001", $producto_contar, $producto_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>