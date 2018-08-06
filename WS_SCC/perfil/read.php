<?php

    //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/perfil.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

try
{
    $perfil = new Perfil($db);
    $result = $perfil->read();
    $num = $result->rowCount();

    if($num>0)
    {
        $perfil_list=array();
        $perfil_list["perfiles"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $perfil_item = array (
                "idperfil"=>$idperfil,
                "prf_nombre"=>$prf_nombre
            );

            array_push($perfil_list["perfiles"],$perfil_item);
        }
        print_json("0000", "OK", $perfil_list);
    }
    else
    {
        print_json("0001", "No existen perfiles registrados", null);

    }
}
catch(Exception $exception)
{
    print_json("9999", "Ocurrió un error", $exception->getMessage());
}

?>