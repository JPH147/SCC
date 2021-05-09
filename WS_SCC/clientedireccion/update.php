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

        if (($_POST["priddireccion"])!=null)
        {
            $clientedir->idcliente_direccion = trim($_POST["priddireccion"]);
            $clientedir->drc_nombre = trim($_POST["drc_nombre"]);
            $clientedir->id_distrito = trim($_POST["pid_distrito"]);
            $clientedir->referencia = trim($_POST["prreferencia"]);

            if($clientedir->update())
            {
                print_json("0000", "Se actualizó la dirección satisfactoriamente.", "");
            }
            else
            {
                print_json("9990", "Ocurrió un error al actualizar la dirección.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la dirección.", $exception->getMessage());
    }

?>