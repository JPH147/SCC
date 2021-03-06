<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/clienteobservacion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $observacion = new ClienteObservacion($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prcliente"])!=null)
        {
            $observacion->id_cliente = trim($_POST["prcliente"]);
            $observacion->fecha = trim($_POST["prfecha"]);
            $observacion->observacion = trim($_POST["probservacion"]);
            $observacion->archivo = trim($_POST["prarchivo"]);

            if($observacion->create())
            {
                print_json("0000", "Se creó la observación satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la observación.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la observación.", $exception->getMessage());
    }

?>