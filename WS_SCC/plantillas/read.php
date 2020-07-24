<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/plantillas.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $plantilla = new Plantillas($db);

        $plantilla->tipo = !empty($_GET['prtipo']) ? trim($_GET['prtipo']) : 0;
        $plantilla->relevancia = !empty($_GET['prrelevancia']) ? trim($_GET['prrelevancia']) : 0;
        $plantilla->usuario = !empty($_GET['prusuario']) ? trim($_GET['prusuario']) : '';
        $plantilla->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $plantilla->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;
        
        $plantilla_list = $plantilla->read();
        $plantilla_contar = $plantilla->contar();

        if (count(array_filter($plantilla_list))>0)
        { 
            print_json("0000", $plantilla_contar , $plantilla_list);
        }
        else
        { print_json("0001", 0, $plantilla_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>