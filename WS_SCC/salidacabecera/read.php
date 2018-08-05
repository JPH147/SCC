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

        $salida->pecosa = !empty($_GET['prpecosa']) ? $_GET['prpecosa'] :null;
        $salida->id_sucursal = !empty($_GET['prtipo']) ? $_GET['prtipo'] :null;
        $salida->fecha_inicio = !empty($_GET['prfechainicio']) ? $_GET['prfechainicio'] : null;
        $salida->fecha_fin = !empty($_GET['prfechafin']) ? $_GET['prfechafin'] : null;
        $salida->destino = !empty($_GET['prdestino']) ? $_GET['prdestino'] : '';
        $salida->id_tipo_movilidad = !empty($_GET['prtipomovilidad']) ? $_GET['prtipomovilidad'] : null;
        $salida->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : 1;
        $salida->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : 20;
        $salida->orden = !empty($_GET['orden']) ? $_GET['orden'] : 'pecosa desc';

        $salida_list = $salida->read();
       // $transaccion_contar = $transaccion->contar();

        if (count(array_filter($salida_list))>0)
        { 
            //print_json("0000", $transaccion_contar, $salida_list);
            print_json("0000", 1, $salida_list);
        }
        else
        { print_json("0001", 0, $salida_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>