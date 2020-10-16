<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cooperativa-configuracion.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cooperativa = new Cooperativa($db);

        $cooperativa->banco = !empty($_GET['prbanco']) ? trim($_GET['prbanco']) : 0 ;
        $cooperativa->titular = !empty($_GET['prtitular']) ? trim($_GET['prtitular']) : "" ;
        $cooperativa->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1 ;
        $cooperativa->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20 ;

        $cooperativa_list = $cooperativa->read_cuenta();
        $cooperativa_contar = $cooperativa->contar_cuenta();

        if (count(array_filter($cooperativa_list))>0)
        { 
            print_json("0000", $cooperativa_contar, $cooperativa_list);
        }
        else
        { print_json("0001", $cooperativa_contar, $cooperativa_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>