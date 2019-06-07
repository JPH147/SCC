<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../config/database.php';
    include_once '../shared/utilities.php';
    include_once '../entities/cobranza.php';

    $database = new Database();
    $db = $database->getConnection();

    $cobranza = new Cobranzas($db);

    $cobranza->archivo= trim($_POST['prarchivo']);
    $cobranza->contenido= trim($_POST['contenido']);

    // $cobranza->generar_pnp();

    if ($cobranza->generar_pnp())
    {
        print_json("0000", "0", true);
    }
    else
    {
        print_json("0001", "1", "Ocurrió un error");
    }


?>