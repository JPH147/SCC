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

        if (($_POST["idalmacen"]) !=null && !empty(trim($_POST["alm_nombre"])) && !empty(trim($_POST["alm_descripcion"])))
        {
            $almacen->idalmacen = trim($_POST["idalmacen"]);
            $almacen->alm_nombre = trim($_POST["alm_nombre"]);
            $almacen->alm_descripcion = trim($_POST["alm_descripcion"]);


            if($almacen->update())
            {
                print_json("0000", "Se actualizó el almacen satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar el almacen.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al almacen el almacen.", $exception->getMessage());
    }

?>