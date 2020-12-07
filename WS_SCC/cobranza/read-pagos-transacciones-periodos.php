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

        $cobranza->tipo_transaccion = !empty($_GET['prtipotransaccion']) ? trim($_GET['prtipotransaccion']) : null ;
        $cobranza->transaccion = !empty($_GET['prtransaccion']) ? trim($_GET['prtransaccion']) : null ;
        $cobranza->periodo = !empty($_GET['prperiodo']) ? trim($_GET['prperiodo']) : null ;
        $cobranza->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1 ;
        $cobranza->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 5 ;

        $pagos_list = $cobranza->read_pagos_cuotas_periodos();
        $pagos_total = $cobranza->contar_pagos_cuotas_periodos();

        if (count(array_filter($pagos_list))>0)
        { 
            print_json("0000", $pagos_total, $pagos_list);
        }
        else
        { print_json("0001", $pagos_total, $pagos_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>