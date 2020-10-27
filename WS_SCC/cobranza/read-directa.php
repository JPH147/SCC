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

        $cobranza->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : "";
        $cobranza->banco = !empty($_GET['prbanco']) ? trim($_GET['prbanco']) : 0;
        $cobranza->operacion = !empty($_GET['properacion']) ? trim($_GET['properacion']) : "";
        $cobranza->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
        $cobranza->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;
        $cobranza->validado = !empty($_GET['prvalidado']) ? trim($_GET['prvalidado']) : -1;
        $cobranza->numero_pagina = !empty($_GET['prnumeropagina']) ? trim($_GET['prnumeropagina']) : 1;
        $cobranza->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;
        $cobranza->orden = !empty($_GET['prorden']) ? trim($_GET['prorden']) : "id desc";
        
        $cobranzas_list = $cobranza->read_cobranza_directa();
        $cobranzas_total = $cobranza->contar_cobranza_directa();

        if (count(array_filter($cobranzas_list))>0)
        { 
            print_json("0000", $cobranzas_total, $cobranzas_list);
        }
        else
        { print_json("0001", $cobranzas_total, $cobranzas_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>