<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/vendedor.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $vendedor = new Vendedor($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (trim($_POST["prventa"])!=null)
        {
            $vendedor->venta = trim($_POST["prventa"]);
            $vendedor->vendedor = trim($_POST["prvendedor"]);
            $vendedor->monto = trim($_POST["prmonto"]);

            if($vendedor->create_comision())
            {
                print_json("0000", "Se creó la comisión satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la comisión.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar ela comisión.", $exception->getMessage());
    }

?>