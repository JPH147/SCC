<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/transacciondetalle.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $transaccion = new TransaccionDetalle($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prcabecera"])!=null)
        {
            $transaccion->id_cabecera = trim($_POST["prcabecera"]);
            $transaccion->id_producto_serie = trim($_POST["prproductoserie"]);
            $transaccion->cantidad = trim($_POST["prcantidad"]);
            $transaccion->precio =  trim($_POST["prprecio"]);
            $transaccion->observacion =  trim($_POST["probservacion"]);

            if($transaccion->create())
            {
                print_json("0000", "Se creó el detalle satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el detalle.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el detalle.", $exception->getMessage());
    }

?>