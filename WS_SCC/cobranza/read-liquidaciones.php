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

        $cobranza->tipo_transaccion = !empty($_GET['prtipotransaccion']) ? trim($_GET['prtipotransaccion']) : 0 ;
        $cobranza->codigo = !empty($_GET['prcodigo']) ? trim($_GET['prcodigo']) : "" ;
        $cobranza->cliente_dni = !empty($_GET['prclientedni']) ? trim($_GET['prclientedni']) : "" ;
        $cobranza->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : "" ;
        $cobranza->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null ;
        $cobranza->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null ;
        $cobranza->usuario = !empty($_GET['prusuario']) ? trim($_GET['prusuario']) : "" ;
        $cobranza->numero_pagina = !empty($_GET['prnumeropagina']) ? trim($_GET['prnumeropagina']) :  1 ;
        $cobranza->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) :  20 ;
        $cobranza->orden = !empty($_GET['prorden']) ? trim($_GET['prorden']) : "id_liquidacion asc" ;
        
        $cobranza_list = $cobranza->read_liquidaciones();
        $cobranza_contar = $cobranza->read_liquidaciones_contar();

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