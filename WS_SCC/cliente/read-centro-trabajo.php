<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cliente = new Cliente($db);

        $cliente->departamento = !empty($_GET['prdepartamento']) ? trim($_GET['prdepartamento']) : '';
        $cliente->provincia = !empty($_GET['prprovincia']) ? trim($_GET['prprovincia']) : '';
        $cliente->distrito = !empty($_GET['prdistrito']) ? trim($_GET['prdistrito']) : '';
        $cliente->comisaria = !empty($_GET['prcomisaria']) ? trim($_GET['prcomisaria']) : '';
        $cliente->division = !empty($_GET['prdivision']) ? trim($_GET['prdivision']) : '';
        $cliente->telefono = !empty($_GET['prtelefono']) ? trim($_GET['prtelefono']) : '';
        $cliente->direccion = !empty($_GET['prdireccion']) ? trim($_GET['prdireccion']) : '';
        $cliente->pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $cliente->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

        $cliente_list = $cliente->read_centro_trabajo();
        $cliente_contar = $cliente->read_centro_trabajo_contar();
        
        if (count(array_filter($cliente_list))>0)
        { 
            print_json("0000", $cliente_contar, $cliente_list);
         }
        else
        { print_json("0001", $cliente_contar, $cliente_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>