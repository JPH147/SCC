<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/clientetelefono.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $clientetelefono = new ClienteTelefono($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["id_cliente"])!=null  && !empty(trim($_POST["tlf_numero"]))
        && !empty(trim($_POST["tlf_observacion"])) && ($_POST["id_tipo"])!=null 
        && ($_POST["tlf_relevancia"])!=null )
        {
            $clientetelefono->id_cliente = trim($_POST["id_cliente"]);
            $clientetelefono->tlf_numero = trim($_POST["tlf_numero"]);
            $clientetelefono->tlf_observacion =trim($_POST["tlf_observacion"]);
            $clientetelefono->id_tipo = trim($_POST["id_tipo"]);
            $clientetelefono->tlf_relevancia = trim($_POST["tlf_relevancia"]);

            if($clientetelefono->create())
            {
                print_json("0000", "Se creó el telefono satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el telefono.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el cliente.", $exception->getMessage());
    }

?>