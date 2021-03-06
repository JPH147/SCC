<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/salidacabecera.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $salida = new SalidaCabecera($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prid"])!=null)
        {
            $salida->id_salida = trim($_POST["prid"]);
            $salida->fecha = trim($_POST["prfecha"]);
            $salida->vendedor = trim($_POST["prvendedor"]);
            $salida->monto = trim($_POST["prmonto"]);
            $salida->tipo = trim($_POST["prtipo"]);
            $salida->observacion = trim($_POST["probservacion"]);

            if($salida->create_gasto())
            {
                print_json("0000", "Se creó el gasto satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el gasto.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el gasto.", $exception->getMessage());
    }

?>