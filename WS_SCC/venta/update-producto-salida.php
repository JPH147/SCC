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

        
        if (($_POST["prventa"])!=null)
        {

            $venta->id_venta=trim($_POST["prventa"]);
            $venta->producto_serie=trim($_POST["prserie"]);
            $venta->monto=trim($_POST["prmonto"]);

            if($venta->update_productos_salida())
            {
                print_json("0000", "Se actualizó el producto satisfactoriamente.", $venta->id_venta);
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