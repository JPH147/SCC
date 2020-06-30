<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
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
    if(!empty(trim($_POST['usr_usuario'])) && !empty(trim($_POST['usr_clave'])))
    {
        $usuario->usr_usuario = trim($_POST['usr_usuario']);
        $usuario->usr_clave = trim($_POST['usr_clave']);

        $var=$usuario->login($usuario->usr_usuario,$usuario->usr_clave) ;

        if($var != null){

            $usuario_list = array(
                "usuario"=>$var->usr_nombre,
                "rol"=>$var->usr_usuario,
                "id_perfil"=>$var->idperfil,
                "perfil"=>$var->prf_nombre ,
                "permisos"=>json_decode($var->permisos) ,
            );
            print_json("0000", "Login OK", $usuario_list);
        }
        else{
            print_json("0001", "Usuario o contraseña incorrecto" , null);
        }
    }
    else{
        print_json("0002", "Usuario y contraseña no pueden estar vacíos." , null);
    }

}
catch(Exception $exception){
    print_json("9999", "Ocurrió un error.", $exception->getMessage());
}
?>