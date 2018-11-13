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

    $usuario->idusuario = !empty($_GET['pidusuario']) ? trim($_GET['pidusuario']) : null;
    $usuario->usr_nombre = !empty($_GET['pusr_nombre']) ? trim($_GET['pusr_nombre']) : null;
    $usuario->usr_usuario = !empty($_GET['pusr_usuario']) ? trim($_GET['pusr_usuario']) : null;
    $usuario->usr_ultimologueo = !empty($_GET['pusr_ultimologueo']) ? trim($_GET['pusr_ultimologueo']) : null;
    $usuario->usr_fechacreacion = !empty($_GET['pusr_fechacreacion']) ? trim($_GET['pusr_fechacreacion']) : null;
    $usuario->usr_estado = !empty($_GET['pusr_estado']) ? trim($_GET['pusr_estado']) : null;
    $usuario->idperfil = !empty($_GET['pidperfil']) ? trim($_GET['pidperfil']) : null;

    $usuario_list = $usuario->read();
    if (count(array_filter($usuario_list))>0)
    {
        print_json("0000", "OK", $usuario_list);
    }
    else
    {
        print_json("0001", "No existen usuarios registrados", null);

    }
}
catch(Exception $exception)
{
    print_json("9999", "Ocurrió un error", $exception->getMessage());
}

?>