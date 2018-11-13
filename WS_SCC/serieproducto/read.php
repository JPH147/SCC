<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/serieproducto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $producto_serie = new SerieProducto($db);

        $producto_serie->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) : "";
        $producto_serie->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $producto_serie->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;


        $producto_serie_list = $producto_serie->read();
        $contar = $producto_serie->contar();
        
        if ($contar>0)
        { 
  
            print_json("0000", $contar,$producto_serie_list);
         }
        else
        { print_json("0001", "No existen serie registrados", null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>