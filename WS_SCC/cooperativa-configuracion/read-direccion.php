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

        $cooperativa->departamento = !empty($_GET['prdepartamento']) ? trim($_GET['prdepartamento']) :'';
        $cooperativa->provincia = !empty($_GET['prprovincia']) ? trim($_GET['prprovincia']) :'';
        $cooperativa->distrito = !empty($_GET['prdistrito']) ? trim($_GET['prdistrito']) : '';
        $cooperativa->direccion = !empty($_GET['prdireccion']) ? trim($_GET['prdireccion']) : '';
        $cooperativa->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 0;
        $cooperativa->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $cooperativa->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $cooperativa_list = $cooperativa->read();
        $cooperativa_contar = $cooperativa->contar();

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