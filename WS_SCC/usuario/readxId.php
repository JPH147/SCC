<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/database.php';
include_once '../entities/usuario.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
$usuario = new Usuario($db);
try
{
    $usuario->idusuario = isset($_GET['idusuario']) ? $_GET['idusuario'] : die();
    
    $usuario->readxId();

    $usuario_list = array(
        "usr_nombre"=>$usuario->usr_nombre,
        "usr_usuario"=>$usuario->usr_usuario,
        "usr_fechacreacion"=>$usuario->usr_fechacreacion,
        "usr_ultimologueo"=>$usuario->usr_ultimologueo,
        "usr_estado"=>$usuario->usr_estado,
        "prf_nombre"=>$usuario->prf_nombre
    );

    if(trim($usuario->usr_nombre)!= null && trim($usuario->usr_usuario)!=null){
        print_json("0000", "OK", $usuario_list);
    }
    else{
        print_json("0001", "No se encuentra usuario registrado con el id " . $usuario->idusuario , null);

    }

}
catch(Exception $exception){
    print_json("9999", "Ocurrió un error.", $exception->getMessage());
}
?>