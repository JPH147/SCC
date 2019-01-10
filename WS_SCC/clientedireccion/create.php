<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/clientedireccion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $clientedir = new ClienteDireccion($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["id_cliente"])!=null)
        {
            $clientedir->id_cliente = trim($_POST["id_cliente"]);
            $clientedir->drc_nombre = trim($_POST["drc_nombre"]);
            $clientedir->id_distrito = trim($_POST["pid_distrito"]);
            $clientedir->drc_relevancia = trim($_POST["drc_relevancia"]);
            $clientedir->drc_observacion = trim($_POST["drc_observacion"]);

            if($clientedir->create())
            {
                print_json("0000", "Se creó la dirección satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la dirección.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la dirección.", $exception->getMessage());
    }

?>