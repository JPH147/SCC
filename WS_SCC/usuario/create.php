<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/usuario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $usuario = new Usuario($db);

        $data = json_decode(file_get_contents('php://input'), true);

        if (!empty(trim($_POST["usr_nombre"])) && !empty(trim($_POST["usr_usuario"]))
            && !empty(trim($_POST["usr_clave"])) && trim($_POST["usr_fechacreacion"])!= null 
            && trim($_POST["usr_ultimologueo"]) != null && trim($_POST["usr_estado"])!=null
            && trim($_POST["idperfil"])!=null )
        {
            $usuario->usr_nombre = trim($_POST["usr_nombre"]);
            $usuario->usr_usuario = trim($_POST["usr_usuario"]);
            $usuario->usr_clave = password_hash(trim($_POST["usr_clave"]), PASSWORD_DEFAULT);
            $usuario->usr_fechacreacion = trim($_POST["usr_fechacreacion"]);
            $usuario->usr_ultimologueo = trim($_POST["usr_ultimologueo"]);
            $usuario->usr_estado = trim($_POST["usr_estado"]);
            $usuario->idperfil = trim($_POST["idperfil"]);

            if($usuario->create())
            {
                print_json("0000", "Se creó el usuario satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el usuario.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el usuario.", $exception->getMessage());
    }

?>