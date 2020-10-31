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

        if ( ($_POST["prid"])!=null )
        {
            $cobranza->cobranza_manual=trim($_POST["prid"]);

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($cobranza->delete_cobranza_manual())
            {
              $log->create($usuario_alvis, 17, 3, $cobranza->id_cobranza) ;
              print_json("0000", "Se eliminó la cobranza satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar la cobranza.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la cobranza.", $exception->getMessage());
    }

?>