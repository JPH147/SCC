<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/salidacabecera.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $salida = new SalidaCabecera($db);

        $salida->pecosa = !empty($_GET['prpecosa']) ? trim($_GET['prpecosa']) :"";
        $salida->id_sucursal = !empty($_GET['prtipo']) ? trim($_GET['prtipo']) :null;
        $salida->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio'] ): null;
        $salida->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin'] ): null;
        $salida->destino = !empty($_GET['prdestino']) ? trim($_GET['prdestino']) : '';
        $salida->vendedor = !empty($_GET['prvendedor']) ? trim($_GET['prvendedor']) : '';
        $salida->estado = !empty($_GET['prestado']) ? trim($_GET['prestado'] ): 0;
        $salida->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $salida->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;
        $salida->orden = !empty($_GET['orden']) ? trim($_GET['orden']) : 'id desc';

        $salida_list = $salida->read();
        $salida_contar = $salida->contar();

        if (count(array_filter($salida_list))>0)
        { 
            print_json("0000", $salida_contar, $salida_list);
        }
        else
        { print_json("0001", 0, $salida_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>