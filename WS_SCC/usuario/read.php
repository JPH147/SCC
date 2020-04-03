<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");  //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/usuario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $usuario = new Usuario($db);

        $usuario->usr_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : "" ;
        $usuario->usr_usuario = !empty($_GET['prusuario']) ? trim($_GET['prusuario']) : "" ;
        $usuario->prf_nombre = !empty($_GET['prperfil']) ? trim($_GET['prperfil']) : "" ;
        $usuario->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1 ;
        $usuario->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20 ;

        $usuario_list = $usuario->read();
        $usuario_total = $usuario->contar();

        if (count(array_filter($usuario_list))>0)
        {
            print_json("0000", $usuario_total, $usuario_list);
        }
        else
        {
            print_json("0001", "No existen usuarios registrados", false);
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>