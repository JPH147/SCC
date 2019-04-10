<?php

    //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/almacen.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

try
{
    $almacen = new Almacen($db);

    $almacen->id_sucursal = !empty($_GET['prsucursal']) ? trim($_GET['prsucursal']) :"";    

    $almacen_list = $almacen->read_sucursal();

    if (count(array_filter($almacen_list))>0)
    {
        print_json("0000", "OK", $almacen_list);
    }
    else
    {
        print_json("0001", "No existen almacenes registrados", null);

    }
}
catch(Exception $exception)
{
    print_json("9999", "Ocurrió un error", $exception->getMessage());
}

?>