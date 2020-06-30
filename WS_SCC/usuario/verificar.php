<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");  //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/usuario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $usuario = new Usuario($db);

        $usuario->usr_usuario = !empty($_POST['prusuario']) ? trim($_POST['prusuario']) : "" ;
        $usuario->idusuario = !empty($_POST['prid']) ? trim($_POST['prid']) : 0 ;

        $usuario_total = $usuario->verificar_usuario();

        if ( $usuario_total >= 0 )
        {
          print_json("0000", $usuario_total, $usuario_total);
        }
        else
        {
          print_json("0001", "No existen usuarios registrados", false);
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>