<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/capacidad-pago.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    $data = json_decode(file_get_contents('php://input'), true);
    
    try
    {
        $capacidad = new Capacidad($db);

        if (trim($_POST["prcliente"])!=null && trim($_POST["prfecha"])!=null)
        {
            $capacidad->id_cliente = trim($_POST["prcliente"]);
            $capacidad->fecha = trim($_POST["prfecha"]);

            if($capacidad->delete())
            {
                print_json("0000", "Se eliminó la capacidad satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar la capacidad.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la capacidad.", $exception->getMessage());
    }

?>