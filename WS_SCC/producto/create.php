<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/producto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $producto = new Producto($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["id_modelo"])!=null  && !empty(trim($_POST["prd_descripcion"])))
        {
            $producto->id_modelo = trim($_POST["id_modelo"]);
            $producto->prd_descripcion = trim($_POST["prd_descripcion"]);

            if($producto->create())
            {
                print_json("0000", "Se creó el producto satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el producto.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el producto.", $exception->getMessage());
    }

?>