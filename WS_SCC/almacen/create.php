<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/almacen.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $almacen = new Almacen($db);

        $data = json_decode(file_get_contents('php://input'), true);

        if (!empty(trim($_POST["alm_nombre"])) && !empty(trim($_POST["alm_descripcion"]))
            && !empty(trim($_POST["alm_estado"])))
        {
            $almacen->alm_nombre = trim($_POST["alm_nombre"]);
            $almacen->alm_descripcion = trim($_POST["alm_descripcion"]);
            $almacen->alm_estado = trim($_POST["alm_estado"]);


            if($almacen->create())
            {
                print_json("0000", "Se creó el almacen satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el almacen.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el almacen.", $exception->getMessage());
    }

?>