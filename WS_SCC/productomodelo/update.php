<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/productomodelo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $modelo = new Modelo($db);
        $data = json_decode(file_get_contents('php://input'),true);

        if(($_POST["id"])!=null &&  ($_POST["idmarca"])!=null  &&  ($_POST["modelo"])!=null )
        {
            $modelo->id_modelo = $_POST["id"];
            $modelo->id_marca = $_POST["idmarca"];
            $modelo->mdl_nombre = trim($_POST["modelo"]);


            if($modelo->update())
            {
                print_json("0000", "Se actualizó el modelo satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar el modelo.", "");
            }
        }
        else
        {
                print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el modelo.", $exception->getMessage());
    }

?>