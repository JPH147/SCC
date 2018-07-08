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
            $lista_productos = array (
                "idproducto"=>$idproducto,
                "id_tipo_producto"=>$id_tipo_producto,
                "id_marca"=>$id_marca,
                "prd_modelo"=>$prd_modelo,
                "prd_descripcion"=>$prd_descripcion,
                "und_nombre"=>$und_nombre
            );

            array_push($productos["productos"],$lista_productos);
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