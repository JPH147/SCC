<?php

    //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/perfil.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $perfil = new Perfil($db);

        $perfil->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : "" ;
        $perfil->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1 ;
        $perfil->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20 ;

        $perfil_list = $perfil->read();
        $perfil_total = $perfil->contar();

        if (count($perfil_list)>0)
        {
            print_json("0000", $perfil_total, $perfil_list);
        }
        else
        {
            print_json("0001", "No existen usuarios registrados", 0);
        }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>