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

    try{
        $productotipo = new Tipo_Producto($db);
        $data = json_decode(file_get_contents('php://input'),true);

        if(trim($_POST["id"])!=null &&  trim($_POST["nombre"])!=null  &&  trim($_POST["idunidad"])!=null )
        {
            $productotipo->id_tipo_producto = trim($_POST["id"]);
            $productotipo->tprd_nombre = trim($_POST["nombre"]);
            $productotipo->idunidadmedida = trim($_POST["idunidad"]);


            if($productotipo->update())
            {
                    print_json("0000", "Se actualizó el tipo de producto satisfactoriamente.", "");
            }
            else
            {
                    print_json("9999", "Ocurrió un error al actualizar el tipo de producto.", "");
            }
        }
        else
        {
                print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el tipo de producto.", $exception->getMessage());
    }

?>