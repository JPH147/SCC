<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/perfil.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();
/* JEAN PAUL */
    try
    {
        $perfil = new Perfil($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (!empty(trim($_POST["prf_nombre"])))
        {
            $perfil->prf_nombre = trim($_POST["prf_nombre"]);

            if($perfil->create())
            {
                print_json("0000", "Se creó el perfil satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el perfil.", "");
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