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
            $salida->cabecera = trim($_POST["prid"]);
            $salida->fecha = trim($_POST["prfecha"]);
            $salida->destino = trim($_POST["prdestino"]);
            $salida->guia = trim($_POST["prguia"]);
            $salida->vehiculo = trim($_POST["prvehiculo"]);
            $salida->chofer_dni = trim($_POST["prchoferdni"]);
            $salida->chofer_nombre = trim($_POST["prchofernombre"]);
            $salida->observacion = trim($_POST["probservacion"]);

            if($salida->update())
            {
                print_json("0000", "Se actualizó la salida satisfactoriamente.", $salida->cabecera);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar la salida.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un actualizar al crear la salida.", $exception->getMessage());
    }

?>