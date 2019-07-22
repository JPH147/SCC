<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/seguimiento.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $seguimiento = new Seguimiento($db);
        $data = json_decode(file_get_contents('php://input'), true);

        
        if ( ( $_POST["prid"] ) != null )
        {
            $seguimiento->id_seguimiento=trim($_POST["prid"]);
            $seguimiento->fecha=trim($_POST["prfecha"]);
            $seguimiento->usuario=trim($_POST["prusuario"]);

            if($seguimiento->registrar_entrega())
            {
                print_json("0000", "Se actualizó el seguimiento satisfactoriamente.", $seguimiento->id_seguimiento);
            }
            else
            {
                print_json("0001", "Ocurrió un error al actualizar el seguimiento.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch( Exception $exception )
    {
        print_json("9999", "Ocurrió un error al actualizar el seguimiento.", $exception->getMessage());
    }

?>