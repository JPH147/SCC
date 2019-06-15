<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/trabajador.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $trabajador = new Trabajador($db);

        $trabajador->documento = !empty($_GET['prdocumento']) ? trim($_GET['prdocumento']) : '';

        $trabajador_list = $trabajador->read_documento();

        $trabajador_list = array(
            "id_trabajador"=>$trabajador->id_trabajador,
            "documento"=>$trabajador->documento,
            "nombre"=>$trabajador->nombre,
            "cargo"=>$trabajador->cargo,
            "hora_ingreso"=>$trabajador->hora_ingreso,
            "hora_salida"=>$trabajador->hora_salida,
            "foto"=>$trabajador->foto,
	    );

        if (count(array_filter($trabajador_list))>0)
        { 
            print_json("0000", 1, $trabajador_list);
        }
        else
        { print_json("0001", 0, null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>