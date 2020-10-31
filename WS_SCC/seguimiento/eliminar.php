<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/seguimiento.php';
    include_once '../entities/log.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $seguimiento = new Seguimiento($db);
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (($_POST["prid"])!=null)
        {

            $seguimiento->id_seguimiento=trim($_POST["prid"]);

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($seguimiento->eliminar())
            {
                $log->create($usuario_alvis, 5, 3, $id_seguimiento) ;
                print_json("0000", "Se eliminó el seguimiento satisfactoriamente.", $seguimiento->id_seguimiento);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar el seguimiento.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el seguimiento.", $exception->getMessage());
    }

?>