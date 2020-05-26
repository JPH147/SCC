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

        $cliente->clt_codigo = !empty($_GET['prcodigo']) ? trim($_GET['prcodigo']) : '';
        $cliente->clt_cip = !empty($_GET['prcip']) ? trim($_GET['prcip']) : '';
        $cliente->clt_dni = !empty($_GET['prdni']) ? trim($_GET['prdni']) : '';
        $cliente->clt_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $cliente->inst_nombre = !empty($_GET['prinstitucion']) ? trim($_GET['prinstitucion']) : '';
        $cliente->sd_nombre = !empty($_GET['prsede']) ? trim($_GET['prsede']) : '';
        $cliente->prpagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $cliente->prtotalpagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;
        $cliente->clt_estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 1;

        $cliente_list = $cliente->read();
        $cliente_contar = $cliente->contar();
        
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