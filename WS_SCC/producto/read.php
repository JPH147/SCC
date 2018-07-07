<?php

    //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/producto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

try
{
    $producto = new Producto($db);
    $result = $producto->read();
    $num = $result->rowCount();

    if($num>0)
    {
        $productos=array();
        $productos["productos"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $perfil_item = array (
                "idperfil"=>$idperfil,
                "prf_nombre"=>$prf_nombre
            );

            array_push($productos["productos"],$perfil_item);
        }
        print_json("0000", "OK", $productos);
    }
    else
    {
        print_json("0001", "No existen productos registrados", null);

    }
}
catch(Exception $exception)
{
    print_json("9999", "Ocurrió un error", $exception->getMessage());
}

?>