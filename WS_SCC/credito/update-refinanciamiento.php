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
        
        if (($_POST["prnuevocredito"])!=null)
        {
            $credito->id_credito=trim($_POST["prnuevocredito"]);
            $credito->tipo=trim($_POST["ptipo"]);
            $credito->id_transaccion=trim($_POST["prtransaccion"]);

            if($credito->actualizar_transacciones_refinanciadas())
            {
                print_json("0000", "Se actualizó la transacción satisfactoriamente.", $credito->id_credito);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar la transacción.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la transacción.", $exception->getMessage());
    }

?>