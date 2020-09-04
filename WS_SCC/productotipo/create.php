<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/productotipo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();
/* JEAN PAUL */
    try
    {
        $productotipo = new Tipo_Producto($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (!empty(trim($_POST["tprd_nombre"]) && !empty(trim($_POST["idunidadmedida"]))))
        {
            $productotipo->tprd_nombre = trim($_POST["tprd_nombre"]);
            $productotipo->tiene_serie  = trim($_POST["prtieneserie"]);
            $productotipo->idunidadmedida  = trim($_POST["idunidadmedida"]);

            if($productotipo->create())
            {
                print_json("0000", "Se creó el tipo de producto satisfactoriamente.", $productotipo->id_tipo_producto);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el tipo de producto.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el perfil.", $exception->getMessage());
    }

?>