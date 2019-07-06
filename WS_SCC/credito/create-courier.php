<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $credito = new Creditos($db);
        $data = json_decode(file_get_contents('php://input'), true);

        
        if (($_POST["prcredito"])!=null)
        {

            $credito->id_credito=trim($_POST["prcredito"]);
            $credito->id_courier=trim($_POST["prcourier"]);
            $credito->fecha=trim($_POST["prfecha"]);
            $credito->numero_seguimiento=trim($_POST["prseguimiento"]);
            $credito->pdf_foto=trim($_POST["prpdffoto"]);
            $credito->observacion=trim($_POST["probservacion"]);

            if($credito->crear_credito_courier())
            {
                print_json("0000", "Se creó el courier satisfactoriamente.", $credito->id_credito);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el courier.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el courier.", $exception->getMessage());
    }

?>