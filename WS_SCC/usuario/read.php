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
    $result = $usuario->read();
    $num = $result->rowCount();

    if($num>0)
    {
        $usuarios_list=array();
        $usuarios_list["usuarios"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            http_response_code(200);
            $usuario_item = array (
                "idusuario"=>$idusuario,
                "usr_nombre"=>$usr_nombre,
                "usr_usuario"=>$usr_usuario,
                "usr_fechacreacion"=>$usr_fechacreacion,
                "usr_ultimologueo"=>$usr_ultimologueo,
                "usr_estado"=>$usr_estado,
                "prf_nombre"=>$prf_nombre
            );

            array_push($usuarios_list["usuarios"],$usuario_item);
        }
        print_json("0000", "OK", $usuarios_list);
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