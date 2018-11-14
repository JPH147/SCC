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

        if (($_POST["prpecosa"])!=null)
        {
            $salida->pecosa = trim($_POST["prpecosa"]);
            $salida->id_sucursal = trim($_POST["prsucursal"]);
            $salida->fecha = trim($_POST["prfecha"]);
            $salida->destino = trim($_POST["prdestino"]);
            $salida->guia = trim($_POST["prguia"]);
            $salida->tipo_movilidad = trim($_POST["prmovilidad"]);
            $salida->observacion = !empty($_POST["probservacion"]) ? trim($_POST["probservacion"]) : '';

            if($salida->create())
            {
                print_json("0000", "Se creó la salida satisfactoriamente.", $salida->id);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la salida.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear la salida.", $exception->getMessage());
    }

?>