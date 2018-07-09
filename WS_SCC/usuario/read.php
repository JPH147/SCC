<?php

    //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/usuario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

try
{
    $usuario = new Usuario($db);

    $usuario->idusuario = !empty($_GET['pidusuario']) ? $_GET['pidusuario'] : null;
    $usuario->usr_nombre = !empty($_GET['pusr_nombre']) ? $_GET['pusr_nombre'] : null;
    $usuario->usr_usuario = !empty($_GET['pusr_usuario']) ? $_GET['pusr_usuario'] : null;
    $usuario->usr_ultimologueo = !empty($_GET['pusr_ultimologueo']) ? $_GET['pusr_ultimologueo'] : null;
    $usuario->usr_fechacreacion = !empty($_GET['pusr_fechacreacion']) ? $_GET['pusr_fechacreacion'] : null;
    $usuario->usr_estado = !empty($_GET['pusr_estado']) ? $_GET['pusr_estado'] : null;
    $usuario->idperfil = !empty($_GET['pidperfil']) ? $_GET['pidperfil'] : null;

    $usuario_list = $usuario->read();
    if (count(array_filter($usuario_list))>0)
    {
        print_json("0000", count(array_filter($usuario_list)), $usuario_list);
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