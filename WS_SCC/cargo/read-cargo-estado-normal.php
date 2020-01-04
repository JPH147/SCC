<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cargo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cargo = new Cargo($db);

        $cargo->institucion = !empty($_GET['prinstitucion']) ? trim($_GET['prinstitucion']) : '' ;
        $cargo->sede = !empty($_GET['prsede']) ? trim($_GET['prsede']) : '' ;
        $cargo->cargo_estado = !empty($_GET['prcargoestado']) ? trim($_GET['prcargoestado']) : '' ;
        $cargo->pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1 ;
        $cargo->totalpagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10 ;

        $cliente_list = $cargo->read_cargo_estado_normal();
        $cliente_total = $cargo->read_cargo_estado_normal_contar();
        
        if (count(array_filter($cliente_list))>0)
        { 
            print_json("0000", $cliente_total, $cliente_list);
         }
        else
        { print_json("0001", $cliente_total, 1); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>