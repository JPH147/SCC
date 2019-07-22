<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/presupuesto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $presupuesto = new Presupuesto($db);
        // $data = json_decode(file_get_contents('php://input'), true);

        if (trim($_POST["prid"])!=null)
        {
            $presupuesto->id_presupuesto = trim($_POST["prid"]);
            $presupuesto->estado = trim($_POST["prestado"]);

            if($presupuesto->update())
            {
                print_json("0000", "Se actualizó el presupuesto satisfactoriamente.", $presupuesto->id_presupuesto);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar el presupuesto.", $_POST);
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el presupuesto.", $exception->getMessage());
    }

?>