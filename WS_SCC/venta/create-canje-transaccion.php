<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $venta = new Venta($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prtransaccion"])!=null)
        {

            $venta->id_transaccion=trim($_POST["prtransaccion"]);
            $venta->fecha=trim($_POST["prfecha"]);

            if($venta->create_canje_transaccion())
            {
                print_json("0000", "Se creó la transacción satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la transacción.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la transacción.", $exception->getMessage());
    }

?>