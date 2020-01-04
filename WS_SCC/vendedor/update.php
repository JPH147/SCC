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

        if (trim($_POST["prid"])!=null)
        {
            $vendedor->idvendedor = trim($_POST["prid"]);
            $vendedor->documento = trim($_POST["prdocumento"]);
            $vendedor->nombre = trim($_POST["prnombre"]);
            $vendedor->cargo = trim($_POST["prcargo"]);
            $vendedor->email = trim($_POST["premail"]);
            $vendedor->comision = trim($_POST["prcomision"]);

            if($vendedor->update())
            {
                print_json("0000", "Se actualizó al vendedor satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar al vendedor.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar al vendedor.", $exception->getMessage());
    }

?>