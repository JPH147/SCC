<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/direccionprovincia.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
        $provincia = new Provincia($db);

        $provincia->dpt_nombre = !empty($_GET['prdepartamento']) ? trim($_GET['prdepartamento']) : null;
        $provincia->prv_nombre = !empty($_GET['prprovincia']) ? trim($_GET['prprovincia']) : null;
        $provincia->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : null;
        $provincia->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : null;

        $provincia_list = $provincia->read();
        $provincia_contar = $provincia->contar();

        if (count(array_filter($provincia_list))>0)
        {
            print_json("0000", $provincia_contar,$provincia_list);
        }
        else
        {
            print_json("0001", "No existen distritos registrados", null);
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>