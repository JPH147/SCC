<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cobranza = new Cobranzas($db);

        $cobranza->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : "" ;
        $cobranza->cliente_dni = !empty($_GET['prdni']) ? trim($_GET['prdni']) : "" ;
        $cobranza->vendedor = !empty($_GET['prvendedor']) ? trim($_GET['prvendedor']) : "" ;
        $cobranza->tipo = !empty($_GET['prtipo']) ? trim($_GET['prtipo']) : 0 ;
        $cobranza->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null ;
        $cobranza->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null ;
        $cobranza->numero_pagina = !empty($_GET['prnumeropagina']) ? trim($_GET['prnumeropagina']) :  die() ;
        $cobranza->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) :  die() ;

        $cobranza_list = $cobranza->read_cobranzas_manuales();
        $cobranza_contar = $cobranza->contar_cobranzas_manuales();

        if (count(array_filter($cobranza_list))>0)
        { 
            print_json("0000", $cobranza_contar, $cobranza_list);
        }
        else
        {
            print_json("0001", $cobranza_contar, $cobranza_list);
        }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>