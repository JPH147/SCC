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
        // $data = json_decode(file_get_contents('php://input'), true);

        if (trim($_POST["prcliente"])!=null)
        {
            $capacidad->id_cliente = trim($_POST["prcliente"]);
            $capacidad->monto = trim($_POST["prmonto"]);
            $capacidad->tipo = trim($_POST["prtipo"]);
            $capacidad->fecha = trim($_POST["prfecha"]);

            if($capacidad->create())
            {
                print_json("0000", "Se creó la capacidad satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la capacidad.", "");
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