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

        if (($_POST["prtalonario"])!=null)
        {
            $salida->talonario = trim($_POST["prtalonario"]);
            $salida->estado = trim($_POST["prestado"]);

            if($salida->create_llegada_talonarios())
            {
                print_json("0000", "Se actualizó el talonario satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar el talonario.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el talonario.", $exception->getMessage());
    }

?>