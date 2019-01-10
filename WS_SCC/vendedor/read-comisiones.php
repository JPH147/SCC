<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/vendedor.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $vendedor = new Vendedor($db);

        $vendedor->comisiones_efectivas_estado = !empty($_GET['prestadoefectivas']) ? trim($_GET['prestadoefectivas']) : 1;
        $vendedor->comisiones_retenidas_estado = !empty($_GET['prestadoretenidas']) ? trim($_GET['prestadoretenidas']) : 1;
        $vendedor->vendedor = !empty($_GET['prvendedor']) ? trim($_GET['prvendedor']) : "";
        $vendedor->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
        $vendedor->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;
        $vendedor->talonario = !empty($_GET['prtalonario']) ? trim($_GET['prtalonario']) : "";
        $vendedor->contrato = !empty($_GET['prcontrato']) ? trim($_GET['prcontrato']) : "";
        $vendedor->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $vendedor->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

        $vendedor_list = $vendedor->read_comisiones();
        $vendedor_contar = $vendedor->read_comisiones_contar();

        if (count(array_filter($vendedor_list))>0)
        { 
            print_json("0000", $vendedor_contar, $vendedor_list);
        }
        else
        { print_json("0001", $vendedor_contar, $vendedor_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>