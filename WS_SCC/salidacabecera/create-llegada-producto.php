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

        if (($_POST["prserie"])!=null)
        {
            $salida->id_serie = trim($_POST["prserie"]);
            $salida->id_salida = trim($_POST["prsalida"]);
            $salida->almacen = trim($_POST["pralmacen"]);
            $salida->precio = trim($_POST["prprecio"]);
            $salida->fecha = trim($_POST["prfecha"]);
            $salida->documento = trim($_POST["prdocumento"]);

            if($salida->create_llegada_productos())
            {
                print_json("0000", "Se actualizó el producto satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar el producto.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el producto.", $exception->getMessage());
    }

?>