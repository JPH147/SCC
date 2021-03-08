<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $cobranza = new Cobranzas($db);

        if (($_POST["prliquidacion"])!=null)
        {
            $cobranza->id_liquidacion = trim($_POST["prliquidacion"]) ;

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;
            if($cobranza->delete_liquidacion())
            {
                $log->create($usuario_alvis, 19, 3, $cobranza->id_liquidacion) ;
                print_json("0000", "Se eliminó la liquidacion satisfactoriamente.", $cobranza->id_liquidacion);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar la liquidacion.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la liquidacion.", $exception->getMessage());
    }

?>